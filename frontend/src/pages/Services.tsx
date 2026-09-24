import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import Icon from "@/components/Icon";
import ServiceEnquiryForm from "@/components/ServiceEnquiryForm";
import { LoadingState, ErrorState } from "@/components/AsyncState";
import type { ServicePageSidebarItem, ServicePosterItem } from "@/types";

export default function Services() {
  const { slug } = useParams();
  const sidebar = useAsync(() => api.getServicePageSidebar(), []);

  if (!slug) {
    if (sidebar.loading && !sidebar.data) return <LoadingState label="Loading services…" />;
    if (sidebar.error && !sidebar.data) return <div className="container-page py-16"><ErrorState message={sidebar.error} /></div>;
    if (sidebar.data && sidebar.data.length > 0) {
      return <Navigate to={`/services/${sidebar.data[0].slug}`} replace />;
    }
    return <div className="container-page py-16"><ErrorState message="No services configured yet." /></div>;
  }

  return <ServiceTab slug={slug} sidebarItems={sidebar.data ?? []} />;
}

function ServiceTab({ slug, sidebarItems }: { slug: string; sidebarItems: ServicePageSidebarItem[] }) {
  const page = useAsync(() => api.getServicePage(slug), [slug]);
  const [activePoster, setActivePoster] = useState<ServicePosterItem | null>(null);

  if (page.loading && !page.data) return <LoadingState label="Loading…" />;
  if (page.error && !page.data) return <div className="container-page py-16"><ErrorState message={page.error} /></div>;
  if (!page.data) return null;

  const p = page.data;
  const isCareer = p.feature_items.some((f) => f.focus_text);
  const isTraining = slug.includes("training");

  return (
    <div className="transition-opacity duration-300 ease-in-out bg-[#f8fafc] min-h-screen">

      {/* ================= DYNAMIC HERO BANNER ================= */}
      <section
        className="relative bg-cover bg-center text-ink min-h-[460px] lg:min-h-[500px] flex flex-col justify-center transition-all duration-300 shadow-md"
        style={p.hero_image ? { backgroundImage: `url(${p.hero_image})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />

        <div className="container-page relative grid gap-8 py-12 lg:grid-cols-[1fr_320px] lg:items-center z-10">
          <div>
            {p.hero_eyebrow && <p className="section-eyebrow mb-3 text-red font-bold">— {p.hero_eyebrow}</p>}
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl tracking-tight text-blue-dark">
              {p.hero_title_main}{" "}
              <span className="text-red">{p.hero_title_highlight}</span>
            </h1>
            {p.hero_subtitle && <p className="mt-3 max-w-xl text-slate-600 text-sm md:text-base leading-relaxed">{p.hero_subtitle}</p>}

            {p.hero_cta_label && (
              <Link to="/contact" className="btn-primary mt-6 inline-flex shadow-lg shadow-red/20">
                {p.hero_cta_label} →
              </Link>
            )}

            {p.hero_badges.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {p.hero_badges.map((b) => (
                  <div key={b.text} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red/10 text-red">
                      <Icon name={b.icon} className="h-3.5 w-3.5" />
                    </span>
                    {b.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {p.hero_tagline_lines.length > 0 && (
            <div className="rounded-2xl bg-white/90 backdrop-blur-md p-5 text-ink shadow-2xl border border-slate-200">
              {p.hero_tagline_lines.map((line, i) => (
                <p key={i} className="text-sm md:text-base font-bold text-blue-dark leading-snug">
                  {line}
                </p>
              ))}
              <div className="mt-3 h-1 w-10 bg-red rounded-full" />
            </div>
          )}
        </div>
      </section>

      {/* ================= BALANCED NAVIGATION TABS BAR ================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container-page py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80">
            {sidebarItems.map((item) => {
              const active = item.slug === slug;
              return (
                <Link
                  key={item.slug}
                  to={`/services/${item.slug}`}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-center transition-all duration-200 ${
                    active
                      ? "bg-red text-white shadow-md shadow-red/20"
                      : "bg-white text-slate-700 hover:text-blue-dark hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  <Icon name={item.nav_icon} className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : "text-red"}`} />
                  <span className="whitespace-normal break-words leading-tight">{item.nav_label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT BODY ================= */}
      <div key={slug} className="animate-fadeIn transition-opacity duration-300 ease-in-out">
        <div className="container-page py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] items-start">

            {/* Left Content Column */}
            <div className="space-y-12">

              {/* Overview Section */}
              {(p.overview_title || p.overview_description) && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  {p.overview_eyebrow && <p className="section-eyebrow mb-2 text-red">— {p.overview_eyebrow}</p>}
                  {p.overview_title && <h2 className="text-2xl font-extrabold text-blue-dark">{p.overview_title}</h2>}
                  {p.overview_subtitle && <p className="mt-2 text-muted font-medium">{p.overview_subtitle}</p>}
                  {p.overview_description && (
                    <p className="mt-4 leading-relaxed text-slate-600 text-sm md:text-base">{p.overview_description}</p>
                  )}
                </div>
              )}

              {/* Dynamic Features Grid */}
              {p.feature_items.length > 0 && (
                <div>
                  {isCareer ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {p.feature_items.map((f) => (
                        <div key={f.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                          <div>
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                              {f.image && <img src={f.image} alt={f.title} className="h-full w-full object-cover" />}
                              {f.tag_label && (
                                <span className="absolute left-3 top-3 rounded-md bg-red px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                                  {f.tag_label}
                                </span>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red/10 text-red">
                                  <Icon name={f.icon} className="h-4 w-4" />
                                </span>
                                <h3 className="text-base font-bold text-blue-dark">{f.title}</h3>
                              </div>
                              {f.focus_text && (
                                <div className="mt-4 space-y-1">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Typical Focus:</p>
                                  <p className="text-xs text-slate-600 leading-relaxed">{f.focus_text}</p>
                                </div>
                              )}
                              {f.background_text && (
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Background:</p>
                                  <p className="text-xs text-slate-600 leading-relaxed">{f.background_text}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="px-6 pb-6 pt-0">
                            <a href={f.apply_url || "/contact"} className="inline-flex items-center gap-1.5 text-xs font-bold text-red hover:underline">
                              Apply for Role ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isTraining ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {p.feature_items.map((f) => (
                        <div key={f.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                          <div>
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                              {f.image ? (
                                <img src={f.image} alt={f.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-xs">No Image Provided</div>
                              )}
                            </div>
                            <div className="p-5 text-center">
                              <div className="mx-auto -mt-10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red text-white shadow-md relative z-10 border-2 border-white">
                                <Icon name={f.icon} className="h-5 w-5" />
                              </div>
                              <h3 className="text-base font-bold text-blue-dark">{f.title}</h3>
                              {(f as any).description && (
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{(f as any).description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {p.overview_title && <h2 className="text-xl font-extrabold text-blue-dark mb-1">{p.overview_title}</h2>}
                      {p.overview_subtitle && <p className="text-sm text-muted mb-6">{p.overview_subtitle}</p>}

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {p.feature_items.map((f) => (
                          <div key={f.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red/10 text-red mb-3">
                              <Icon name={f.icon} className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold text-blue-dark">{f.title}</h3>
                            {(f as any).description && (
                              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{(f as any).description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Process Steps */}
              {p.process_steps.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  {p.process_title && <h2 className="text-xl font-bold text-blue-dark">{p.process_title}</h2>}
                  {p.process_subtitle && <p className="mt-1 text-sm text-muted">{p.process_subtitle}</p>}

                  <div className="relative mt-10 grid gap-6 sm:grid-cols-5">
                    <div className="absolute left-0 right-0 top-[18px] hidden h-0.5 bg-red sm:block" />

                    {p.process_steps.map((step, i) => (
                      <div key={step.id} className="relative text-center">
                        <div className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red text-sm font-bold text-white shadow-md ring-4 ring-white">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <p className="mt-3 text-sm font-bold text-blue-dark">{step.title}</p>
                        {step.description && <p className="mt-1 text-xs text-muted leading-relaxed">{step.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Items Section */}
              {p.equipment_title && p.equipment_items.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-blue-dark">{p.equipment_title}</h2>
                  {p.equipment_subtitle && <p className="mt-1 text-sm text-muted">{p.equipment_subtitle}</p>}
                  <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                    {p.equipment_items.map((eq) => (
                      <div key={eq.id} className="bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col items-center gap-2 p-4 text-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red/10 text-red">
                          <Icon name={eq.icon} className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium text-ink">{eq.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poster / Hiring Announcements Section */}
              {p.poster_title && p.poster_items?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-blue-dark">{p.poster_title}</h2>
                  {p.poster_subtitle && <p className="mt-1 text-sm text-muted">{p.poster_subtitle}</p>}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {p.poster_items.map((poster) => (
                      <button
                        key={poster.id}
                        type="button"
                        onClick={() => setActivePoster(poster)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-red/50"
                      >
                        <img
                          src={poster.image}
                          alt={poster.title || "Hiring announcement"}
                          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Value Items Section */}
              {p.secondary_title && p.value_items.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  {p.secondary_eyebrow && <p className="section-eyebrow mb-2 text-red">— {p.secondary_eyebrow}</p>}
                  <h2 className="text-xl font-bold text-blue-dark">{p.secondary_title}</h2>
                  {p.secondary_subtitle && <p className="mt-1 text-sm text-muted">{p.secondary_subtitle}</p>}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {p.value_items.map((v) => (
                      <div key={v.id} className="rounded-xl bg-slate-50 border border-slate-200/60 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/10 text-red">
                          <Icon name={v.icon} className="h-5 w-5" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-blue-dark">{v.title}</p>
                        {v.description && <p className="mt-1 text-xs text-muted">{v.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Images Section */}
              {p.gallery_title && p.gallery_images.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-blue-dark">{p.gallery_title}</h2>
                  {p.gallery_subtitle && <p className="mt-1 text-sm text-muted">{p.gallery_subtitle}</p>}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {p.gallery_images.map((g) => (
                      <div key={g.id}>
                        <img src={g.image} alt={g.caption} className="h-40 w-full rounded-xl object-cover shadow-xs border border-slate-200" />
                        {g.caption && <p className="mt-2 text-xs font-medium text-muted">{g.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Enquiry Form Column */}
            <div>
              <div className="sticky top-28">
                <ServiceEnquiryForm page={p} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= POSTER POPUP MODAL ================= */}
      {activePoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActivePoster(null)}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActivePoster(null)}
              aria-label="Close"
              className="absolute -top-10 right-0 text-2xl font-bold text-white transition-colors hover:text-red"
            >
              ✕
            </button>
            <img
              src={activePoster.image}
              alt={activePoster.title || "Hiring announcement"}
              className="max-h-[85vh] w-full rounded-xl object-contain shadow-2xl"
            />
            {activePoster.title && (
              <p className="mt-3 text-center text-sm font-medium text-white">{activePoster.title}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}