import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Vibe Caffè <onboarding@resend.dev>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://vibe-website-corvay44j-ss-sergius-projects.vercel.app';

const BRUN = '#2C1810';
const CREM = '#F5E6C8';
const BRUN_TEXT = '#3B2507';
const BTN_BG = '#1E1200';
const BTN_TEXT = '#F5E6C8';

function formatDataOra(dataOraStr: string) {
  const d = new Date(dataOraStr);
  const tz = 'Europe/Bucharest';
  const zi = d.toLocaleDateString('ro-RO', { weekday: 'long', timeZone: tz });
  const data = d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', timeZone: tz });
  const ora = d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false });
  return {
    zi: zi.charAt(0).toUpperCase() + zi.slice(1),
    data,
    ora,
  };
}

function btn(text: string, href: string) {
  return `
    <a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:${BTN_BG};color:${BTN_TEXT};font-size:15px;font-weight:600;text-decoration:none;border-radius:999px;font-family:sans-serif">
      ${text}
    </a>
  `;
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:24px;background:transparent;font-family:sans-serif">
      <div style="max-width:480px;margin:0 auto;border-radius:16px;overflow:hidden;background:${CREM}">

        <!-- Header brun -->
        <div style="background:${BRUN};padding:24px 28px 20px">
          <p style="margin:0;color:${CREM};font-size:20px;font-weight:700;letter-spacing:-0.3px">Vibe Caffè</p>
          <p style="margin:4px 0 0;color:${CREM};opacity:0.5;font-size:13px">București</p>
        </div>

        <!-- Body + Footer crem -->
        <div style="background:${CREM};padding:28px 28px 24px">
          ${content}

          <!-- Footer -->
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid ${BRUN_TEXT}40">
            <p style="margin:0;color:${BRUN_TEXT};opacity:0.45;font-size:12px">Vibe Caffè · București · str. Cafelei nr. 12</p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

export async function trimiteEmailRezervare({
  email, nume, data_ora, nr_persoane,
}: {
  email: string; nume: string; data_ora: string; nr_persoane: number;
}) {
  const { zi, data, ora } = formatDataOra(data_ora);
  const persoane = `${nr_persoane} ${nr_persoane === 1 ? 'persoană' : 'persoane'}`;

  const content = `
    <h2 style="margin:0 0 16px;color:${BRUN};font-size:18px;font-weight:700">
      ${zi}, ${data} · ${ora}
    </h2>
    <p style="margin:0 0 14px;color:${BRUN_TEXT};font-size:16px;line-height:1.6">
      <strong>${nume}</strong>, ai cerut o rezervare la Vibe Caffè pentru
      <strong>${zi}</strong>, <strong>${data}</strong> la <strong>${ora}</strong>, <strong>${persoane}</strong>.
    </p>
    <p style="margin:0;color:${BRUN_TEXT};font-size:15px;line-height:1.6">
      O să te anunțăm de îndată ce rezervarea va fi confirmată.
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Cerere rezervare Vibe Caffè',
    html: emailLayout(content),
  });
}

export async function trimiteEmailStatus({
  id, email, nume, data_ora, nr_persoane, status,
}: {
  id: number; email: string; nume: string; data_ora: string; nr_persoane: number; status: string;
}) {
  const { zi, data, ora } = formatDataOra(data_ora);
  const persoane = `${nr_persoane} ${nr_persoane === 1 ? 'persoană' : 'persoane'}`;

  const statusLabel: Record<string, string> = {
    'confirmată':   'Confirmată',
    'respinsă':     'Respinsă',
    'în așteptare': 'În așteptare',
  };
  const labelStatus = statusLabel[status] ?? status;

  // Mesaj extra + butoane per status
  let mesajExtra = '';
  let butoane = '';

  if (status === 'confirmată') {
    mesajExtra = `<p style="margin:0;color:${BRUN_TEXT};font-size:15px;line-height:1.6">Te așteptăm cu drag la Vibe Caffè.</p>`;
    butoane = btn('Adaugă în calendar', `${BASE_URL}/api/calendar/${id}`);
  } else if (status === 'respinsă') {
    mesajExtra = `<p style="margin:0;color:#8B1A1A;font-size:15px;line-height:1.6">Te rugăm să alegi o altă dată/oră.</p>`;
    butoane = btn('Fă o altă rezervare', `${BASE_URL}/rezervari`);
  } else {
    mesajExtra = `<p style="margin:0;color:${BRUN_TEXT};font-size:15px;line-height:1.6">O să te anunțăm de îndată ce rezervarea va fi confirmată.</p>`;
  }

  const statusAfisaj = status === 'respinsă'
    ? `<span style="color:#8B1A1A;font-weight:700">${labelStatus}</span>`
    : `<strong>${labelStatus}</strong>`;

  const content = `
    <h2 style="margin:0 0 16px;color:${BRUN};font-size:18px;font-weight:700">
      Rezervare ${status === 'respinsă' ? `<span style="color:#8B1A1A">${labelStatus}</span>` : labelStatus}
    </h2>
    <p style="margin:0 0 14px;color:${BRUN_TEXT};font-size:16px;line-height:1.6">
      <strong>${nume}</strong>, rezervarea ta la Vibe Caffè pentru
      <strong>${zi}</strong>, <strong>${data}</strong> la <strong>${ora}</strong>,
      <strong>${persoane}</strong> are statut de ${statusAfisaj}.
    </p>
    ${mesajExtra}
    ${butoane}
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Rezervare ${labelStatus} · Vibe Caffè`,
    html: emailLayout(content),
  });
}
