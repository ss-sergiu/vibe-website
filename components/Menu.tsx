'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type MenuItem = { id: number; name: string; price: number; category: string; description: string; image: string; vegan?: boolean; ingredients?: string };
type Categorie = { id: number; name: string; sort_order: number };

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/produse').then(r => r.json()),
      fetch('/api/categorii').then(r => r.json()),
    ]).then(([produse, cat]) => {
      if (Array.isArray(produse.data)) setMenuItems(produse.data);
      if (Array.isArray(cat.data)) {
        const ordered = (cat.data as Categorie[]).map(c => c.name);
        // Append any product categories not yet in the categorii table
        const produseItems = (produse.data ?? []) as MenuItem[];
        const allCats = produseItems.map(i => i.category);
        const extra = [...new Set(allCats)].filter(c => !ordered.includes(c));
        setCategories([...ordered, ...extra]);
      } else if (Array.isArray(produse.data)) {
        const produseItems = produse.data as MenuItem[];
        setCategories([...new Set(produseItems.map(i => i.category))]);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const [showSticky, setShowSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(64);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const stickyTabsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getNavH = () => document.getElementById('main-nav')?.offsetHeight ?? 64;

    const update = () => {
      const navH = getNavH();
      setNavHeight(navH);
      if (!tabsRef.current || !sectionRef.current) return;
      const tabsRect = tabsRef.current.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();
      setShowSticky(tabsRect.top < navH && sectionRect.bottom > 120);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Scroll active tab into view in sticky bar
  useEffect(() => {
    if (!stickyTabsRef.current) return;
    const active = stickyTabsRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (active) active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }, [activeCategory, showSticky]);

  const handleCategoryClick = (category: string, fromSticky = false) => {
    setActiveCategory(category);
    if (fromSticky && productsRef.current) {
      const top = productsRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const filtered = menuItems.filter(item => item.category === activeCategory);

  const tabButtons = (small = false, fromSticky = false) => categories.map(category => (
    <button
      key={category}
      data-active={activeCategory === category ? 'true' : 'false'}
      onClick={() => handleCategoryClick(category, fromSticky)}
      className={`rounded-full font-semibold transition-all duration-300 btn-glow shrink-0 ${
        small ? 'px-4 py-1.5 text-sm border' : 'px-6 py-3 border-2'
      } ${
        activeCategory === category
          ? 'bg-[#F5E6C8] text-[#1E1200] hover:scale-105'
          : 'bg-transparent border-[#F5E6C8] text-[#F5E6C8] hover:scale-105'
      }`}
    >
      {category}
    </button>
  ));

  return (
    <section id="meniu" ref={sectionRef} className="py-20 px-6 bg-[#1C0F07]">

      {/* TAB-URI STICKY */}
      <div style={{ top: navHeight }} className={`fixed left-0 right-0 z-40 bg-[#1C0F07]/95 backdrop-blur-md shadow-lg py-2 px-6 overflow-hidden transition-all duration-300 ${
        showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div ref={stickyTabsRef} className="max-w-7xl mx-auto flex gap-3 overflow-x-auto scrollbar-none">
          {tabButtons(true, true)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* TITLU */}
        <h2 className="font-dm-serif text-4xl md:text-5xl text-[#F5E6C8] text-center mb-12">
          Meniu
        </h2>

        {loading ? (
          <p className="text-[#F5E6C8]/50 text-center py-16">Se încarcă...</p>
        ) : menuItems.length === 0 ? (
          <p className="text-[#F5E6C8]/50 text-center py-16">Meniul nu este disponibil momentan.</p>
        ) : (
          <>
            {/* TAB-URI NORMALE */}
            <div ref={tabsRef} className="flex flex-wrap justify-center gap-3 mb-10">
              {tabButtons(false)}
            </div>

            <div ref={productsRef} />

            {/* GRID PRODUSE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="bg-[#F5E6C8] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,230,200,0.3)]"
                >
                  <div className="overflow-hidden h-48 relative bg-[#3B2507]/20">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-[#1E1200] mb-2">{item.name}</h4>
                      <p className="text-[#3B2507] text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-4">
                      <span className="text-lg font-bold text-[#1E1200]">{item.price} RON</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
