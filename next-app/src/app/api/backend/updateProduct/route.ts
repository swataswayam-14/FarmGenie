import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { z } from 'zod';
import { adminUpdateProductMetrics } from '@/actions/metrics';

export const config = {
  api: {
    bodyParser: false,
  },
};

const fileSchema = z.instanceof(File, { message: 'Required' }).refine(file => file.size > 0, 'Required');
const imageSchema = fileSchema.refine(file => file.type.startsWith('image/'), 'Must be an image');

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

async function parseFormData(req: NextApiRequest): Promise<FormData> {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const startTime = Date.now();

    try {
      const formData = await parseFormData(req);
      const result = updateSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!result.success) {
        return res.status(400).json({ errors: result.error.formErrors.fieldErrors });
      }

      const data = result.data;

      const product = await db.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let filePath = product.filePath;
      if (data.file) {
        await fs.unlink(product.filePath);
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
      }

      let imagePath = product.imagePath;
      if (data.image) {
        await fs.unlink(`public${product.imagePath}`);
        imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
      }
      await db.product.update({
        where: { id },
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
      adminUpdateProductMetrics(duration);
      await res.revalidate('/marketplace');
      await res.revalidate('/marketplace/products');

      res.writeHead(302, { Location: '/admin/products' });
      res.end();
    } catch (error) {
      console.error('Failed to update product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
