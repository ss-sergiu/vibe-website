'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import FooterStarter from '@/components/FooterStarter';

const ORE_DISPONIBILE = Array.from({ length: 25 }, (_, i) => {
  const totalMinute = 10 * 60 + i * 30;
  const h = String(Math.floor(totalMinute / 60)).padStart(2, '00');
  const m = String(totalMinute % 60).padStart(2, '0');
  return `${h}:${m}`;
});

const CODURI_TARI = [
  { cod: '+40', tara: 'România', flag: '🇷🇴' },
  { cod: '+1',  tara: 'SUA',     flag: '🇺🇸' },
  { cod: '+44', tara: 'UK',      flag: '🇬🇧' },
  { cod: '+49', tara: 'Germania',flag: '🇩🇪' },
  { cod: '+33', tara: 'Franța',  flag: '🇫🇷' },
  { cod: '+39', tara: 'Italia',  flag: '🇮🇹' },
  { cod: '+34', tara: 'Spania',  flag: '🇪🇸' },
  { cod: '+373',tara: 'Moldova', flag: '🇲🇩' },
];

const azi = new Date();
const aziStr = azi.toISOString().split('T')[0];

const maxData = new Date(azi);
maxData.setMonth(maxData.getMonth() + 6);
const maxDataStr = maxData.toISOString().split('T')[0];

const ZI_RO = ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'];
const LUNA_RO = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function genereazaUrmatoarele14Zile() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(azi);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function genereazaZileLuna(an: number, luna: number) {
  const primaZi = new Date(an, luna, 1);
  const ultimaZi = new Date(an, luna + 1, 0);
  const zile: (Date | null)[] = [];
  for (let i = 0; i < primaZi.getDay(); i++) zile.push(null);
  for (let i = 1; i <= ultimaZi.getDate(); i++) zile.push(new Date(an, luna, i));
  return zile;
}

