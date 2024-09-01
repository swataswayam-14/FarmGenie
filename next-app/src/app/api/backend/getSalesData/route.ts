import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesMetrics } from '@/actions/metrics';

export async function GET() {
  const startTime = Date.now();
  console.log('hit');

  try {
    const data = await db.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    salesMetrics(duration);

    return NextResponse.json({
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
    });
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
