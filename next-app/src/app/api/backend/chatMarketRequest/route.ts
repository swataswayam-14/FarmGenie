import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const question = url.searchParams.get('question');

    if (typeof question === 'string') {
        try {
            const options = {
                method: 'GET',
                url: 'https://singular-muskox-certainly.ngrok-free.app/chatShop/searchQuery',
                params: { userQuery: question },
                headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' },
            };
            const response = await axios.request(options);
            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            return NextResponse.json({ content: "" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
