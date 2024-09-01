import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { adminAddProductMetrics } from '@/actions/metrics';
import { db } from '@/app/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const fileSchema = z.instanceof(File, { message: 'Required' });

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

async function parseFormData(req: Request): Promise<FormData> {
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
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

export async function POST(req: Request) {
  try {
    const formData = await parseFormData(req);
    const startTime = Date.now();

    const result = formSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      return NextResponse.json({ errors: result.error.formErrors.fieldErrors }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
