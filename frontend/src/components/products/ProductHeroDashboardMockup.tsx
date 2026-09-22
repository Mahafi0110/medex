import type { ProductDetail } from "@/types";
import HeroBadges from "./HeroBadges";

export default function ProductHeroDashboardMockup({ product: p }: { product: ProductDetail }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
      {/* Left Column: Title, Subtitle, and Badges */}
      <div className="max-w-2xl">
        {p.hero_eyebrow && <p className="section-eyebrow mb-3 text-pink-accent">— {p.hero_eyebrow}</p>}
        
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
          {p.hero_title || "Digital Healthcare Solutions for a Smarter Tomorrow"}
        </h1>
        
        <p className="mt-3 text-base text-white/80 md:text-lg">
          {p.hero_subtitle || "Connected. Efficient. Patient-Centric."}
        </p>

        <div className="mt-6">
          <HeroBadges badges={p.hero_badges?.length ? p.hero_badges : ["Innovative Solutions", "Trusted Technology", "Better Healthcare"]} />
        </div>
      </div>

      {/* Right Column: Dashboard Mockup Window + Tagline with Red Left Border */}
      <div className="flex items-center justify-center gap-6 lg:justify-end">
        {/* Dashboard Window Frame */}
        <div className="w-[320px] rounded-xl border border-white/10 bg-blue-950/80 p-3 shadow-2xl md:w-[380px] backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1 text-white/70">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex gap-3 text-xs opacity-75">
              <span>👤</span><span>📋</span><span>❤️</span><span>🩺</span><span>📄</span>
            </div>
          </div>

          <div className="mt-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-blue-900/50 md:h-44">
            {p.hero_image ? (
              <img src={p.hero_image} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-blue-300/60">
                <svg viewBox="0 0 24 24" className="h-10 w-10 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="text-xs">Dashboard Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Tagline Box with Red Accent Line */}
        {p.hero_tagline && (
          <p className="max-w-[150px] border-l-2 border-red pl-4 text-sm font-semibold leading-snug text-white md:text-base">
            {p.hero_tagline}
          </p>
        )}
      </div>
    </div>
  );
}