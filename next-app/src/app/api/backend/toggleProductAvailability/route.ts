import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import { adminProductAvailableMetrics } from '@/actions/metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, isAvailableForPurchase } = req.body;

    if (typeof id !== 'string' || typeof isAvailableForPurchase !== 'boolean') {
      return res.status(400).json({ error: 'Invalid input' });
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

      await res.revalidate('/marketplace');
      await res.revalidate('/marketplace/products');

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to toggle product availability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
