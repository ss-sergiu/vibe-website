'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'rezervari' | 'produse' | 'categorii';

interface Categorie { id: number; name: string; sort_order: number; }

interface Rezervare {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  nr_persoane: number;
  data_ora: string;
  status: string;
  created_at: string;
}

interface Produs {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string;
  image: string;
  vegan: boolean;
  sort_order: number;
}

type ProdusForm = Omit<Produs, 'id' | 'sort_order'>;

const FORM_INITIAL: ProdusForm = {
  name: '', category: '', price: 0,
  description: '', ingredients: '', image: '', vegan: false,
};

const DEFAULT_CATEGORIES = ['Espresso', 'Specialty', 'Vegan', 'Cold', 'Alternative', 'Pastry'];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  'în așteptare': { label: 'Așt.',  bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-400',   border: 'border border-amber-300' },
  'confirmată':   { label: 'Conf.', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-400', border: 'border border-emerald-300' },
  'respinsă':     { label: 'Resp.', bg: 'bg-red-100',     text: 'text-red-800',     dot: 'bg-red-400',     border: 'border border-red-300' },
};

// ─── Column order ────────────────────────────────────────────────────────────

type ColId = 'nume' | 'contact' | 'pers' | 'data' | 'ora' | 'status' | 'inregistrat' | 'actiuni';
const DEFAULT_COL_ORDER: ColId[] = ['nume', 'contact', 'pers', 'data', 'ora', 'status', 'inregistrat', 'actiuni'];
const COL_HEADERS: Record<ColId, { label: string; sortField: 'nume' | 'nr_persoane' | 'data_ora' | 'status' | 'created_at' | null }> = {
  nume:        { label: 'Nume',        sortField: 'nume'        },
  contact:     { label: 'Contact',     sortField: null          },
  pers:        { label: 'Pers.',       sortField: 'nr_persoane' },
  data:        { label: 'Data',        sortField: 'data_ora'    },
  ora:         { label: 'Ora',         sortField: 'data_ora'    },
  status:      { label: 'Status',      sortField: 'status'      },
  inregistrat: { label: 'Înregistrat', sortField: 'created_at'  },
  actiuni:     { label: '',            sortField: null          },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconEdit() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>;
}
function IconTrash() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}
function IconCheck() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
}
function IconX() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
}
function IconRefresh() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
}
function IconPlus() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
}
function IconDoor() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-4 2v14l4 2"/></svg>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [autentificat, setAutentificat] = useState(false);
  const [parola, setParola] = useState('');
  const [eroareAuth, setEroareAuth] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminTab') as Tab | null;
      if (saved && ['rezervari', 'produse', 'categorii'].includes(saved)) return saved;
    }
    return 'rezervari';
  });

  function setTabAndSave(t: Tab) { setTab(t); localStorage.setItem('adminTab', t); }

  // Rezervări
  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loadingRez, setLoadingRez] = useState(false);
  const [searchRez, setSearchRez] = useState('');
  const [filterRez, setFilterRez] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [sortRez, setSortRez] = useState<{ field: 'nume' | 'nr_persoane' | 'data_ora' | 'status' | 'created_at'; dir: 'asc' | 'desc' }>({ field: 'data_ora', dir: 'asc' });
  const [colOrder, setColOrder] = useState<ColId[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminColOrder');
      if (saved) try { return JSON.parse(saved) as ColId[]; } catch {}
    }
    return DEFAULT_COL_ORDER;
  });
  const [dragColId, setDragColId] = useState<ColId | null>(null);
  const [dragOverColId, setDragOverColId] = useState<ColId | null>(null);

  // Produse
  const [produse, setProduse] = useState<Produs[]>([]);
  const [loadingProd, setLoadingProd] = useState(false);
  const [modal, setModal] = useState<null | 'add' | Produs>(null);
  const [form, setForm] = useState<ProdusForm>(FORM_INITIAL);
  const [savingProd, setSavingProd] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [deletingProdId, setDeletingProdId] = useState<number | null>(null);
  const [confirmDeleteProd, setConfirmDeleteProd] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState<string>('toate');
  const [searchProd, setSearchProd] = useState('');
  const [sortProd, setSortProd] = useState<{ field: 'name' | 'category' | 'price'; dir: 'asc' | 'desc' }>({ field: 'name', dir: 'asc' });

  // Categorii
  const [categoriiDB, setCategoriiDB] = useState<Categorie[]>([]);
  const [renameCat, setRenameCat] = useState<number | null>(null);
  const [renameCatVal, setRenameCatVal] = useState('');
  const [savingCat, setSavingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('adminOk') === '1') setAutentificat(true);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoadingAuth(true);
    setEroareAuth('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: parola }),
    });
    if (res.ok) { sessionStorage.setItem('adminOk', '1'); setAutentificat(true); }
    else setEroareAuth('Parolă incorectă.');
    setLoadingAuth(false);
  }

  function logout() { sessionStorage.removeItem('adminOk'); setAutentificat(false); }

  // ─── Rezervări ────────────────────────────────────────────────────────────

  const fetchRezervari = useCallback(async () => {
    setLoadingRez(true);
    const res = await fetch('/api/rezervari');
    const json = await res.json();
    setRezervari(json.rezervari ?? json.data ?? []);
    setLoadingRez(false);
  }, []);

  useEffect(() => { if (autentificat) fetchRezervari(); }, [autentificat, fetchRezervari]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/rezervari/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setRezervari(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function deleteRezervare(id: number) {
    await fetch(`/api/rezervari/${id}`, { method: 'DELETE' });
    setRezervari(prev => prev.filter(r => r.id !== id));
  }

  function toggleSort(field: typeof sortRez.field) {
    setSortRez(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  const filteredRez = useMemo(() => {
    let r = rezervari;
    if (filterRez !== 'all') {
      const mapFilter: Record<string, string> = { pending: 'în așteptare', confirmed: 'confirmată', rejected: 'respinsă' };
      r = r.filter(x => x.status === mapFilter[filterRez]);
    }
    if (searchRez.trim()) {
      const q = searchRez.toLowerCase();
      r = r.filter(x => x.nume.toLowerCase().includes(q) || x.telefon.includes(q) || x.email.toLowerCase().includes(q));
    }
    r = [...r].sort((a, b) => {
      let va: string | number = a[sortRez.field];
      let vb: string | number = b[sortRez.field];
      if (sortRez.field === 'nr_persoane') { va = Number(va); vb = Number(vb); }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortRez.dir === 'asc' ? cmp : -cmp;
    });
    return r;
  }, [rezervari, filterRez, searchRez, sortRez]);

  const countsRez = useMemo(() => ({
    all: rezervari.length,
    pending:   rezervari.filter(r => r.status === 'în așteptare').length,
    confirmed: rezervari.filter(r => r.status === 'confirmată').length,
    rejected:  rezervari.filter(r => r.status === 'respinsă').length,
  }), [rezervari]);

  // ─── Produse ──────────────────────────────────────────────────────────────

  const fetchProduse = useCallback(async () => {
    setLoadingProd(true);
    const [resProd, resCat] = await Promise.all([fetch('/api/produse'), fetch('/api/categorii')]);
    const [jsonProd, jsonCat] = await Promise.all([resProd.json(), resCat.json()]);
    setProduse(jsonProd.data ?? []);
    if (Array.isArray(jsonCat.data)) setCategoriiDB(jsonCat.data);
    setLoadingProd(false);
  }, []);

  useEffect(() => { if (autentificat && (tab === 'produse' || tab === 'categorii')) fetchProduse(); }, [autentificat, tab, fetchProduse]);

  const categories = useMemo(() => {
    const ordered = categoriiDB.map(c => c.name);
    const extra = [...new Set(produse.map(p => p.category))].filter(c => !ordered.includes(c));
    return [...ordered, ...extra];
  }, [categoriiDB, produse]);
  function toggleSortProd(field: typeof sortProd.field) {
    setSortProd(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  const filteredProd = useMemo(() => {
    let r = filterCat === 'toate' ? produse : produse.filter(p => p.category === filterCat);
    if (searchProd.trim()) {
      const q = searchProd.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    r = [...r].sort((a, b) => {
      const va = sortProd.field === 'price' ? a.price : a[sortProd.field].toLowerCase();
      const vb = sortProd.field === 'price' ? b.price : b[sortProd.field].toLowerCase();
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortProd.dir === 'asc' ? cmp : -cmp;
    });
    return r;
  }, [produse, filterCat, searchProd, sortProd]);

  function openAdd() { setForm(FORM_INITIAL); setModal('add'); }
  function openEdit(p: Produs) {
    setForm({ name: p.name, category: p.category, price: p.price, description: p.description, ingredients: p.ingredients, image: p.image, vegan: p.vegan });
    setModal(p);
  }

  async function handleImageUpload(file: File) {
    setUploadingImg(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (json.url) setForm(f => ({ ...f, image: json.url }));
    setUploadingImg(false);
  }

  async function resolveUnsplash() {
    setUploadingImg(true);
    const res = await fetch('/api/unsplash', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: form.image }) });
    const json = await res.json();
    if (json.url) setForm(f => ({ ...f, image: json.url }));
    setUploadingImg(false);
  }

  const isUnsplashPageUrl = form.image.includes('unsplash.com/photos/');

  async function saveProdus() {
    if (!form.name.trim() || !form.category.trim()) return;
    setSavingProd(true);
    if (modal === 'add') {
      const res = await fetch('/api/produse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.data?.[0]) setProduse(prev => [...prev, json.data[0]]);
    } else if (modal && typeof modal === 'object') {
      const produsModal = modal as Produs;
      await fetch('/api/produse', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: produsModal.id, ...form }) });
      setProduse(prev => prev.map(p => p.id === produsModal.id ? { ...p, ...form } : p));
    }
    setSavingProd(false);
    setModal(null);
  }

  async function deleteProdus(id: number) {
    setDeletingProdId(id);
    await fetch(`/api/produse?id=${id}`, { method: 'DELETE' });
    setProduse(prev => prev.filter(p => p.id !== id));
    setDeletingProdId(null);
    setConfirmDeleteProd(null);
  }

  async function renameCategory(catId: number, oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) { setRenameCat(null); return; }
    setSavingCat(true);
    await Promise.all([
      fetch('/api/categorii', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: catId, name: newName }) }),
      ...produse.filter(p => p.category === oldName).map(p =>
        fetch('/api/produse', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, category: newName }) })
      ),
    ]);
    setCategoriiDB(prev => prev.map(c => c.id === catId ? { ...c, name: newName } : c));
    setProduse(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
    setSavingCat(false);
    setRenameCat(null);
  }

  async function moveCategory(id: number, dir: 'up' | 'down') {
    const idx = categoriiDB.findIndex(c => c.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categoriiDB.length) return;
    const a = categoriiDB[idx], b = categoriiDB[swapIdx];
    const updated = categoriiDB.map(c => {
      if (c.id === a.id) return { ...c, sort_order: b.sort_order };
      if (c.id === b.id) return { ...c, sort_order: a.sort_order };
      return c;
    }).sort((x, y) => x.sort_order - y.sort_order);
    setCategoriiDB(updated);
    await Promise.all([
      fetch('/api/categorii', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, sort_order: b.sort_order }) }),
      fetch('/api/categorii', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, sort_order: a.sort_order }) }),
    ]);
  }

  async function addCategorie() {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    const res = await fetch('/api/categorii', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCatName.trim() }) });
    const json = await res.json();
    if (json.data?.[0]) setCategoriiDB(prev => [...prev, json.data[0]]);
    setNewCatName('');
    setAddingCat(false);
  }

  async function deleteCategorie(id: number) {
    await fetch(`/api/categorii?id=${id}`, { method: 'DELETE' });
    setCategoriiDB(prev => prev.filter(c => c.id !== id));
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  if (!autentificat) {
    return (
      <main className="min-h-screen bg-[#FDF6EC] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-[#F5E6C8] border border-[#D4B896] rounded-3xl p-8 w-full max-w-sm shadow-lg">
          <div className="mb-6">
            <h1 className="font-dm-serif text-3xl text-[#3B2507]">Admin</h1>
            <p className="text-[#7A5C3A] text-sm mt-1">Vibe Caffè — panou de administrare</p>
          </div>
          <label className="block text-[#3B2507] text-sm font-semibold mb-1.5">Parolă</label>
          <input type="password" value={parola} onChange={e => setParola(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] transition-all mb-4" autoFocus />
          {eroareAuth && <p className="text-red-700 text-sm mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{eroareAuth}</p>}
          <button type="submit" disabled={loadingAuth}
            className="w-full py-3 bg-[#3B2507] hover:bg-[#1E1200] text-[#F5E6C8] font-semibold rounded-xl transition-all">
            {loadingAuth ? 'Se verifică...' : 'Intră'}
          </button>
        </form>
      </main>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#FDF6EC] px-4 py-8">

      {/* Modal produs */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-[#FDF6EC] border border-[#D4B896] rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#D4B896]">
              <h2 className="font-dm-serif text-xl text-[#3B2507]">{modal === 'add' ? 'Produs nou' : 'Editează produs'}</h2>
              <button onClick={() => setModal(null)} className="text-[#B89878] hover:text-[#3B2507] transition-colors"><IconX /></button>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Nume *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all" />
              </div>
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Categorie *</label>
                <input list="categorii-list" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Selectează sau scrie categoria"
                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all" />
                <datalist id="categorii-list">{categories.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Preț (lei) *</label>
                <input type="number" min="0" step="0.5" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all" />
              </div>
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Descriere</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all resize-none" />
              </div>
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Ingrediente</label>
                <textarea rows={2} value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all resize-none" />
              </div>
              <div>
                <label className="block text-[#3B2507] text-xs font-semibold mb-1">Imagine</label>
                <label className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border-2 border-dashed border-[#D4B896] cursor-pointer hover:border-[#3B2507] transition-all text-sm ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                  {uploadingImg ? (
                    <span className="text-[#7A5C3A]">Se încarcă...</span>
                  ) : (
                    <span className="text-[#7A5C3A]">Încarcă imagine de pe dispozitiv</span>
                  )}
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px bg-[#D4B896]" />
                  <span className="text-[#B89878] text-xs">sau URL</span>
                  <div className="flex-1 h-px bg-[#D4B896]" />
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://unsplash.com/photos/... sau CDN direct"
                    className="flex-1 px-3 py-2 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] focus:outline-none focus:border-[#3B2507] text-sm transition-all" />
                  {isUnsplashPageUrl && (
                    <button type="button" onClick={resolveUnsplash} disabled={uploadingImg}
                      className="px-3 py-2 bg-[#3B2507] hover:bg-[#1E1200] disabled:opacity-50 text-[#F5E6C8] text-xs font-semibold rounded-lg transition-all whitespace-nowrap">
                      {uploadingImg ? '...' : 'Convertește'}
                    </button>
                  )}
                </div>
                {form.image && !isUnsplashPageUrl && (
                  <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-[#D4B896]"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.vegan} onChange={e => setForm(f => ({ ...f, vegan: e.target.checked }))} className="w-4 h-4 accent-[#3B2507]" />
                <span className="text-[#3B2507] text-sm font-medium">Produs vegan</span>
              </label>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-[#D4B896]">
              <button onClick={saveProdus} disabled={savingProd || !form.name.trim() || !form.category.trim()}
                className="flex-1 py-2 bg-[#3B2507] hover:bg-[#1E1200] disabled:opacity-50 text-[#F5E6C8] text-sm font-semibold rounded-xl transition-all">
                {savingProd ? 'Se salvează...' : 'Salvează'}
              </button>
              <button onClick={() => setModal(null)}
                className="px-4 py-2 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] text-sm font-medium rounded-xl hover:bg-[#D4B896] transition-all">
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-dm-serif text-3xl text-[#3B2507]">Vibe Caffè</h1>
          <button onClick={logout} title="Ieși"
            className="p-2.5 bg-[#3B2507] hover:bg-[#1E1200] text-[#F5E6C8] rounded-xl transition-all flex items-center justify-center">
            <IconDoor />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#EDD9AF] p-1 rounded-xl w-fit border border-[#D4B896]">
          {([['rezervari', 'Rezervări'], ['produse', 'Produse'], ['categorii', 'Categorii']] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTabAndSave(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-[#3B2507] text-[#F5E6C8] shadow-sm' : 'text-[#7A5C3A] hover:text-[#3B2507]'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: REZERVĂRI ══ */}
        {tab === 'rezervari' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total',      val: countsRez.all,       accent: '#3B2507', bg: '#F5E6C8', border: '#D4B896' },
                { label: 'Așteptare',  val: countsRez.pending,   accent: '#92400E', bg: '#FEF3C7', border: '#D97706' },
                { label: 'Confirmate', val: countsRez.confirmed, accent: '#065F46', bg: '#D1FAE5', border: '#059669' },
                { label: 'Respinse',   val: countsRez.rejected,  accent: '#991B1B', bg: '#FEE2E2', border: '#DC2626' },
              ].map(({ label, val, accent, bg, border }) => (
                <div key={label} className="rounded-xl px-3 py-1 border flex items-center justify-between gap-3" style={{ backgroundColor: bg, borderColor: border }}>
                  <p className="text-xs font-semibold" style={{ color: accent, opacity: 0.75 }}>{label}</p>
                  <p className="text-xl font-bold" style={{ color: accent }}>{val}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F5E6C8] border border-[#D4B896] rounded-2xl p-3 mb-5 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {([['all', 'Toate'], ['pending', 'Așteptare'], ['confirmed', 'Confirmate'], ['rejected', 'Respinse']] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setFilterRez(key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterRez === key ? 'bg-[#3B2507] text-[#F5E6C8] border-[#3B2507]' : 'bg-white/60 border-[#D4B896] text-[#7A5C3A] hover:border-[#3B2507] hover:text-[#3B2507]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleSort('data_ora')} className={`shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all leading-none gap-0.5 ${sortRez.field === 'data_ora' ? 'bg-[#3B2507] border-[#3B2507] text-[#F5E6C8]' : 'bg-[#EDD9AF] border-[#D4B896] text-[#7A5C3A] hover:bg-[#D4B896]'}`}>
                  <span>Rez.</span>
                  <span>{sortRez.field === 'data_ora' ? (sortRez.dir === 'asc' ? '▲' : '▼') : '⇅'}</span>
                </button>
                <input type="text" placeholder="Caută nume, telefon sau email"
                  value={searchRez} onChange={e => setSearchRez(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white border-2 border-[#D4B896] text-[#3B2507] text-sm focus:outline-none focus:border-[#3B2507] transition-all placeholder-[#B89878]" />
                <button onClick={fetchRezervari} className="p-2 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] hover:bg-[#D4B896] rounded-lg transition-all flex items-center justify-center">
                  <IconRefresh />
                </button>
                <button onClick={() => toggleSort('created_at')} className={`shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all leading-none gap-0.5 ${sortRez.field === 'created_at' ? 'bg-[#3B2507] border-[#3B2507] text-[#F5E6C8]' : 'bg-[#EDD9AF] border-[#D4B896] text-[#7A5C3A] hover:bg-[#D4B896]'}`}>
                  <span>Înr.</span>
                  <span>{sortRez.field === 'created_at' ? (sortRez.dir === 'asc' ? '▲' : '▼') : '⇅'}</span>
                </button>
              </div>
            </div>

            {loadingRez ? (
              <p className="text-[#7A5C3A] text-center py-16">Se încarcă...</p>
            ) : filteredRez.length === 0 ? (
              <p className="text-[#7A5C3A] text-center py-16">Nicio rezervare.</p>
            ) : (
              <div className="bg-[#F5E6C8] border border-[#D4B896] rounded-2xl overflow-hidden shadow-sm">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#EDD9AF] border-b border-[#D4B896]">
                        {colOrder.map(col => {
                          const { label, sortField } = COL_HEADERS[col];
                          const isDragging = dragColId === col;
                          const isDragOver = dragOverColId === col && dragColId !== col;
                          return (
                            <th
                              key={col}
                              draggable
                              onDragStart={() => setDragColId(col)}
                              onDragEnter={() => setDragOverColId(col)}
                              onDragOver={e => e.preventDefault()}
                              onDrop={() => {
                                if (!dragColId || dragColId === col) return;
                                const next = [...colOrder];
                                const from = next.indexOf(dragColId);
                                const to = next.indexOf(col);
                                next.splice(from, 1);
                                next.splice(to, 0, dragColId);
                                setColOrder(next);
                                localStorage.setItem('adminColOrder', JSON.stringify(next));
                              }}
                              onDragEnd={() => { setDragColId(null); setDragOverColId(null); }}
                              className={`px-3 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider whitespace-nowrap select-none cursor-grab active:cursor-grabbing transition-colors ${isDragging ? 'opacity-40' : ''} ${isDragOver ? 'bg-[#D4B896]/60' : ''}`}
                            >
                              {sortField ? (
                                <button onClick={() => toggleSort(sortField as typeof sortRez.field)} className="flex items-center gap-1 hover:text-[#3B2507] transition-colors">
                                  {label}
                                  <span className="flex flex-col leading-none">
                                    <span className={`text-[8px] ${sortRez.field === sortField && sortRez.dir === 'asc' ? 'text-[#3B2507]' : 'text-[#D4B896]'}`}>▲</span>
                                    <span className={`text-[8px] ${sortRez.field === sortField && sortRez.dir === 'desc' ? 'text-[#3B2507]' : 'text-[#D4B896]'}`}>▼</span>
                                  </span>
                                </button>
                              ) : label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRez.map((r, i) => {
                        const cfg = STATUS_CONFIG[r.status];
                        return (
                          <tr key={r.id} className={`border-b border-[#D4B896]/40 hover:bg-[#EDD9AF]/50 transition-colors ${i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'}`}>
                            {colOrder.map(col => {
                              switch (col) {
                                case 'nume': return <td key={col} className="px-3 py-3 text-[#3B2507] font-semibold whitespace-nowrap">{r.nume}</td>;
                                case 'contact': return <td key={col} className="px-3 py-3"><div className="text-[#3B2507] text-xs"><a href={`mailto:${r.email}`} className="no-underline">{r.email}</a></div><div className="text-[#7A5C3A] text-xs"><a href={`tel:${r.telefon.replace(/\s/g, '')}`} className="no-underline">{r.telefon}</a></div></td>;
                                case 'pers': return <td key={col} className="px-3 py-3 text-[#3B2507] text-center">{r.nr_persoane}</td>;
                                case 'data': return <td key={col} className="px-3 py-3 text-[#3B2507] whitespace-nowrap">{new Date(r.data_ora).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}</td>;
                                case 'ora': return <td key={col} className="px-3 py-3 text-[#3B2507] font-semibold whitespace-nowrap">{new Date(r.data_ora).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</td>;
                                case 'status': return <td key={col} className="px-3 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span></td>;
                                case 'inregistrat': return <td key={col} className="px-3 py-3 text-[#7A5C3A] text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })}</td>;
                                case 'actiuni': return <td key={col} className="px-3 py-3"><div className="flex items-center gap-1.5">{r.status !== 'confirmată' && <button onClick={() => updateStatus(r.id, 'confirmată')} title="Confirmă" className="p-1.5 rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"><IconCheck /></button>}{r.status !== 'respinsă' && <button onClick={() => updateStatus(r.id, 'respinsă')} title="Respinge" className="p-1.5 rounded-lg border border-red-300 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"><IconX /></button>}{r.status !== 'în așteptare' && <button onClick={() => updateStatus(r.id, 'în așteptare')} title="Resetează" className="p-1.5 rounded-lg border border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"><IconRefresh /></button>}<button onClick={() => deleteRezervare(r.id)} title="Șterge" className="p-1.5 rounded-lg border border-[#D4B896] bg-[#EDD9AF] text-[#7A5C3A] hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors"><IconTrash /></button></div></td>;
                                default: return null;
                              }
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-[#D4B896]/40">
                  {filteredRez.map((r, i) => {
                    const cfg = STATUS_CONFIG[r.status];
                    return (
                      <div key={r.id} className={`px-3 py-1.5 ${i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[#3B2507] font-semibold text-sm leading-none">{r.nume}</p>
                          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[#7A5C3A] text-xs tabular-nums tracking-tight"><a href={`tel:${r.telefon.replace(/\s/g, '')}`} className="no-underline">{r.telefon}</a></p>
                          <div className="flex gap-3 shrink-0">
                            {r.status !== 'confirmată' && <button onClick={() => updateStatus(r.id, 'confirmată')} className="px-3 py-1 rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700"><IconCheck /></button>}
                            {r.status !== 'respinsă' && <button onClick={() => updateStatus(r.id, 'respinsă')} className="px-3 py-1 rounded-lg border border-red-300 bg-red-100 text-red-600"><IconX /></button>}
                            {r.status !== 'în așteptare' && <button onClick={() => updateStatus(r.id, 'în așteptare')} className="px-3 py-1 rounded-lg border border-amber-300 bg-amber-100 text-amber-700"><IconRefresh /></button>}
                            <button onClick={() => deleteRezervare(r.id)} className="px-3 py-1 rounded-lg border border-[#D4B896] bg-[#EDD9AF] text-[#7A5C3A]"><IconTrash /></button>
                          </div>
                        </div>
                        <p className="text-[#3B2507] text-xs truncate"><a href={`mailto:${r.email}`} className="no-underline">{r.email}</a></p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[#7A5C3A] text-[10px] tabular-nums">{new Date(r.data_ora).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })} · <span className="text-[#3B2507] font-semibold">{new Date(r.data_ora).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</span> · {r.nr_persoane}p</p>
                          <p className="text-[#B89878] text-[10px] tabular-nums shrink-0">{new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })} {new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ TAB: PRODUSE ══ */}
        {tab === 'produse' && (
          <>
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="flex flex-wrap gap-1.5">
                {['toate', ...categories].map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterCat === c ? 'bg-[#3B2507] text-[#F5E6C8] border-[#3B2507]' : 'bg-[#F5E6C8] border-[#D4B896] text-[#7A5C3A] hover:border-[#3B2507]'}`}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input type="text" placeholder="Caută produs..." value={searchProd} onChange={e => setSearchProd(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#F5E6C8] border-2 border-[#D4B896] text-[#3B2507] text-sm focus:outline-none focus:border-[#3B2507] transition-all placeholder-[#B89878] w-40 md:w-52" />
                <button onClick={fetchProduse} className="p-2 bg-[#F5E6C8] border border-[#D4B896] text-[#3B2507] hover:bg-[#EDD9AF] rounded-lg transition-all"><IconRefresh /></button>
                <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#3B2507] hover:bg-[#1E1200] text-[#F5E6C8] text-sm font-semibold rounded-xl transition-all">
                  <IconPlus /> Produs nou
                </button>
              </div>
            </div>

            {loadingProd ? (
              <p className="text-[#7A5C3A] text-center py-16">Se încarcă...</p>
            ) : filteredProd.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#7A5C3A] mb-4">Niciun produs{filterCat !== 'toate' ? ` în "${filterCat}"` : ''}.</p>
                <button onClick={openAdd} className="px-5 py-2 bg-[#3B2507] text-[#F5E6C8] text-sm font-semibold rounded-xl hover:bg-[#1E1200] transition-all">Adaugă primul produs</button>
              </div>
            ) : (
              <div className="bg-[#F5E6C8] border border-[#D4B896] rounded-2xl overflow-hidden shadow-sm">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#EDD9AF] border-b border-[#D4B896]">
                        <th className="px-3 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider">Imagine</th>
                        {([['Nume', 'name'], ['Categorie', 'category'], ['Preț', 'price']] as [string, typeof sortProd.field][]).map(([h, field]) => (
                          <th key={h} className="px-3 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider">
                            <button onClick={() => toggleSortProd(field)} className="flex items-center gap-1 hover:text-[#3B2507] transition-colors">
                              {h}
                              <span className="flex flex-col leading-none">
                                <span className={`text-[8px] ${sortProd.field === field && sortProd.dir === 'asc' ? 'text-[#3B2507]' : 'text-[#D4B896]'}`}>▲</span>
                                <span className={`text-[8px] ${sortProd.field === field && sortProd.dir === 'desc' ? 'text-[#3B2507]' : 'text-[#D4B896]'}`}>▼</span>
                              </span>
                            </button>
                          </th>
                        ))}
                        <th className="px-3 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider">Vegan</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProd.map((p, i) => (
                        <tr key={p.id} className={`border-b border-[#D4B896]/40 hover:bg-[#EDD9AF]/50 transition-colors ${i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'}`}>
                          <td className="px-3 py-2">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-[#D4B896]"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-12 h-12 bg-[#EDD9AF] rounded-lg border border-[#D4B896] flex items-center justify-center text-[#B89878] text-xs">N/A</div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <p className="text-[#3B2507] font-semibold">{p.name}</p>
                            <p className="text-[#7A5C3A] text-xs line-clamp-1">{p.description}</p>
                          </td>
                          <td className="px-3 py-2">
                            <span className="px-2 py-0.5 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] text-xs rounded-full font-medium">{p.category}</span>
                          </td>
                          <td className="px-3 py-2 text-[#3B2507] font-bold whitespace-nowrap">{p.price} lei</td>
                          <td className="px-3 py-2">
                            {p.vegan && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-semibold">Vegan</span>}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {confirmDeleteProd === p.id ? (
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => deleteProdus(p.id)} disabled={deletingProdId === p.id}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-all">
                                  {deletingProdId === p.id ? '...' : 'Confirmă'}
                                </button>
                                <button onClick={() => setConfirmDeleteProd(null)} className="px-2 py-1 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] text-xs rounded-lg">Nu</button>
                              </div>
                            ) : (
                              <div className="flex gap-5 justify-end">
                                <button onClick={() => openEdit(p)} className="px-3.5 py-2 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#7A5C3A] hover:text-[#3B2507] hover:bg-[#D4B896] transition-colors"><IconEdit /></button>
                                <button onClick={() => setConfirmDeleteProd(p.id)} className="px-3.5 py-2 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#D4B896] hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors"><IconTrash /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-[#D4B896]/40">
                  {filteredProd.map((p, i) => (
                    <div key={p.id} className={`p-4 flex gap-3 ${i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'}`}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl border border-[#D4B896] flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-16 h-16 bg-[#EDD9AF] rounded-xl border border-[#D4B896] flex-shrink-0 flex items-center justify-center text-[#B89878] text-xs">N/A</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[#3B2507] font-semibold">{p.name}</p>
                          <p className="text-[#3B2507] font-bold whitespace-nowrap">{p.price} lei</p>
                        </div>
                        <p className="text-[#7A5C3A] text-xs mb-2">{p.category}{p.vegan ? ' · Vegan' : ''}</p>
                        <div className="flex gap-4">
                          <button onClick={() => openEdit(p)} className="px-2.5 py-1.5 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507]"><IconEdit /></button>
                          <button onClick={() => setConfirmDeleteProd(p.id)} className="px-2.5 py-1.5 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#7A5C3A]"><IconTrash /></button>
                        </div>
                        {confirmDeleteProd === p.id && (
                          <div className="flex gap-1 mt-2">
                            <button onClick={() => deleteProdus(p.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg">Confirmă</button>
                            <button onClick={() => setConfirmDeleteProd(null)} className="px-2 py-1 bg-[#EDD9AF] text-[#3B2507] text-xs rounded-lg border border-[#D4B896]">Nu</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ TAB: CATEGORII ══ */}
        {tab === 'categorii' && (
          <>
            <div className="flex gap-2 mb-4">
              <input
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addCategorie(); }}
                placeholder="Nume categorie nouă..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#F5E6C8] border-2 border-[#D4B896] text-[#3B2507] text-sm focus:outline-none focus:border-[#3B2507] transition-all placeholder-[#B89878]"
              />
              <button onClick={addCategorie} disabled={addingCat || !newCatName.trim()}
                className="shrink-0 px-4 py-2 bg-[#3B2507] hover:bg-[#1E1200] disabled:opacity-50 text-[#F5E6C8] text-sm font-semibold rounded-xl transition-all whitespace-nowrap">
                {addingCat ? 'Se adaugă...' : 'Categorie nouă'}
              </button>
            </div>
            <div className="bg-[#F5E6C8] border border-[#D4B896] rounded-2xl overflow-hidden shadow-sm">
              {loadingProd ? (
                <p className="text-[#7A5C3A] text-center py-12">Se încarcă...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#EDD9AF] border-b border-[#D4B896]">
                      <th className="px-2 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider w-8">Ord.</th>
                      <th className="px-2 py-3 text-left text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider">Categorie</th>
                      <th className="px-2 py-3 text-center text-[#7A5C3A] font-semibold text-xs uppercase tracking-wider">Prod.</th>
                      <th className="px-2 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriiDB.map((cat, i) => {
                      const count = produse.filter(p => p.category === cat.name).length;
                      return (
                        <tr key={cat.id} className={`border-b border-[#D4B896]/40 ${i % 2 === 0 ? 'bg-[#F5E6C8]' : 'bg-[#FAF0DC]'}`}>
                          <td className="px-1 py-3">
                            <div className="flex flex-col gap-0.5">
                              <button onClick={() => moveCategory(cat.id, 'up')} disabled={i === 0}
                                className="p-0.5 rounded hover:bg-[#D4B896] text-[#7A5C3A] disabled:opacity-20 transition-colors leading-none text-[10px]">▲</button>
                              <button onClick={() => moveCategory(cat.id, 'down')} disabled={i === categoriiDB.length - 1}
                                className="p-0.5 rounded hover:bg-[#D4B896] text-[#7A5C3A] disabled:opacity-20 transition-colors leading-none text-[10px]">▼</button>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            {renameCat === cat.id ? (
                              <input autoFocus value={renameCatVal} onChange={e => setRenameCatVal(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') renameCategory(cat.id, cat.name, renameCatVal); if (e.key === 'Escape') setRenameCat(null); }}
                                className="px-2 py-1 rounded-lg bg-white border-2 border-[#3B2507] text-[#3B2507] text-sm focus:outline-none w-40" />
                            ) : (
                              <span className="text-[#3B2507] font-semibold">{cat.name}</span>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span className="text-[#3B2507] text-sm font-semibold">{count}</span>
                          </td>
                          <td className="px-2 py-3 text-right">
                            {renameCat === cat.id ? (
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => renameCategory(cat.id, cat.name, renameCatVal)} disabled={savingCat}
                                  className="px-2 py-1 bg-[#3B2507] text-[#F5E6C8] text-xs rounded-lg hover:bg-[#1E1200] transition-all">
                                  {savingCat ? '...' : 'Salvează'}
                                </button>
                                <button onClick={() => setRenameCat(null)} className="px-2 py-1 bg-[#EDD9AF] border border-[#D4B896] text-[#3B2507] text-xs rounded-lg">Anulează</button>
                              </div>
                            ) : (
                              <div className="flex gap-5 justify-end">
                                <button onClick={() => { setRenameCat(cat.id); setRenameCatVal(cat.name); }}
                                  className="px-3.5 py-2 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#7A5C3A] hover:text-[#3B2507] hover:bg-[#D4B896] transition-colors" title="Redenumește">
                                  <IconEdit />
                                </button>
                                <button onClick={() => deleteCategorie(cat.id)} disabled={count > 0}
                                  title={count > 0 ? 'Mută produsele mai întâi' : 'Șterge'}
                                  className="px-3.5 py-2 rounded-lg bg-[#EDD9AF] border border-[#D4B896] text-[#D4B896] hover:bg-red-100 hover:text-red-600 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                  <IconTrash />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <p className="text-[#B89878] text-xs mt-3">* O categorie poate fi ștearsă doar dacă nu are produse asociate.</p>
          </>
        )}
      </div>
    </main>
  );
}
