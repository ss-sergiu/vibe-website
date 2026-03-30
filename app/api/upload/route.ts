import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'Niciun fișier.' }, { status: 400 });

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Tip de fișier nepermis.' }, { status: 400 });

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('produse-imagini')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from('produse-imagini')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}