export default function PaginaRezervari() {
  const [pas, setPas] = useState(1);
  const [data, setData] = useState('');
  const [ora, setOra] = useState('');
  const [calendarLuna, setCalendarLuna] = useState(azi.getMonth());
  const [calendarAn, setCalendarAn] = useState(azi.getFullYear());
  const [form, setForm] = useState({ nume: '', email: '', telefon: '', nr_persoane: 2 });
  const [codTara, setCodTara] = useState('+40');
  const [emailAtins, setEmailAtins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [eroare, setEroare] = useState('');
  const [modal, setModal] = useState(false);
  const [pendingHref, setPendingHref] = useState('');

  const numeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telefonRef = useRef<HTMLInputElement>(null);

  const emailValid = EMAIL_REGEX.test(form.email);
  const emailEroare = emailAtins && form.email && !emailValid;

  useEffect(() => {
    if (pas !== 3) return;
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(href);
      setModal(true);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pas]);

  function continuaRezervarea() {
    setModal(false);
    setTimeout(() => {
      if (!form.nume) { numeRef.current?.focus(); return; }
      if (!form.email) { emailRef.current?.focus(); return; }
      if (!form.telefon) { telefonRef.current?.focus(); return; }
    }, 50);
  }

  function anuleazaRezervarea() {
    setModal(false);
    if (pendingHref.startsWith('#')) {
      window.location.href = pendingHref === '#' ? '/' : `/${pendingHref}`;
    } else {
      window.location.href = pendingHref;
    }
  }

  async function trimiteRezervare() {
    setLoading(true);
    setEroare('');
    try {
      const res = await fetch('/api/rezervari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          telefon: `${codTara} ${form.telefon}`,
          data_ora: `${data}T${ora}:00`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Eroare necunoscută');
      setSucces(true);
    } catch (e: unknown) {
      setEroare(e instanceof Error ? e.message : 'A apărut o eroare. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  }

  // clase comune pentru chenare
  const borderInactiv = 'border-[#3B2507]/60';
  const borderActiv   = 'border-[#1E1200]';

  const Modal = modal ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={continuaRezervarea} />
      <div className="relative bg-[#F5E6C8] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <p className="text-2xl font-bold text-[#1E1200] mb-8">Nu ai finisat rezervarea.</p>
        <div className="flex flex-col gap-3">
          <button onClick={continuaRezervarea} className="w-full py-3.5 bg-[#1E1200] hover:bg-[#3B2507] text-[#F5E6C8] font-semibold rounded-2xl transition-all duration-300">
            Continuă rezervarea
          </button>
          <button onClick={anuleazaRezervarea} className={`w-full py-3.5 border-2 ${borderInactiv} text-[#1E1200] hover:bg-[#1E1200] hover:text-[#F5E6C8] font-semibold rounded-2xl transition-all duration-300`}>
            Anulează rezervarea
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (succes) {
    return (
      <>
        {Modal}
        <Navigation />
        <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 bg-[#1C0F07]">
          <div className="bg-[#F5E6C8] rounded-3xl p-10 text-center max-w-md w-full">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1E1200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#1E1200] mb-6">Rezervare confirmată!</h2>
            <p className="text-[#1E1200] text-xl leading-relaxed mb-8">
              <strong>{form.nume}</strong>, te așteptăm{' '}
              <strong>{new Date(data).toLocaleDateString('ro-RO', { weekday: 'long' })}</strong>,<br />
              <strong>{new Date(data).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}</strong>{' '}
              la <strong>{ora}</strong> – <strong>{form.nr_persoane} {form.nr_persoane === 1 ? 'persoană' : 'persoane'}</strong>
            </p>
            <button
              onClick={() => { setPas(1); setData(''); setOra(''); setForm({ nume: '', email: '', telefon: '', nr_persoane: 2 }); setCodTara('+40'); setEmailAtins(false); setSucces(false); setCalendarLuna(azi.getMonth()); setCalendarAn(azi.getFullYear()); }}
              className="px-8 py-3 bg-[#1E1200] hover:bg-[#3B2507] text-[#F5E6C8] font-semibold rounded-full transition-all duration-300"
            >
              Fă o altă rezervare
            </button>
          </div>
        </main>
        <FooterStarter />
      </>
    );
  }

  return (
    <>
      {Modal}
      <Navigation />
      <main className="min-h-screen px-6 pt-28 pb-16 bg-[#1C0F07]">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-[#F5E6C8] mb-3">Rezervă o masă</h1>
            <p className="text-[#F5E6C8]/50 text-lg">La Vibe Caffè te așteptăm cu drag</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-10">
            {[{ nr: 1, label: 'Data' }, { nr: 2, label: 'Ora' }, { nr: 3, label: 'Detalii' }].map(({ nr, label }, i) => (
              <div key={nr} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    pas > nr ? 'bg-[#F5E6C8] border-[#F5E6C8] text-[#1E1200]' :
                    pas === nr ? 'bg-[#F5E6C8] border-[#F5E6C8] text-[#1E1200] scale-110' :
                    'bg-transparent border-[#F5E6C8]/30 text-[#F5E6C8]/30'
                  }`}>
                    {pas > nr ? '✓' : nr}
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-300 ${pas === nr ? 'text-[#F5E6C8]' : 'text-[#F5E6C8]/30'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`w-16 h-0.5 mb-4 transition-colors duration-300 ${pas > nr ? 'bg-[#14B8A6]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-[#F5E6C8] rounded-3xl p-8">

            {/* PAS 1 — Alege data */}
            {pas === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1200] mb-2">Alege data</h2>
                <p className="text-[#3B2507]/60 mb-5 text-base">Selectează ziua în care vrei să ne vizitezi</p>

                {/* Butoane rapide */}
                <div className="flex gap-2 overflow-x-auto pt-2 pb-3 mb-6 scrollbar-hide">
                  {genereazaUrmatoarele14Zile().map(d => {
                    const str = toLocalDateStr(d);
                    const eAzi = str === aziStr;
                    const selectata = str === data;
                    return (
                      <button
                        key={str}
                        onClick={() => setData(str)}
                        className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200 ${
                          selectata
                            ? `bg-[#1E1200] ${borderActiv} text-[#F5E6C8] scale-105`
                            : `bg-transparent ${borderInactiv} text-[#3B2507] hover:scale-105`
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wide opacity-70">{ZI_RO[d.getDay()]}</span>
                        <span className="text-base font-bold">{d.getDate()}</span>
                        {eAzi && <span className="text-[9px] uppercase tracking-widest opacity-60">azi</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar */}
                <div className={`bg-[#1E1200]/8 border ${borderInactiv} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        if (calendarLuna === 0) { setCalendarLuna(11); setCalendarAn(calendarAn - 1); }
                        else setCalendarLuna(calendarLuna - 1);
                      }}
                      disabled={calendarAn === azi.getFullYear() && calendarLuna === azi.getMonth()}
                      className={`w-8 h-8 rounded-lg border-2 ${borderInactiv} text-[#3B2507] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] flex items-center justify-center transition-all`}
                    >‹</button>
                    <span className="text-[#1E1200] font-semibold">{LUNA_RO[calendarLuna]} {calendarAn}</span>
                    <button
                      onClick={() => {
                        const nextLuna = calendarLuna === 11 ? 0 : calendarLuna + 1;
                        const nextAn = calendarLuna === 11 ? calendarAn + 1 : calendarAn;
                        if (`${nextAn}-${String(nextLuna + 1).padStart(2, '0')}` <= maxDataStr.slice(0, 7)) {
                          setCalendarLuna(nextLuna); setCalendarAn(nextAn);
                        }
                      }}
                      disabled={`${calendarAn}-${String(calendarLuna + 1).padStart(2, '0')}` >= maxDataStr.slice(0, 7)}
                      className={`w-8 h-8 rounded-lg border-2 ${borderInactiv} text-[#3B2507] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] flex items-center justify-center transition-all`}
                    >›</button>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {ZI_RO.map(z => (
                      <div key={z} className="text-center text-[#3B2507]/40 text-xs font-semibold py-1">{z}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {genereazaZileLuna(calendarAn, calendarLuna).map((d, i) => {
                      if (!d) return <div key={`empty-${i}`} />;
                      const str = toLocalDateStr(d);
                      const trecut = str < aziStr;
                      const preaDeparte = str > maxDataStr;
                      const dezactivat = trecut || preaDeparte;
                      const selectata = str === data;
                      const eAzi = str === aziStr;
                      return (
                        <button
                          key={str}
                          onClick={() => !dezactivat && setData(str)}
                          disabled={dezactivat}
                          className={`h-9 w-full rounded-lg text-sm font-medium transition-all duration-150 ${
                            selectata ? 'bg-[#1E1200] text-[#F5E6C8] font-bold' :
                            eAzi ? `border-2 ${borderInactiv} text-[#1E1200] font-bold` :
                            dezactivat ? 'text-[#1E1200]/20 cursor-not-allowed' :
                            'text-[#3B2507] hover:bg-[#1E1200]/10'
                          }`}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setPas(2)}
                  disabled={!data}
                  className="mt-6 w-full py-4 bg-[#1E1200] hover:bg-[#3B2507] disabled:opacity-30 disabled:cursor-not-allowed text-[#F5E6C8] font-semibold text-lg rounded-2xl transition-all duration-300"
                >
                  Continuă →
                </button>
              </div>
            )}

            {/* PAS 2 — Alege ora */}
            {pas === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1200] mb-1">Alege ora</h2>
                <p className="text-[#3B2507]/60 mb-6 text-base">
                  {new Date(data).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {ORE_DISPONIBILE.map(h => (
                    <button
                      key={h}
                      onClick={() => setOra(h)}
                      className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                        ora === h
                          ? `bg-[#1E1200] ${borderActiv} text-[#F5E6C8] scale-105`
                          : `bg-transparent ${borderInactiv} text-[#3B2507] hover:scale-105`
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setPas(1)}
                    className={`flex-1 py-4 border-2 ${borderInactiv} text-[#3B2507] hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] font-semibold rounded-2xl transition-all duration-300`}
                  >
                    ← Înapoi
                  </button>
                  <button
                    onClick={() => setPas(3)}
                    disabled={!ora}
                    className="flex-[2] py-4 bg-[#1E1200] hover:bg-[#3B2507] disabled:opacity-30 disabled:cursor-not-allowed text-[#F5E6C8] font-semibold text-lg rounded-2xl transition-all duration-300"
                  >
                    Continuă →
                  </button>
                </div>
              </div>
            )}

            {/* PAS 3 — Date importante */}
            {pas === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1200] mb-1">Date importante</h2>
                <p className="text-[#3B2507]/60 mb-6 text-base">
                  {new Date(data).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })} · ora {ora}
                </p>

                <div className="flex flex-col gap-4">
                  {/* Nume */}
                  <div>
                    <label className="block text-[#3B2507] text-sm font-medium mb-1.5">Nume complet *</label>
                    <input
                      type="text"
                      ref={numeRef}
                      placeholder="Ion Popescu"
                      value={form.nume}
                      onChange={e => setForm({ ...form, nume: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-white/60 border-2 border-[#1E1200]/20 text-[#1E1200] placeholder-[#3B2507]/30 focus:outline-none focus:border-[#1E1200] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[#3B2507] text-sm font-medium mb-1.5">Email *</label>
                    <input
                      type="email"
                      ref={emailRef}
                      placeholder="ion@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onBlur={() => setEmailAtins(true)}
                      className={`w-full px-5 py-3.5 rounded-xl bg-white/60 border-2 text-[#1E1200] placeholder-[#3B2507]/30 focus:outline-none transition-all ${
                        emailEroare ? 'border-red-400 focus:border-red-500' : 'border-[#1E1200]/20 focus:border-[#1E1200]'
                      }`}
                    />
                    {emailEroare && (
                      <p className="mt-1 text-red-600 text-xs">Introdu un email valid (ex: ion@email.com)</p>
                    )}
                  </div>

                  {/* Telefon cu selector cod țară */}
                  <div>
                    <label className="block text-[#3B2507] text-sm font-medium mb-1.5">Telefon *</label>
                    <div className="flex gap-2">
                      <select
                        value={codTara}
                        onChange={e => setCodTara(e.target.value)}
                        className="px-3 py-3.5 rounded-xl bg-white/60 border-2 border-[#1E1200]/20 text-[#1E1200] focus:outline-none focus:border-[#1E1200] transition-all text-sm font-medium"
                      >
                        {CODURI_TARI.map(({ cod, tara, flag }) => (
                          <option key={cod} value={cod}>{flag} {cod}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        ref={telefonRef}
                        placeholder={codTara === '+373' ? '60 000 000' : '740 000 000'}
                        value={form.telefon}
                        onChange={e => {
                          const cifre = e.target.value.replace(/\D/g, '');
                          const maxCifre = codTara === '+373' ? 8 : 9;
                          const taiat = cifre.slice(0, maxCifre);
                          let formatat = '';
                          if (codTara === '+373') {
                            // XX XXX XXX
                            if (taiat.length <= 2) formatat = taiat;
                            else if (taiat.length <= 5) formatat = taiat.slice(0, 2) + ' ' + taiat.slice(2);
                            else formatat = taiat.slice(0, 2) + ' ' + taiat.slice(2, 5) + ' ' + taiat.slice(5);
                          } else {
                            // XXX XXX XXX
                            if (taiat.length <= 3) formatat = taiat;
                            else if (taiat.length <= 6) formatat = taiat.slice(0, 3) + ' ' + taiat.slice(3);
                            else formatat = taiat.slice(0, 3) + ' ' + taiat.slice(3, 6) + ' ' + taiat.slice(6);
                          }
                          setForm({ ...form, telefon: formatat });
                        }}
                        className="flex-1 px-5 py-3.5 rounded-xl bg-white/60 border-2 border-[#1E1200]/20 text-[#1E1200] placeholder-[#3B2507]/30 focus:outline-none focus:border-[#1E1200] transition-all"
                      />
                    </div>
                  </div>

                  {/* Număr persoane */}
                  <div>
                    <label className="block text-[#3B2507] text-sm font-medium mb-1.5">Număr persoane</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, nr_persoane: Math.max(1, form.nr_persoane - 1) })}
                        className={`w-11 h-11 rounded-xl border-2 ${borderInactiv} text-[#3B2507] hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] text-xl font-bold transition-all`}
                      >−</button>
                      <span className="text-[#1E1200] text-xl font-bold w-8 text-center">{form.nr_persoane}</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, nr_persoane: Math.min(12, form.nr_persoane + 1) })}
                        className={`w-11 h-11 rounded-xl border-2 ${borderInactiv} text-[#3B2507] hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] text-xl font-bold transition-all`}
                      >+</button>
                      <span className="text-[#3B2507]/50 text-sm ml-1">{form.nr_persoane === 1 ? 'persoană' : 'persoane'}</span>
                    </div>
                  </div>
                </div>

                {eroare && (
                  <div className="mt-4 px-4 py-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-sm">
                    {eroare}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setPas(2)}
                    className={`flex-1 py-4 border-2 ${borderInactiv} text-[#3B2507] hover:bg-[#1E1200] hover:text-[#F5E6C8] hover:border-[#1E1200] font-semibold rounded-2xl transition-all duration-300`}
                  >
                    ← Înapoi
                  </button>
                  <button
                    onClick={trimiteRezervare}
                    disabled={!form.nume || !form.email || !emailValid || !form.telefon || loading}
                    className="flex-[2] py-4 bg-[#1E1200] hover:bg-[#3B2507] disabled:opacity-30 disabled:cursor-not-allowed text-[#F5E6C8] font-semibold text-lg rounded-2xl transition-all duration-300"
                  >
                    {loading ? 'Se trimite...' : 'Confirmă rezervarea'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <FooterStarter />
    </>
  );
}
