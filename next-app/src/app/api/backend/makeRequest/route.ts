import { NextResponse } from 'next/server';
import axios from 'axios';

async function createChat(question: string, answer: string) {
    console.log(`Creating chat for question: "${question}" with answer: "${answer}"`);
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const question = url.searchParams.get('question');
    const translate = url.searchParams.get('translate');

    if (typeof question === 'string' && (typeof translate === 'string' || translate === null)) {
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

                return NextResponse.json(response.data);
            }

            return NextResponse.json({ error: 'No response from external service' }, { status: 500 });
        } catch (error) {
            console.error('Failed to make the request:', error);
            return NextResponse.json({ error: 'Failed to make the request.' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
