import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import { LoadingState, ErrorState } from "@/components/AsyncState";
import PhoneFrame from "@/components/PhoneFrame";
import ProductSidebar from "@/components/products/ProductSidebar";
import ProductHeroCircularImage from "@/components/products/ProductHeroCircularImage";
import ProductHeroDashboardMockup from "@/components/products/ProductHeroDashboardMockup";
import ProductHeroPhotoCard from "@/components/products/ProductHeroPhotoCard";
import ProductHeroBadgeHeavy from "@/components/products/ProductHeroBadgeHeavy";
import Icon from "@/components/Icon";
import type { ProductDetail as ProductDetailType, ProductHeroLayout } from "@/types";

const heroLayouts: Record<ProductHeroLayout, React.ComponentType<{ product: ProductDetailType }>> = {
  circular_image: ProductHeroCircularImage,
  dashboard_mockup: ProductHeroDashboardMockup,
  photo_card: ProductHeroPhotoCard,
  badge_heavy: ProductHeroBadgeHeavy,
};

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = useAsync(() => api.getProduct(slug), [slug]);
  const sidebar = useAsync(() => api.getProductSidebar(), []);

  // Precise check for thermacheck pages
  const isThermocheck = Boolean(
    product.data?.hero_layout === "badge_heavy" || 
    product.data?.slug?.toLowerCase().includes("thermacheck") ||
    product.data?.name?.toLowerCase().includes("thermacheck")
  );

  const tabs = isThermocheck
    ? (["Overview & Pain Screening", "Specification"] as const)
    : (["Overview", "Specifications"] as const);

  const [tab, setTab] = useState<string>(tabs[0]);
  const [mediaIndex, setMediaIndex] = useState(0);

  // Keep the active tab + media index in sync once the real product data arrives
  useEffect(() => {
    setTab(tabs[0]);
    setMediaIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isThermocheck]);

  if (product.loading && !product.data) return <LoadingState label="Loading product…" />;
  if (product.error && !product.data) return <div className="container-page py-16"><ErrorState message={product.error} /></div>;
  if (!product.data) return null;

  const p = product.data;

  // 8-Way Hero Banner Routing Matrix (Product Slug + Tab)
  const getHeroComponent = () => {
    const s = p.slug || "";
    if (isThermocheck) return ProductHeroBadgeHeavy;
    if (s.includes("patient") && !s.includes("tehomed")) {
      return tab.includes("Overview") ? ProductHeroCircularImage : ProductHeroDashboardMockup;
    }
    if (s.includes("doctor")) {
      return tab.includes("Overview") ? ProductHeroDashboardMockup : ProductHeroCircularImage;
    }
    if (s.includes("tehomed")) {
      return tab.includes("Overview") ? ProductHeroPhotoCard : ProductHeroDashboardMockup;
    }
    return heroLayouts[p.hero_layout] ?? ProductHeroCircularImage;
  };

  const ActiveHeroLayout = getHeroComponent();

  const screenshots = p.screenshots ?? [];
  const keyFeatures = p.key_feature_list ?? [];
  const whyUsePoints = p.why_use_point_list ?? [];
  const specRows = p.specification_rows ?? [];
  const softwareCards = p.software_cards ?? [];

  // Combine cover image (index 0) and up to 3 screenshots to form exactly up to 4 interactive media tabs
  const mediaItems = [
    { type: "cover", image: p.cover_image },
    ...screenshots.map((s) => ({ type: "screenshot", image: s.image }))
  ].slice(0, 4);

  const activeMedia = mediaItems[mediaIndex] || mediaItems[0];
  const activeImage = activeMedia?.image ?? p.cover_image;

  // Sidebar CTA priority: an uploaded spec-sheet PDF > a custom CTA url set by admin > fallback to contact page
  const sidebarCtaHref = p.spec_sheet_pdf || p.sidebar_note_cta_url || "";
  const sidebarCtaLabel = p.sidebar_note_cta_label || "Request Spec Sheet (PDF)";

  return (
    <div className="bg-[#f8fafc] min-h-screen transition-opacity duration-300 ease-in-out">

      {/* ================= DYNAMIC HERO BANNER ================= */}
      <section className="bg-blue-dark py-12 md:py-16 text-white relative shadow-md transition-all duration-300">
        <div className="container-page">
          <ActiveHeroLayout product={p} />
        </div>
      </section>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="container-page py-10">
        <nav className="mb-6 text-sm text-muted">
          <Link to="/" className="hover:text-red">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-red">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">

          {/* ================= LEFT SIDEBAR & CLINICAL SUPPORT ================= */}
          <div className="space-y-6">
            {sidebar.data && (
              <ProductSidebar items={sidebar.data} activeSlug={p.slug} activeProduct={p} />
            )}

            {isThermocheck && (
              <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-xl border border-slate-800 space-y-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red text-white font-bold text-sm">
                    i
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {p.sidebar_note_title || "Clinical Specialist Assistance"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      {p.sidebar_note_text || "Need turnkey installation guidance or ROI estimation for your diagnostic center?"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Support</p>
                  <p className="text-base font-extrabold text-white">{p.sidebar_note_phone || "+91 8851212483"}</p>
                  <p className="text-xs text-slate-300">{p.sidebar_note_email || "dealer.desk@agskipl.com"}</p>
                </div>

                {/* Download / Request Spec Sheet PDF Button */}
                {sidebarCtaHref ? (
                  <a
                    href={sidebarCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-bold text-white transition-all shadow-md"
                  >
                    <Icon name="file" className="h-4 w-4 text-red" />
                    <span>{sidebarCtaLabel}</span>
                  </a>
                ) : (
                  <Link to="/contact" className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-bold text-white transition-all shadow-md">
                    <Icon name="file" className="h-4 w-4 text-red" />
                    <span>{sidebarCtaLabel}</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ================= RIGHT MAIN CONTENT CARD ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">

            {/* Top Media & Summary Section */}
            {isThermocheck ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] items-start">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="w-full flex items-center justify-center min-h-[300px] bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                    <img src={activeImage || undefined} alt={p.name} className="max-h-72 w-auto object-contain rounded-lg" />
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 w-full">
                    {mediaItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setMediaIndex(i)}
                        className={`h-16 rounded-lg border overflow-hidden transition-all bg-white ${
                          mediaIndex === i ? "border-red ring-2 ring-red/20 shadow-sm" : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={item.image || undefined} alt="Thumbnail" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">THERMACHECK™ MEDICAL</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Clinically Validated
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] tracking-tight">{p.name}</h2>
                  <p className="text-sm font-bold text-slate-700 italic">{p.tagline || '“New Concept of Pain & Breast Screening”'}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>

                  <div className="space-y-2.5 pt-2">
                    {keyFeatures.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
                    <span>🛡️ US-FDA Cleared</span>
                    <span>🛡️ CE Certified</span>
                    <span>🛡️ ISO 13485</span>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <Link to="/contact" className="inline-flex items-center justify-center rounded-xl bg-red hover:bg-red-600 text-white font-semibold px-6 py-3.5 text-sm shadow-lg shadow-red/20 transition-all">
                      Request Quotation & Demo →
                    </Link>
                    <Link to="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold px-6 py-3.5 text-sm transition-all">
                      View Hardware Models
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] items-center">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-100 p-6 shadow-inner">
                  <div className="w-full flex items-center justify-center min-h-[340px]">
                    {activeImage ? (
                      <div className="relative rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800 max-w-[260px]">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-24 bg-black rounded-full z-10"></div>
                        <img src={activeImage} alt={p.name} className="h-[380px] w-full rounded-[28px] object-cover bg-white" />
                      </div>
                    ) : (
                      <PhoneFrame appName={p.name} />
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    {mediaItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setMediaIndex(i)}
                        className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-200 bg-white ${
                          mediaIndex === i
                            ? "border-red shadow-md ring-2 ring-red/20 scale-105"
                            : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                        }`}
                      >
                        {item.image ? (
                          <img src={item.image} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {p.logo && <img src={p.logo} alt={p.name} className="h-8 w-8 object-contain" />}
                    <span className="text-xs font-bold uppercase tracking-widest text-red">{p.category.name}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] tracking-tight">{p.name}</h2>
                  {p.tagline && <p className="text-base font-bold text-[#0d1b2a]">{p.tagline}</p>}
                  <p className="text-sm md:text-base leading-relaxed text-slate-600">{p.summary}</p>
                  <div className="pt-2">
                    <Link to="/contact" className="inline-flex items-center justify-center rounded-xl bg-red hover:bg-red-600 text-white font-semibold px-6 py-3.5 text-sm shadow-lg shadow-red/20 transition-all">
                      Enquire About This Product →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TABS & CONTENT SECTION ================= */}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="flex gap-8 border-b border-slate-200">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setMediaIndex(0); }}
                    className={`-mb-px border-b-2 pb-3 text-sm font-bold transition-colors ${
                      tab === t ? "border-red text-red" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {tab.includes("Overview") && (
                <div className="mt-8 transition-opacity duration-300 ease-in-out">
                  {isThermocheck ? (
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-sm font-extrabold text-red tracking-wider uppercase flex items-center gap-2">
                          <span>▶</span> {p.concept_title || "THERMACHECK SCREENING CONCEPT"}
                        </h3>
                        <p className="mt-3 leading-relaxed text-slate-600 text-sm md:text-base">
                          {p.concept_description || p.description || p.summary}
                        </p>
                      </div>

                      {whyUsePoints.length > 0 && (
                        <div>
                          <h3 className="text-sm font-extrabold text-red tracking-wider uppercase flex items-center gap-2 mb-4">
                            <span>▶</span> {p.why_use_title || "WHY SHOULD YOU USE THERMACHECK?"}
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {whyUsePoints.map((f: string, idx: number) => {
                              const parts = f.includes(":") ? f.split(":") : [f, ""];
                              return (
                                <div key={idx} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm flex items-start gap-3">
                                  <span className="h-2 w-2 rounded-full bg-red flex-shrink-0 mt-1.5" />
                                  <div>
                                    <h4 className="text-xs font-bold text-[#0d1b2a]">{parts[0]}</h4>
                                    {parts[1] && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{parts[1]}</p>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-extrabold text-red tracking-wider uppercase flex items-center gap-2 mb-4">
                          <span>▶</span> {p.software_suite_title || "OPTIMIZED IN MEDICAL USE (SOFTWARE SUITE)"}
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {(softwareCards.length > 0 ? softwareCards : [
                            { badge: "AUTO ROI", title: "Thermal Pattern Identification", description: "Automatic region of interest recognition and temperature histogram analysis.", footer_text: "Automated Contouring" },
                            { badge: "AI ASSIST", title: "Automatic Diagnosis Function", description: "AI-supported clinical temperature differential correlation for medical practitioners.", footer_text: "Differential Scoring" },
                            { badge: "GUIDE", title: "Clinical Guide Program", description: "Standardized positioning guide for 22 poses and clinical guides for 53 disease profiles.", footer_text: "53 Disease Profiles" },
                            { badge: "INTERACTIVE", title: "Pain Drawing Chart", description: "Patients or clinicians draw actual pain zones to directly compare with IR thermal maps.", footer_text: "Real-Time Overlay" }
                          ]).map((card, idx: number) => (
                            <div key={(card as any).id || idx} className="rounded-2xl bg-[#0d1b2a] p-5 text-white flex flex-col justify-between shadow-lg border border-slate-800">
                              <div>
                                {card.badge && (
                                  <span className="inline-block rounded bg-red px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white mb-3">
                                    {card.badge}
                                  </span>
                                )}
                                <h4 className="text-sm font-bold text-white">{card.title}</h4>
                                <p className="text-[11px] text-white/70 mt-2 leading-relaxed">{card.description}</p>
                              </div>
                              <div className="mt-6 pt-3 border-t border-white/10 text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                                {card.footer_text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-bold text-[#0d1b2a]">Product Overview</h3>
                      <p className="mt-3 max-w-4xl leading-relaxed text-slate-600 text-sm md:text-base">{p.description || p.summary}</p>

                      {keyFeatures.length > 0 && (
                        <>
                          <h3 className="mt-8 text-lg font-bold text-[#0d1b2a]">Key Features</h3>
                          <div className="mt-4 grid gap-x-12 gap-y-3.5 sm:grid-cols-2">
                            {keyFeatures.map((f: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red text-white">✓</span>
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SPECIFICATIONS TAB */}
              {tab.includes("Specification") && (
                <div className="mt-8 transition-opacity duration-300 ease-in-out">
                  {isThermocheck ? (
                    <div className="space-y-10">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-xs font-extrabold text-red uppercase tracking-wider">SYSTEM CONFIGURATIONS</span>
                            <h3 className="text-xl font-extrabold text-[#0d1b2a] tracking-tight mt-0.5">Hardware Models & Workstations</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Customized turnkey setups engineered for specialized diagnostic clinics and tertiary hospitals.</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span> 3 Standard Form Factors
                          </span>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                          {[
                            { badge: "PREMIUM TYPE", title: "Premium Type", desc: "Complete clinical suite for hospitals and high-volume diagnostic centers.", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80", features: ["Camera (Auto-Focusing)", "Motorized Column Stand", "Dedicated Work Station Cart"], footerLabel: "Head Rotation", footerVal: "Remote Controlled", isFeatured: true },
                            { badge: "", title: "Standard Type", desc: "Versatile setup for specialized outpatient clinics and physical rehabilitation.", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80", features: ["Camera (Auto / Manual)", "Motorized Column Stand", "IRIS-XP Diagnostic Software"], footerLabel: "Focusing Mode", footerVal: "Manual / Auto", isFeatured: false },
                            { badge: "", title: "Economy Type", desc: "Portable thermal imaging solution for mobile screening and compact practices.", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80", features: ["Camera (Manual Focus)", "Tripod Stand", "IRIS-XP Diagnostic Software"], footerLabel: "Portability", footerVal: "High (Compact Case)", isFeatured: false }
                          ].map((model, idx) => (
                            <div key={idx} className={`relative rounded-2xl bg-white p-5 shadow-sm flex flex-col justify-between ${model.isFeatured ? "border-2 border-red shadow-md" : "border border-slate-200"}`}>
                              {model.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">{model.badge}</div>
                              )}
                              <div>
                                <div className="mt-3 flex h-40 w-full items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                                  <img src={model.image} alt={model.title} className="h-full object-contain" />
                                </div>
                                <h4 className="mt-4 text-base font-extrabold text-[#0d1b2a]">{model.title}</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{model.desc}</p>
                                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                                  {model.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full ${model.isFeatured ? "bg-red" : "bg-slate-400"}`}></span>{f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                                <span className="text-slate-400">{model.footerLabel}</span>
                                <span className={model.isFeatured ? "text-red" : "text-slate-700"}>{model.footerVal}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-12">
                        <div className="border-b border-slate-200 pb-3 mb-6">
                          <span className="text-xs font-extrabold text-red uppercase tracking-wider">TECHNICAL SPECIFICATIONS</span>
                          <h3 className="text-xl font-extrabold text-[#0d1b2a] tracking-tight mt-0.5">ThermaCheck™ Medical Infrared Imaging System</h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm text-sm">
                          <div className="divide-y divide-slate-200">
                            {specRows.length > 0 ? (
                              specRows.map((row: any, idx: number) => (
                                <div key={idx} className="grid md:grid-cols-[240px_1fr] bg-white">
                                  <div className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/70">{row.label}</div>
                                  <div className="p-4 text-slate-600 text-xs md:text-sm font-medium">{row.value}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-slate-500 text-sm">Technical data sheet specifications will be populated from admin.</div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-red/20 bg-red/5 p-4 text-xs text-red/90 flex items-start gap-3">
                          <span className="font-bold text-sm mt-0.5">⚠️</span>
                          <p className="leading-relaxed font-medium">
                            <strong>As Per US FDA (2021):</strong> Thermogram is not the substitute for Mammogram. It is an early-stage physiological diagnostic screening tool.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-bold text-[#0d1b2a]">Product Specifications</h3>
                      {specRows.length > 0 ? (
                        <div className="mt-6 grid gap-x-12 sm:grid-cols-2">
                          {[0, 1].map((col) => {
                            const half = Math.ceil(specRows.length / 2);
                            const rows = specRows.slice(col * half, col * half + half);
                            return (
                              <div key={col} className="divide-y divide-slate-100">
                                {rows.map((row: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                                    <span className="text-slate-500 font-medium">{row.label}</span>
                                    <span className="text-right font-semibold text-blue-600 bg-blue-50/60 px-2.5 py-1 rounded-md">{row.value}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">Specifications for this product will be added soon.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}