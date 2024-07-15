import { NextResponse } from 'next/server';
import client from 'prom-client';

export async function GET(request: Request) {
    const metrics = await client.register.metrics();
    return new Response(metrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4', // Prometheus format (optional)
        },
    });
}