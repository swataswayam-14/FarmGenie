import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import fs from 'fs/promises';
import { adminDeleteProductMetrics } from '@/actions/metrics';

export const config = {
  api: {
    bodyParser: true, 
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const startTime = Date.now();

    try {
      const product = await db.product.delete({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await fs.unlink(product.filePath);
      await fs.unlink(`public${product.imagePath}`);

      const endTime = Date.now();
      const duration = endTime - startTime;
      adminDeleteProductMetrics(duration);

      await res.revalidate('/marketplace');
      await res.revalidate('/marketplace/products');

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to delete product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
