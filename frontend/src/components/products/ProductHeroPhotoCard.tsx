import type { ProductDetail } from "@/types";

export default function ProductHeroPhotoCard({ product: p }: { product: ProductDetail }) {
  const badges = p.hero_badges?.length > 0 
    ? p.hero_badges 
    : ["Trusted Platform", "Patient-Centric", "Better Health Outcomes"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-center py-2">
      {/* Left Column: Eyebrow, Title, Subtitle, and Red Icon Badges */}
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-red mb-3">
          {p.hero_eyebrow || "OUR PRODUCTS"}
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-4xl lg:text-5xl text-white">
          {p.hero_title || "Digital Healthcare Solutions for a Healthier Tomorrow"}
        </h1>

        <p className="mt-3 text-white/80 text-base md:text-lg">
          {p.hero_subtitle || "Connected Care. Empowered Patients."}
        </p>

        {/* Bottom Red Pill Badges Row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {badges.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red text-white shadow-md">
                {idx === 1 ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l-.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06-.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                ) : idx === 2 ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                )}
              </span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column: Three Stacked Glassmorphism Feature Buttons */}
      <div className="hidden xl:flex flex-col gap-2.5">
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">❤️</span>
          <span>Track<br/><span className="text-[10px] text-white/70 font-normal">Your Health</span></span>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">📅</span>
          <span>Book<br/><span className="text-[10px] text-white/70 font-normal">Appointments</span></span>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md shadow-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">💬</span>
          <span>Stay<br/><span className="text-[10px] text-white/70 font-normal">Connected</span></span>
        </div>
      </div>

      {/* Right Column: Tablet Preview Card + Tagline with Bottom Red Line */}
      <div className="flex items-center justify-center lg:justify-end gap-6">
        <div className="w-[240px] md:w-[280px] overflow-hidden rounded-xl bg-white p-1.5 shadow-2xl">
          <img 
            src={p.hero_image || "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=600&q=80"} 
            alt={p.name} 
            className="h-44 w-full rounded-lg object-cover" 
          />
        </div>

        <div className="max-w-[150px]">
          <p className="text-sm md:text-base font-bold leading-snug text-white">
            {p.hero_tagline || "Better Care Closer to You With TehoMed"}
          </p>
          <div className="mt-3 h-1 w-10 bg-red rounded-full"></div>
        </div>
      </div>
    </div>
  );
}