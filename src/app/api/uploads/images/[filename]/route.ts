import path from 'path';
import fs from 'fs';
import mime from 'mime';
import { NextRequest } from 'next/server';

const imagesDir = path.join(process.cwd(), '/public/uploads/images');

export async function GET(_: NextRequest, context: { params: Promise<{ filename: string }> }) {
    const resolvedParams = await context.params;

    if (!resolvedParams.filename) {
        return new Response('Bad Request', { status: 400 });
    }

    const filePath = path.join(imagesDir, resolvedParams.filename);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';

    try {
        const file = await fs.promises.readFile(filePath);
        return new Response(file, {
            headers: {
                'Content-Type': mimeType,
            },
        });
    } catch (error) {
        console.error('File not found:', error);
        return new Response('Not found', { status: 404 });
    }
}
