'use client';

import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function Features() {
  const { elementRef, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="py-20 px-6 bg-[#1C0F07]">
      <div className="max-w-7xl mx-auto">

        {/* TITLU */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#F5E6C8] text-center mb-12">
          De ce Vibe Coffee?
        </h2>

        {/* BENTO GRID */}
        <div ref={elementRef} className="grid grid-cols-1 gap-6">

          {/* CARD MARE - stânga */}
          <div className={`bg-[#F5E6C8] rounded-2xl overflow-hidden flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,230,200,0.3)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '0ms' }}>
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop"
              alt="Cafea specialitate"
              className="w-full h-48 object-cover"
            />
            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-3xl font-bold text-[#1E1200] mb-4">
                  Cafea de specialitate, boabe proaspăt prăjite
                </h3>
                <p className="text-lg text-[#3B2507] leading-relaxed">
                  Lucrăm doar cu ferme certificate, cu trasabilitate completă de la origine până în ceașca ta. Fiecare lot este prăjit săptămânal în micul nostru atelier.
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-[#1E1200] text-[#F5E6C8] rounded-full text-sm font-semibold">
                  ☕ Single Origin
                </span>
              </div>
            </div>
          </div>

          {/* CARDURI MICI - rând de jos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CARD MIC 1 */}
            <div className={`bg-[#F5E6C8] rounded-2xl overflow-hidden flex flex-col min-h-[150px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,230,200,0.3)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: '150ms' }}>
              <img
                src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop"
                alt="Patiserie artizanală"
                className="w-full h-40 object-cover"
              />
              <div className="p-6 flex flex-col flex-1 justify-between">
                <h4 className="text-xl font-bold text-[#1E1200] mb-3">
                  Patiserie Artizanală
                </h4>
                <p className="text-[#3B2507]">
                  Croissante, pain au chocolat și prăjituri preparate zilnic în bucătăria noastră, din ingrediente naturale.
                </p>
              </div>
            </div>

            {/* CARD MIC 2 */}
            <div className={`bg-[#F5E6C8] rounded-2xl overflow-hidden flex flex-col min-h-[150px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,230,200,0.3)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: '300ms' }}>
              <img
                src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop"
                alt="Ambient relaxant"
                className="w-full h-40 object-cover"
              />
              <div className="p-6 flex flex-col flex-1 justify-between">
                <h4 className="text-xl font-bold text-[#1E1200] mb-3">
                  Ambient relaxant
                </h4>
                <p className="text-[#3B2507]">
                  WiFi rapid, prize la fiecare masă și muzică ambientală selectată cu grijă.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
