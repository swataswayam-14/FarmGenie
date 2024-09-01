import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import { userMetrics } from '@/actions/metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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

      return res.status(200).json({
        userCount,
        averageValuePerUser: userCount === 0
          ? 0
          : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
