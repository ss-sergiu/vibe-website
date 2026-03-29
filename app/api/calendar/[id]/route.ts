import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('rezervari')
    .select('nume, data_ora, nr_persoane')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Rezervarea nu a fost găsită.' }, { status: 404 });
  }

  const start = new Date(data.data_ora);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 oră

  function toIcsDate(d: Date) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vibe Caffè//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:rezervare-${id}@vibecaffe.ro`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:Rezervare Vibe Caffè`,
    `DESCRIPTION:Rezervare pentru ${data.nr_persoane} ${data.nr_persoane === 1 ? 'persoană' : 'persoane'} la Vibe Caffè.`,
    `LOCATION:str. Cafelei nr. 12\\, București`,
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder rezervare Vibe Caffè',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="rezervare-vibe-caffe.ics"`,
    },
  });
}
