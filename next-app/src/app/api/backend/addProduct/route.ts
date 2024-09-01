import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import fs from 'fs/promises';
import { adminAddProductMetrics } from '@/actions/metrics';
import { db } from '@/app/db';

const fileSchema = z.instanceof(File, {
  message: 'Required',
});

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/'),
);

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, 'Required'),
  image: imageSchema.refine((file) => file.size > 0, 'Required'),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const formData = await parseFormData(req);
      const startTime = Date.now();

      const result = formSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!result.success) {
        return res.status(400).json({ errors: result.error.formErrors.fieldErrors });
      }

      const data = result.data;

      await fs.mkdir('products', { recursive: true });
      const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

      await fs.mkdir('public/products', { recursive: true });
      const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

      await db.product.create({
        data: {
          isAvailableForPurchase: false,
          name: data.name,
          description: data.description,
          priceInCents: data.priceInCents,
          filePath,
          imagePath,
        },
      });

      const endTime = Date.now();
      const duration = endTime - startTime;
      adminAddProductMetrics(duration);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function parseFormData(req: NextApiRequest): Promise<FormData> {
  const { IncomingForm } = await import('formidable');
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      const formData = new FormData();
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value as string);
      }
      for (const [key, file] of Object.entries(files)) {
        formData.append(key, file as File);
      }
      resolve(formData);
    });
  });
}
