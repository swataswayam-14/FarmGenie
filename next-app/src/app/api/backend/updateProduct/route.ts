import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import fs from 'fs/promises';
import { IncomingForm } from 'formidable';
import { z } from 'zod';
import { adminUpdateProductMetrics } from '@/actions/metrics';
import { NextRequest } from 'next/server';

const fileSchema = z.instanceof(File, { message: 'Required' }).refine(file => file.size > 0, 'Required');
const imageSchema = fileSchema.refine(file => file.type.startsWith('image/'), 'Must be an image');

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

async function parseFormData(req: Request): Promise<FormData> {
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

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    const formData = await parseFormData(req);
    const result = updateSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      return NextResponse.json({ errors: result.error.formErrors.fieldErrors }, { status: 400 });
    }

    const data = result.data;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
    return NextResponse.redirect('/admin/products');
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
