import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import { salesMetrics } from '@/actions/metrics';
import { error } from 'console';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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

      return res.status(200).json({
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count,
      });
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    console.log(error);
    
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
