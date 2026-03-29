import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { trimiteEmailRezervare } from '@/lib/email';

export async function GET() {
  const { data, error } = await supabase
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rezervari: data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nume, email, telefon, nr_persoane, data_ora } = body;

  if (!nume || !email || !telefon || !data_ora) {
    return NextResponse.json(
      { error: 'Câmpurile nume, email, telefon și data_ora sunt obligatorii.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('rezervari')
    .insert({ nume, email, telefon, nr_persoane: nr_persoane ?? 2, data_ora })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Trimite email de confirmare (ne-blocant)
  trimiteEmailRezervare({ email, nume, data_ora, nr_persoane: nr_persoane ?? 2 }).catch(() => {});

  return NextResponse.json({ success: true, rezervare: data }, { status: 201 });
}
