import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import { productMetrics } from '@/actions/metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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

      return res.status(200).json({
        activeCount,
        inactiveCount,
      });
    } catch (error) {
      console.error('Failed to fetch product data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
