import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
      const { data, error } = await supabase
      .from('produse')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, description, ingredients, image, vegan } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: 'Câmpurile name, category și price sunt obligatorii.' }, { status: 400 });
    }

      const { data, error } = await supabase
      .from('produse')
      .insert([{ name, category, price: Number(price), description: description ?? '', ingredients: ingredients ?? '', image: image ?? '', vegan: Boolean(vegan), sort_order: 0 }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) return NextResponse.json({ error: 'ID obligatoriu.' }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (fields.name !== undefined) update.name = fields.name;
    if (fields.category !== undefined) update.category = fields.category;
    if (fields.price !== undefined) update.price = Number(fields.price);
    if (fields.description !== undefined) update.description = fields.description;
    if (fields.ingredients !== undefined) update.ingredients = fields.ingredients;
    if (fields.image !== undefined) update.image = fields.image;
    if (fields.vegan !== undefined) update.vegan = Boolean(fields.vegan);

      const { data, error } = await supabase
      .from('produse')
      .update(update)
      .eq('id', Number(id))
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID obligatoriu.' }, { status: 400 });

      const { error } = await supabase
      .from('produse')
      .delete()
      .eq('id', Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Produs șters.' }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}
