/**
 * 🎯 HERO STARTER - Versiunea simplă pentru cursanți
 *
 * Aceasta este versiunea MINIMALISTĂ de la care plecăm în curs.
 * Fără animații, fără video, fără JavaScript complex.
 * Doar HTML + Tailwind CSS = fundația de bază.
 */

export default function HeroStarter() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* VIDEO FUNDAL */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-coffee.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY ÎNTUNECAT */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* TITLU PRINCIPAL */}
        <h1
          className="hero-animate hero-delay-1 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-white text-shadow-2xl"
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)' }}
        >
          Cafeaua perfectă. Mereu.
        </h1>

        {/* SUBTITLU */}
        <p
          className="hero-animate hero-delay-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 text-white/90"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
        >
          De la boabă la ceașcă — fără compromisuri
        </p>

        {/* BUTOANE CTA */}
        <div className="hero-animate hero-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#meniu"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Meniu
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10"
          >
            Vizitează-ne
          </a>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <a href="#footer" className="hero-animate hero-delay-4 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
