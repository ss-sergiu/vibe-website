'use client';

import { useState } from 'react';

const menuItems = [
  // Espresso
  { name: 'Espresso', price: 12, category: 'Espresso', description: 'Shot dublu de espresso intens', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&auto=format&fit=crop' },
  { name: 'Americano', price: 14, category: 'Espresso', description: 'Espresso diluat cu apă caldă', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&auto=format&fit=crop' },
  { name: 'Cappuccino', price: 16, category: 'Espresso', description: 'Espresso cu lapte spumat catifelat', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop' },
  { name: 'Flat White', price: 17, category: 'Espresso', description: 'Microfoam mătăsos peste espresso', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop' },
  { name: 'Latte', price: 18, category: 'Espresso', description: 'Espresso cu lapte cald și foam ușor', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&auto=format&fit=crop' },
  { name: 'Cortado', price: 15, category: 'Espresso', description: 'Espresso tăiat cu lapte cald 1:1', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop' },

  // Specialty
  { name: 'Pourover V60', price: 22, category: 'Specialty', description: 'Extracție manuală, single origin Etiopia', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop' },
  { name: 'AeroPress', price: 20, category: 'Specialty', description: 'Corp plin, presiune controlată', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop' },
  { name: 'Chemex', price: 24, category: 'Specialty', description: 'Filtru gros, claritate maximă în cană', image: 'https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=400&auto=format&fit=crop' },
  { name: 'Batch Brew', price: 16, category: 'Specialty', description: 'Filter coffee proaspăt, rotit la 2h', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop' },

  // Cold Brew
  { name: 'Cold Brew Classic', price: 18, category: 'Cold Brew', description: 'Infuzie la rece 18h, servit cu gheață', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
  { name: 'Cold Brew Tonic', price: 22, category: 'Cold Brew', description: 'Cold brew cu apă tonică și lime', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop' },
  { name: 'Iced Latte', price: 20, category: 'Cold Brew', description: 'Espresso răcit cu lapte și gheață', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop' },
  { name: 'Nitro Cold Brew', price: 24, category: 'Cold Brew', description: 'Cold brew infuzat cu azot, cremos', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&auto=format&fit=crop' },

  // Patiserie
  { name: 'Croissant simplu', price: 12, category: 'Patiserie', description: 'Unt franțuzesc, crocant la exterior', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop' },
  { name: 'Pain au chocolat', price: 14, category: 'Patiserie', description: 'Aluat foietaj cu ciocolată belgiană', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&auto=format&fit=crop' },
  { name: 'Banana bread', price: 16, category: 'Patiserie', description: 'Rețetă proprie, fără zahăr rafinat', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop' },
  { name: 'Cheesecake', price: 22, category: 'Patiserie', description: 'Cremă Philadelphia, bază biscuiți', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop' },
];

const categories = ['Espresso', 'Specialty', 'Cold Brew', 'Patiserie'];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Espresso');

  const filtered = menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="meniu" className="py-20 px-6 bg-[#1C0F07]">
      <div className="max-w-7xl mx-auto">

        {/* TITLU */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#F5E6C8] text-center mb-12">
          Meniu
        </h2>

        {/* TAB-URI CATEGORII */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#F5E6C8] text-[#1E1200]'
                  : 'bg-transparent border-2 border-[#F5E6C8] text-[#F5E6C8] hover:shadow-[0_0_20px_rgba(245,230,200,0.3)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* GRID PRODUSE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.name}
              className="bg-[#F5E6C8] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,230,200,0.3)]"
            >
              <div className="overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
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

      </div>
    </section>
  );
}
