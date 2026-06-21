// /api/download/[token] — verifies HMAC-signed token, streams the file.
// Public endpoint but token-bound: you can't fabricate a token without DOWNLOAD_SECRET.

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { verifyDownloadToken, resolveProductForToken } from '@/lib/downloads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PDF_DIR = path.join(process.cwd(), 'public', 'bundles');

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = decodeURIComponent(params.token);
  const payload = verifyDownloadToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired download link.' },
      { status: 403 }
    );
  }
  const product = resolveProductForToken(payload);
  if (!product) {
    return NextResponse.json({ error: 'Unknown product in token' }, { status: 400 });
  }

  // Map public URL → on-disk path
  const fileRel = product.file.replace(/^\//, ''); // strip leading slash
  const filePath = path.join(process.cwd(), 'public', fileRel);

  // Defence-in-depth: ensure the resolved path is inside PDF_DIR
  const rel = path.relative(PDF_DIR, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return NextResponse.json({ error: 'Path traversal blocked' }, { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath);
    // Convert Buffer → Uint8Array for the BodyInit type
    const body = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${product.fileName}"`,
        'Content-Length': String(data.byteLength),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `File not found on server: ${filePath}` },
      { status: 500 }
    );
  }
}