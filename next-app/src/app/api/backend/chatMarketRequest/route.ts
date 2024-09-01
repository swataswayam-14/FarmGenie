import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { question } = req.query;

        if (typeof question === 'string') {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://singular-muskox-certainly.ngrok-free.app/chatShop/searchQuery',
                    params: { userQuery: question },
                    headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' }
                };
                const response = await axios.request(options);
                res.status(200).json(response.data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ content: "" });
            }
        } else {
            res.status(400).json({ error: 'Invalid input' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
