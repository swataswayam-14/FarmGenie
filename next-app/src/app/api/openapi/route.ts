import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const filePath = path.resolve('src/public/docs/openapispec.yaml');
    const spec = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(spec, {
      headers: { 'Content-Type': 'application/x-yaml' },
    });
  } catch (error) {
    console.error('Failed to read OpenAPI spec:', error);
    return NextResponse.json({ error: 'Failed to load OpenAPI spec' }, { status: 500 });
  }
}
