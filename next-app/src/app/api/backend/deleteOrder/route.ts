import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { adminDeleteProductMetrics } from '@/actions/metrics';

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const startTime = Date.now();
  
  try {
    const order = await db.order.delete({
      where: { id },
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    adminDeleteProductMetrics(duration);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
