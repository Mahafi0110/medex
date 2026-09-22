import type { ProductDetail } from "@/types";

export default function ProductHeroBadgeHeavy({ product: p }: { product: ProductDetail }) {
  // Fallback compliance badges if Django admin fields are empty
  const badges = p.hero_badges?.length > 0 
    ? p.hero_badges 
    : ["US-FDA Cleared", "CE Certified", "ISO 13485 Compliant", "Zero Ionizing Radiation"];

  return (
    <div className="space-y-6">
      {/* Top FDA Status Tag */}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{p.hero_eyebrow || "FDA Cleared Medical Thermography Imaging System"}</span>
      </div>

      {/* Main Hero Title */}
      <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-5xl lg:text-6xl text-white max-w-4xl">
        {p.hero_title || "Digital Infrared Thermal Imaging Solutions"}
      </h1>

      {/* Hero Subtitle */}
      <p className="text-white/80 text-base md:text-lg max-w-3xl leading-relaxed">
        {p.hero_subtitle || "New Concept of Pain & Breast Screening — early detection, 100% radiation-free, painless & non-invasive physiological diagnostic screening."}
      </p>

      {/* Compliance Badge Row */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        {badges.map((badge, idx) => (
          <div 
            key={idx} 
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/15"
          >
            <span className="text-amber-400">✓</span>
            <span>{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}