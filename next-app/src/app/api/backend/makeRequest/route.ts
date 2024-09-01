import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

async function createChat(question: string, answer: string) {
    console.log(`Creating chat for question: "${question}" with answer: "${answer}"`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { question, translate } = req.query;

        if (typeof question === 'string' && (typeof translate === 'string' || typeof translate === 'undefined')) {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://singular-muskox-certainly.ngrok-free.app/searchQuery',
                    params: { userQuery: question },
                    headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' },
                };

                const response = await axios.request(options);

                if (response) {
                    const isTranslate = translate === 'true';
                    const answer = isTranslate ? response.data.eh_translated_result : response.data.answer;
                    await createChat(question, answer);
                }

                res.status(200).json(response.data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to make the request.' });
            }
        } else {
            res.status(400).json({ error: 'Invalid input.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
