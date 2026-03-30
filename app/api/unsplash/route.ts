import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL lipsă.' }, { status: 400 });

  // Extrage ID-ul din https://unsplash.com/photos/slug-PHOTOID
  const match = url.match(/unsplash\.com\/photos\/(?:[^/]+-)?([A-Za-z0-9_-]+)$/);
  if (!match) return NextResponse.json({ error: 'URL Unsplash invalid.' }, { status: 400 });

  const photoId = match[1];
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return NextResponse.json({ error: 'UNSPLASH_ACCESS_KEY lipsă din env.' }, { status: 500 });

  const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (!res.ok) return NextResponse.json({ error: 'Fotografia nu a fost găsită.' }, { status: 404 });

  const data = await res.json();
  const rawUrl: string = data.urls?.raw;
  if (!rawUrl) return NextResponse.json({ error: 'URL imagine indisponibil.' }, { status: 500 });

  // Adaugă parametrii de calitate/mărime conform cerințelor
  const cdnUrl = `${rawUrl}&w=800&auto=format&fit=crop&q=80`;

  return NextResponse.json({ url: cdnUrl });
}
