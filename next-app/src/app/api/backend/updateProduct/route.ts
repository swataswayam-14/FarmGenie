import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { z } from 'zod';
import { adminUpdateProductMetrics } from '@/actions/metrics';
import { NextRequest } from 'next/server';

const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  path: z.string(),
}).optional();

const imageSchema = fileSchema.refine(file => file.type.startsWith('image/'), 'Must be an image');

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema,
  image: imageSchema,
});

async function parseFormData(req: NextRequest): Promise<{ fields: any; files: any }> {
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    const { fields, files } = await parseFormData(req);
    const result = updateSchema.safeParse({
      name: fields.name as string,
      description: fields.description as string,
      priceInCents: parseInt(fields.priceInCents as string, 10),
      file: files.file ? {
        name: files.file[0].originalFilename,
        size: files.file[0].size,
        type: files.file[0].mimetype,
        path: files.file[0].filepath,
      } : undefined,
      image: files.image ? {
        name: files.image[0].originalFilename,
        size: files.image[0].size,
        type: files.image[0].mimetype,
        path: files.image[0].filepath,
      } : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ errors: result.error.formErrors.fieldErrors }, { status: 400 });
    }

    const data = result.data;

    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let filePath = product.filePath;
    if (data.file) {
      await fs.unlink(product.filePath);
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.copyFile(data.file.path, filePath);
    }

    let imagePath = product.imagePath;
    if (data.image) {
      await fs.unlink(`public${product.imagePath}`);
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.copyFile(data.image.path, `public${imagePath}`);
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
    return NextResponse.redirect('/admin/products');
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
