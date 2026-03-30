import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('categorii')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, name, sort_order } = body;
  if (!id) return NextResponse.json({ error: 'ID obligatoriu.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (sort_order !== undefined) update.sort_order = sort_order;

  const { data, error } = await supabase
    .from('categorii')
    .update(update)
    .eq('id', id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: 'Nume obligatoriu.' }, { status: 400 });

  const { data: existing } = await supabase.from('categorii').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const maxOrder = existing?.[0]?.sort_order ?? 0;

  const { data, error } = await supabase
    .from('categorii')
    .insert({ name, sort_order: maxOrder + 1 })
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obligatoriu.' }, { status: 400 });

  const { error } = await supabase.from('categorii').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Categorie ștearsă.' }, { status: 200 });
}
