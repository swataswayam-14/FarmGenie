import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { userMetrics } from '@/actions/metrics';

export async function GET() {
  const startTime = Date.now();

  try {
    const [userCount, orderData] = await Promise.all([
      db.user.count(),
      db.order.aggregate({
        _sum: { pricePaidInCents: true },
      }),
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;
    userMetrics(duration);

    return NextResponse.json({
      userCount,
      averageValuePerUser: userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
    });
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
