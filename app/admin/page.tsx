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
  'confirmată':   'bg-green-100 text-green-800 border-green-300',
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

  if (!autentificat) {
    return (
      <main className="min-h-screen bg-[#1C0F07] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-[#F5E6C8] rounded-3xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#1E1200] mb-1">Admin</h1>
          <p className="text-[#3B2507]/60 text-sm mb-6">Vibe Caffè — rezervări</p>
          <label className="block text-[#3B2507] text-sm font-medium mb-1.5">Parolă</label>
          <input
            type="password"
            value={parola}
            onChange={e => setParola(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/60 border-2 border-[#1E1200]/20 text-[#1E1200] focus:outline-none focus:border-[#1E1200] transition-all mb-4"
            autoFocus
          />
          {eroareAuth && <p className="text-red-600 text-sm mb-3">{eroareAuth}</p>}
          <button
            type="submit"
            disabled={loadingAuth}
            className="w-full py-3 bg-[#1E1200] hover:bg-[#3B2507] text-[#F5E6C8] font-semibold rounded-xl transition-all"
          >
            {loadingAuth ? 'Se verifică...' : 'Intră'}
          </button>
        </form>
      </main>
    );
  }

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
    total:     rezervari.length,
    asteptare: rezervari.filter(r => r.status === 'în așteptare').length,
    confirmate: rezervari.filter(r => r.status === 'confirmată').length,
    respinse:  rezervari.filter(r => r.status === 'respinsă').length,
  };

  return (
    <main className="min-h-screen bg-[#1C0F07] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F5E6C8]">Rezervări</h1>
            <p className="text-[#F5E6C8]/40 text-sm mt-1">Vibe Caffè — panou administrare</p>
          </div>
          <div className="flex gap-3">
            <button onClick={incarcaRezervari}
              className="px-4 py-2 border border-[#F5E6C8]/20 text-[#F5E6C8]/70 hover:text-[#F5E6C8] rounded-xl text-sm transition-all">
              ↻ Reîncarcă
            </button>
            <button onClick={logout}
              className="px-4 py-2 border border-[#F5E6C8]/20 text-[#F5E6C8]/70 hover:text-[#F5E6C8] rounded-xl text-sm transition-all">
              Ieși
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total',      val: stats.total,      color: 'text-[#F5E6C8]' },
            { label: 'Așteptare',  val: stats.asteptare,  color: 'text-amber-400' },
            { label: 'Confirmate', val: stats.confirmate, color: 'text-green-400' },
            { label: 'Respinse',   val: stats.respinse,   color: 'text-red-400' },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-[#F5E6C8]/5 border border-[#F5E6C8]/10 rounded-2xl p-4">
              <p className="text-[#F5E6C8]/40 text-xs mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filtre */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTRE.map(f => (
            <button key={f} onClick={() => setFiltru(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filtru === f
                  ? 'bg-[#F5E6C8] text-[#1E1200] border-[#F5E6C8]'
                  : 'border-[#F5E6C8]/20 text-[#F5E6C8]/60 hover:text-[#F5E6C8]'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabel */}
        {loading ? (
          <p className="text-[#F5E6C8]/40 text-center py-20">Se încarcă...</p>
        ) : afisate.length === 0 ? (
          <p className="text-[#F5E6C8]/40 text-center py-20">Nicio rezervare.</p>
        ) : (
          <div className="bg-[#F5E6C8]/5 border border-[#F5E6C8]/10 rounded-2xl overflow-hidden">

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F5E6C8]/10 text-[#F5E6C8]/40 text-xs uppercase tracking-wider">
                    {([
                      ['nume', 'Nume'],
                      ['data_ora', 'Data & Ora'],
                      ['nr_persoane', 'Pers.'],
                      ['telefon', 'Telefon'],
                      ['email', 'Email'],
                      ['status', 'Status'],
                      ['created_at', 'Înregistrat'],
                    ] as [keyof Rezervare, string][]).map(([field, label]) => (
                      <th key={field} className="text-left px-5 py-3">
                        <button onClick={() => toggleSort(field)}
                          className="flex items-center gap-1 hover:text-[#F5E6C8] transition-colors">
                          {label}
                          <span className="text-[0.6rem]">
                            {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                          </span>
                        </button>
                      </th>
                    ))}
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {afisate.map((r, i) => {
                    const dataOra = new Date(r.data_ora);
                    const isUpdating = updatingId === r.id;
                    return (
                      <tr key={r.id} className={`border-b border-[#F5E6C8]/5 hover:bg-[#F5E6C8]/5 transition-colors ${i % 2 === 0 ? '' : 'bg-[#F5E6C8]/[0.02]'}`}>
                        <td className="px-5 py-3 text-[#F5E6C8] font-medium">{r.nume}</td>
                        <td className="px-5 py-3 text-[#F5E6C8]/70">
                          {dataOra.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })}
                          <span className="block text-[#F5E6C8]/40 text-xs">
                            {dataOra.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#F5E6C8]/70">{r.nr_persoane}</td>
                        <td className="px-5 py-3 text-[#F5E6C8]/70">{r.telefon}</td>
                        <td className="px-5 py-3 text-[#F5E6C8]/70">{r.email}</td>
                        <td className="px-5 py-3">
                          <div className={`flex gap-1 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                            {STATUSURI.map(({ val, scurt }) => (
                              <button
                                key={val}
                                onClick={() => r.status !== val && schimbaStatus(r.id, val)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                  r.status === val
                                    ? STATUS_STYLE[val]
                                    : 'border-[#F5E6C8]/15 text-[#F5E6C8]/40 hover:border-[#F5E6C8]/40 hover:text-[#F5E6C8]/70'
                                }`}
                              >
                                {scurt}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[#F5E6C8]/50">
                          {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })}
                          <span className="block text-[#F5E6C8]/30 text-xs">
                            {new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          {confirmDelete === r.id ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => sterge(r.id)} disabled={deletingId === r.id}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-all">
                                {deletingId === r.id ? '...' : 'Confirmă'}
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1 border border-[#F5E6C8]/20 text-[#F5E6C8]/60 text-xs rounded-lg hover:text-[#F5E6C8] transition-all">
                                Nu
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(r.id)}
                              className="text-[#F5E6C8]/20 hover:text-red-400 transition-colors p-1"
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
            <div className="md:hidden divide-y divide-[#F5E6C8]/10">
              {afisate.map(r => {
                const dataOra = new Date(r.data_ora);
                return (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[#F5E6C8] font-semibold">{r.nume}</p>
                        <p className="text-[#F5E6C8]/50 text-xs">{r.email}</p>
                      </div>
                      {confirmDelete === r.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => sterge(r.id)} className="text-red-400 text-xs font-medium">Confirmă</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[#F5E6C8]/40 text-xs">Nu</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(r.id)} className="text-[#F5E6C8]/20 hover:text-red-400 transition-colors">
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                    <p className="text-[#F5E6C8]/50 text-xs mb-1">
                      {dataOra.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', timeZone: 'Europe/Bucharest' })} · {dataOra.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })} · {r.nr_persoane} pers.
                    </p>
                    <p className="text-[#F5E6C8]/30 text-xs mb-3">
                      Înregistrat: {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Bucharest' })} · {new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })}
                    </p>
                    <div className="flex gap-1">
                      {STATUSURI.map(({ val, scurt }) => (
                        <button key={val} onClick={() => r.status !== val && schimbaStatus(r.id, val)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            r.status === val
                              ? STATUS_STYLE[val]
                              : 'border-[#F5E6C8]/15 text-[#F5E6C8]/40 hover:border-[#F5E6C8]/40'
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
