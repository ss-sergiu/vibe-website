import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { trimiteEmailStatus } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('rezervari')
    .update({ status })
    .eq('id', id)
    .select('email, nume, data_ora, nr_persoane')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Trimite email notificare status (ne-blocant)
  if (data) {
    trimiteEmailStatus({
      id: Number(id),
      email: data.email,
      nume: data.nume,
      data_ora: data.data_ora,
      nr_persoane: data.nr_persoane,
      status,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('rezervari')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
