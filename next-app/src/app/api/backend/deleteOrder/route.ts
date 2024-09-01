import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDeleteProductMetrics } from '@/actions/metrics';
import { db } from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid ID' });
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
                return res.status(404).json({ error: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete order' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
