import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { adminAddProductMetrics } from '@/actions/metrics';
import { db } from '@/app/db';

// Define a schema for validating file uploads
const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  path: z.string(),
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

// Parse form data using formidable
async function parseFormData(req: Request): Promise<Record<string, any>> {
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({
        fields,
        files: files as Record<string, any>,
      });
    });
  });
}

// Handle POST request
export async function POST(req: Request) {
  try {
    const { fields, files } = await parseFormData(req);
    const startTime = Date.now();

    const result = formSchema.safeParse({
      name: fields.name as string,
      description: fields.description as string,
      priceInCents: parseInt(fields.priceInCents as string, 10),
      file: {
        name: (files.file as any).name,
        size: (files.file as any).size,
        type: (files.file as any).type,
        path: (files.file as any).filepath,
      },
      image: {
        name: (files.image as any).name,
        size: (files.image as any).size,
        type: (files.image as any).type,
        path: (files.image as any).filepath,
      },
    });

    if (!result.success) {
      return NextResponse.json({ errors: result.error.formErrors.fieldErrors }, { status: 400 });
    }

    const data = result.data;

    await fs.mkdir('products', { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.copyFile(data.file.path, filePath);

    await fs.mkdir('public/products', { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.copyFile(data.image.path, `public${imagePath}`);

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

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
