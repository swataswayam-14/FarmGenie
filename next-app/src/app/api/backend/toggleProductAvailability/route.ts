import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { adminProductAvailableMetrics } from '@/actions/metrics';

export async function POST(req: Request) {
  const { id, isAvailableForPurchase } = await req.json();

  if (typeof id !== 'string' || typeof isAvailableForPurchase !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    await db.product.update({
      where: { id },
      data: { isAvailableForPurchase },
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    adminProductAvailableMetrics(duration);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to toggle product availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
