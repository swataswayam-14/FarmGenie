import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { productMetrics } from '@/actions/metrics';

export async function GET() {
  const startTime = Date.now();

  try {
    const [activeCount, inactiveCount] = await Promise.all([
      db.product.count({
        where: { isAvailableForPurchase: true },
      }),
      db.product.count({
        where: { isAvailableForPurchase: false },
      }),
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;
    productMetrics(duration);

    return NextResponse.json({
      activeCount,
      inactiveCount,
    });
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
