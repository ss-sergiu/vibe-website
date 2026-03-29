import { supabaseAdmin } from '@/lib/supabaseAdmin';

const BRUN = '#2C1810';
const CREM = '#F5E6C8';

function toGcalDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDataOra(dataOraStr: string) {
  const d = new Date(dataOraStr);
  const tz = 'Europe/Bucharest';
  const zi = d.toLocaleDateString('ro-RO', { weekday: 'long', timeZone: tz });
  const data = d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz });
  const ora = d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false });
  return { zi: zi.charAt(0).toUpperCase() + zi.slice(1), data, ora };
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from('rezervari')
    .select('nume, data_ora, nr_persoane')
    .eq('id', id)
    .single();

  if (!data) {
    return (
      <main style={{ minHeight: '100vh', background: CREM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: BRUN }}>Rezervarea nu a fost găsită.</p>
      </main>
    );
  }

  const start = new Date(data.data_ora);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const { zi, data: dataFormatata, ora } = formatDataOra(data.data_ora);
  const persoane = `${data.nr_persoane} ${data.nr_persoane === 1 ? 'persoană' : 'persoane'}`;

  const title = 'Rezervare Vibe Caffè';
  const description = `Rezervare pentru ${data.nr_persoane} ${data.nr_persoane === 1 ? 'persoană' : 'persoane'} la Vibe Caffè.`;
  const location = 'str. Cafelei nr. 12, București';

  const googleUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${toGcalDate(start)}/${toGcalDate(end)}` +
    `&details=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}`;

  const outlookUrl =
    `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}` +
    `&startdt=${start.toISOString()}` +
    `&enddt=${end.toISOString()}` +
    `&body=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}`;

  const icsUrl = `/api/calendar/${id}`;

  const options = [
    {
      label: 'Google Calendar',
      href: googleUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      download: false,
    },
    {
      label: 'Apple Calendar',
      href: icsUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
        </svg>
      ),
      download: true,
    },
    {
      label: 'Outlook',
      href: outlookUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      download: false,
    },
    {
      label: 'Descarcă .ics',
      href: icsUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v13M7 12l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 19h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      download: true,
    },
  ];

  return (
    <main style={{ minHeight: '100vh', background: CREM, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Header */}
        <div style={{ background: BRUN, borderRadius: '16px 16px 0 0', padding: '24px 28px 20px' }}>
          <p style={{ margin: 0, color: CREM, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>Vibe Caffè</p>
          <p style={{ margin: '4px 0 0', color: CREM, opacity: 0.5, fontSize: '13px' }}>str. Cafelei nr. 12, București</p>
        </div>

        {/* Body */}
        <div style={{ background: '#EDD9AD', borderRadius: '0 0 16px 16px', padding: '28px' }}>
          <h1 style={{ margin: '0 0 6px', color: BRUN, fontSize: '17px', fontWeight: 700 }}>
            Adaugă în calendar
          </h1>
          <p style={{ margin: '0 0 24px', color: BRUN, opacity: 0.65, fontSize: '14px', lineHeight: 1.5 }}>
            {zi}, {dataFormatata} · {ora} · {persoane}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map((opt) => (
              <a
                key={opt.label}
                href={opt.href}
                download={opt.download ? `rezervare-vibe-caffe.ics` : undefined}
                target={opt.download ? undefined : '_blank'}
                rel={opt.download ? undefined : 'noopener noreferrer'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  background: BRUN,
                  color: CREM,
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'opacity 0.15s',
                }}
              >
                {opt.icon}
                {opt.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
