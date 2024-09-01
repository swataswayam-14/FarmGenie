import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import fs from 'fs/promises';
import { adminDeleteProductMetrics } from '@/actions/metrics';

export async function DELETE(req: Request) {
  const { id }:any = new URL(req.url).searchParams;

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    const product = await db.product.delete({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);

    const endTime = Date.now();
    const duration = endTime - startTime;
    adminDeleteProductMetrics(duration);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
