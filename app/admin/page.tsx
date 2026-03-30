'use client';

import { useState, useEffect, useCallback } from 'react';

type Rezervare = {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  nr_persoane: number;
  data_ora: string;
  status: string;
  created_at: string;
};

const STATUS_STYLE: Record<string, string> = {
  'în așteptare': 'bg-amber-100 text-amber-800 border-amber-300',
  'confirmată':   'bg-emerald-100 text-emerald-800 border-emerald-300',
  'respinsă':     'bg-red-100 text-red-800 border-red-300',
};

const STATUSURI = [
  { val: 'în așteptare', scurt: 'Așt.' },
  { val: 'confirmată',   scurt: 'Conf.' },
  { val: 'respinsă',     scurt: 'Resp.' },
] as const;

const FILTRE = ['toate', 'în așteptare', 'confirmată', 'respinsă'] as const;

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function DoorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
      <path d="M2 20h3" />
      <path d="M13 20h9" />
      <path d="M10 12v.01" />
      <path d="M13 4l-4 2v14l4 2" />
    </svg>
  );
}

export default function AdminPage() {
  const [autentificat, setAutentificat] = useState(false);
  const [parola, setParola] = useState('');
  const [eroareAuth, setEroareAuth] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtru, setFiltru] = useState<string>('toate');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Rezervare>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (sessionStorage.getItem('adminOk') === '1') setAutentificat(true);
  }, []);

  const incarcaRezervari = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/rezervari');
    const data = await res.json();
    setRezervari(data.rezervari ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autentificat) incarcaRezervari();
  }, [autentificat, incarcaRezervari]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoadingAuth(true);
    setEroareAuth('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: parola }),
    });
    if (res.ok) {
      sessionStorage.setItem('adminOk', '1');
      setAutentificat(true);
    } else {
      setEroareAuth('Parolă incorectă.');
    }
    setLoadingAuth(false);
  }

  async function schimbaStatus(id: number, statusNou: string) {
    setUpdatingId(id);
    await fetch(`/api/rezervari/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusNou }),
    });
    setRezervari(prev => prev.map(r => r.id === id ? { ...r, status: statusNou } : r));
    setUpdatingId(null);
  }

  async function sterge(id: number) {
    setDeletingId(id);
    await fetch(`/api/rezervari/${id}`, { method: 'DELETE' });
    setRezervari(prev => prev.filter(r => r.id !== id));
    setDeletingId(null);
    setConfirmDelete(null);
  }

  function logout() {
    sessionStorage.removeItem('adminOk');
    setAutentificat(false);
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  if (!autentificat) {
    return (
      <main className="min-h-screen bg-[#FDF6EC] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-[#F5E6C8] border border-[#D4B896] rounded-3xl p-8 w-full max-w-sm shadow-lg">
          <div className="mb-6">
            <h1 className="font-dm-serif text-3xl text-[#3B2507]">Admin</h1>
            <p className="text-[#7A5C3A] text-sm mt-1">Vibe Caffè — panou de administrare</p>
          </div>
          <label className="block text-[#3B2507] text-sm font-semibold mb-1.5">Parolă</label>
          <input
            type="password"
            value={parola}
            onChange={e => setParola(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#D4B896] text-[#3B2507] placeholder-[#B89878] focus:outline-none focus:border-[#3B2507] transition-all mb-4"
            autoFocus
          />
          {eroareAuth && <p className="text-red-700 text-sm mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{eroareAuth}</p>}
          <button
            type="submit"
            disabled={loadingAuth}
            className="w-full py-3 bg-[#3B2507] hover:bg-[#1E1200] text-[#F5E6C8] font-semibold rounded-xl transition-all"
          >
            {loadingAuth ? 'Se verifică...' : 'Intră'}
          </button>
        </form>
      </main>
    );
  }

  // ─── Sort ────────────────────────────────────────────────────────────────────
  function toggleSort(field: keyof Rezervare) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const afisate = (filtru === 'toate' ? rezervari : rezervari.filter(r => r.status === filtru))
    .slice()
    .sort((a, b) => {
      const av = a[sortField] ?? '';
      const bv = b[sortField] ?? '';
      const cmp = String(av).localeCompare(String(bv), 'ro', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const stats = {
    total:      rezervari.length,
    asteptare:  rezervari.filter(r => r.status === 'în așteptare').length,
    confirmate: rezervari.filter(r => r.status === 'confirmată').length,
    respinse:   rezervari.filter(r => r.status === 'respinsă').length,
  };

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FDF6EC] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-dm-serif text-3xl text-[#3B2507]">Rezervări</h1>
            <p className="text-[#7A5C3A] text-sm mt-1">Vibe Caffè — panou de administrare</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <button onClick={logout} title="Ieși"
              className="p-2.5 bg-[#3B2507] hover:bg-[#1E1200] text-[#F5E6C8] rounded-xl transition-all flex items-center justify-center">
              <DoorIcon />
            </button>
            <button onClick={incarcaRezervari} title="Reîncarcă"
              className="p-2.5 bg-[#F5E6C8] border border-[#D4B896] text-[#3B2507] hover:bg-[#EDD9AF] rounded-xl transition-all flex items-center justify-center">
              <RefreshIcon />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total',      val: stats.total,      accent: '#3B2507',  bg: '#F5E6C8' },
            { label: 'Așteptare',  val: stats.asteptare,  accent: '#92400E',  bg: '#FEF3C7' },
            { label: 'Confirmate', val: stats.confirmate, accent: '#065F46',  bg: '#D1FAE5' },
            { label: 'Respinse',   val: stats.respinse,   accent: '#991B1B',  bg: '#FEE2E2' },
          ].map(({ label, val, accent, bg }) => (
            <div key={label} className="rounded-xl px-3 py-2 border border-[#D4B896]/60 flex items-center justify-between gap-3" style={{ backgroundColor: bg }}>
              <p className="text-xs font-semibold" style={{ color: accent, opacity: 0.75 }}>{label}</p>
              <p className="text-xl font-bold" style={{ color: accent }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filtre */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTRE.map(f => (
            <button key={f} onClick={() => setFiltru(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filtru === f
                  ? 'bg-[#3B2507] text-[#F5E6C8] border-[#3B2507]'
                  : 'bg-[#F5E6C8] border-[#D4B896] text-[#7A5C3A] hover:border-[#3B2507] hover:text-[#3B2507]'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabel */}
        {loading ? (
          <p className="text-[#7A5C3A] text-center py-20">Se încarcă...</p>
        ) : afisate.length === 0 ? (
          <p className="text-[#7A5C3A] text-center py-20">Nicio rezervare.</p>
        ) : (
          <div className="bg-[#F5E6C8] border border-[#D4B896] rounded-2xl overflow-hidden shadow-sm">

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D4B896] bg-[#EDD9AF]">
                    {([
                      ['nume', 'Nume'],
                      ['data_ora', 'Data & Ora'],
                      ['nr_persoane', 'Pers.'],
                      ['telefon', 'Telefon'],
                      ['email', 'Email'],
                      ['status', 'Status'],
                      ['created_at', 'Înregistrat'],
                    ] as [keyof Rezervare, string][]).map(([field, label]) => (
                      <th key={field} className="text-left px-3 py-3">
                        <button onClick={() => toggleSort(field)}
                          className="flex items-center gap-1 text-[#7A5C3A] hover:text-[#3B2507] font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap">
                          {label}
                          <span className="text-[0.6rem]">
                            {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                          </span>
                        </button>
                      </th>
                    ))}
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {afisate.map((r, i) => {
                    const dataOra = new Date(r.data_ora);
                    const isUpdating = updatingId === r.id;
                    return (
                      <tr key={r.id}
                        className={`border-b border-[#D4B896]/40 hover:bg-[#EDD9AF]/50 transition-colors ${
                          i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'
                        }`}>
                        <td className="px-3 py-3 text-[#3B2507] font-semibold whitespace-nowrap">{r.nume}</td>
                        <td className="px-3 py-3 text-[#3B2507] whitespace-nowrap">
                          {dataOra.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })}
                          <span className="block text-[#7A5C3A] text-xs">
                            {dataOra.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#3B2507] text-center">{r.nr_persoane}</td>
                        <td className="px-3 py-3 text-[#3B2507] whitespace-nowrap">{r.telefon}</td>
                        <td className="px-3 py-3 text-[#3B2507]">{r.email}</td>
                        <td className="px-3 py-3">
                          <div className={`flex gap-1 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                            {STATUSURI.map(({ val, scurt }) => (
                              <button
                                key={val}
                                onClick={() => r.status !== val && schimbaStatus(r.id, val)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                                  r.status === val
                                    ? STATUS_STYLE[val]
                                    : 'bg-white/60 border-[#D4B896] text-[#7A5C3A] hover:border-[#3B2507] hover:text-[#3B2507]'
                                }`}
                              >
                                {scurt}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[#7A5C3A] whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })}
                          <span className="block text-[#B89878] text-xs">
                            {new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          {confirmDelete === r.id ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => sterge(r.id)} disabled={deletingId === r.id}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-all">
                                {deletingId === r.id ? '...' : 'Confirmă'}
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] text-xs rounded-lg hover:bg-[#D4B896] transition-all">
                                Nu
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(r.id)}
                              className="text-[#D4B896] hover:text-red-600 transition-colors p-1"
                              title="Șterge">
                              <TrashIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#D4B896]/60">
              {afisate.map(r => {
                const dataOra = new Date(r.data_ora);
                return (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[#3B2507] font-semibold">{r.nume}</p>
                        <p className="text-[#7A5C3A] text-xs">{r.email}</p>
                      </div>
                      {confirmDelete === r.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => sterge(r.id)} className="text-red-600 text-xs font-semibold">Confirmă</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[#7A5C3A] text-xs">Nu</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(r.id)} className="text-[#D4B896] hover:text-red-600 transition-colors">
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                    <p className="text-[#7A5C3A] text-xs mb-1">
                      {dataOra.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', timeZone: 'Europe/Bucharest' })} · {dataOra.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })} · {r.nr_persoane} pers.
                    </p>
                    <p className="text-[#B89878] text-xs mb-3">
                      Înregistrat: {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })} · {new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                    </p>
                    <div className="flex gap-1">
                      {STATUSURI.map(({ val, scurt }) => (
                        <button key={val} onClick={() => r.status !== val && schimbaStatus(r.id, val)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            r.status === val
                              ? STATUS_STYLE[val]
                              : 'bg-white/60 border-[#D4B896] text-[#7A5C3A] hover:border-[#3B2507]'
                          }`}>
                          {scurt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
