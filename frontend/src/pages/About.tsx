import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import StatsBar from "@/components/StatsBar";
import Icon from "@/components/Icon";
import { LoadingState, ErrorState } from "@/components/AsyncState";

export default function About() {
  const intro = useAsync(() => api.getPageIntro("about"), []);
  const content = useAsync(() => api.getAboutPageContent(), []);
  const stats = useAsync(() => api.getStats(), []);
  const leadership = useAsync(() => api.getLeadership(), []);
  const visionMission = useAsync(() => api.getVisionMission(), []);
  const ecosystem = useAsync(() => api.getEcosystemPillars(), []);

  const leader = leadership.data?.[0] ?? null;
  // The ecosystem diagram's center box uses VisionMission's own fields; the
  // 3 satellite boxes reuse EcosystemPillar (same content as the homepage),
  // skipping the first entry which represents the 'core' pillar there.
  const satellites = ecosystem.data?.slice(1, 4) ?? [];

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative border-b border-line bg-white py-16 lg:py-24">
        <div className="container-page flex flex-col items-center justify-between gap-12 lg:flex-row">
          <div className="max-w-xl">
            {intro.loading && <LoadingState />}
            {intro.error && <ErrorState message={intro.error} />}
            {intro.data && (
              <>
                <span className="inline-block rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red">
                  {intro.data.eyebrow}
                </span>
                <h1 className="mt-4 leading-tight text-blue-dark">
                  {intro.data.title}
                  {intro.data.title_highlight && <span className="text-red">{intro.data.title_highlight}</span>}
                </h1>
                {intro.data.description && (
                  <p className="mt-4 text-base leading-relaxed text-muted">{intro.data.description}</p>
                )}
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="#story" className="btn-outline">
                Discover Our Story ↓
              </a>
              {content.data?.hero_status_text && (
                <span className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {content.data.hero_status_text}
                </span>
              )}
            </div>
          </div>

          <div className="relative w-full lg:w-[460px]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
              {intro.data?.image ? (
                <img src={intro.data.image} alt="MedEx Biomed" className="h-auto max-h-[320px] w-full object-cover" />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-muted">
                  Team / facility photo goes here
                </div>
              )}
            </div>

            {content.data?.hero_badge_title && (
              <div className="absolute right-4 top-4 rounded-lg bg-white px-4 py-2 shadow-md">
                <p className="text-xs font-semibold text-blue-dark">{content.data.hero_badge_title}</p>
                <div className="mt-1 h-0.5 w-8 bg-red" />
              </div>
            )}

            {content.data?.hero_highlight_value && (
              <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md">
                <span className="text-sm font-bold text-red">{content.data.hero_highlight_value}</span>
                <span className="text-xs text-muted">{content.data.hero_highlight_label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section id="story" className="container-page py-20">
        {content.loading && <LoadingState />}
        {content.error && <ErrorState message={content.error} />}
        {content.data && (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-red">{content.data.story_eyebrow}</span>
              <h2 className="leading-snug text-blue-dark">{content.data.story_title}</h2>
              {content.data.story_paragraph_1 && (
                <p className="text-sm leading-relaxed text-muted sm:text-base">{content.data.story_paragraph_1}</p>
              )}
              {content.data.story_paragraph_2 && (
                <p className="text-sm leading-relaxed text-muted sm:text-base">{content.data.story_paragraph_2}</p>
              )}
              {content.data.story_quote && (
                <blockquote className="border-l-2 border-red pl-4 text-sm italic leading-relaxed text-muted">
                  "{content.data.story_quote}"
                </blockquote>
              )}
              <div className="pt-2">
                <Link to="/services" className="btn-primary">
                  Our Services →
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-md">
              <div className="relative h-72 w-full overflow-hidden bg-surface sm:h-80">
                {content.data.story_image ? (
                  <img src={content.data.story_image} alt={content.data.story_image_badge} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    Headquarters photo goes here
                  </div>
                )}
                {content.data.story_image_badge && (
                  <span className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-dark shadow">
                    {content.data.story_image_badge}
                  </span>
                )}
              </div>
              {(content.data.story_caption_eyebrow || content.data.story_caption_text) && (
                <div className="border-t border-line bg-white p-4">
                  {content.data.story_caption_eyebrow && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-red">
                      {content.data.story_caption_eyebrow}
                    </span>
                  )}
                  {content.data.story_caption_text && (
                    <p className="mt-0.5 text-xs font-bold text-blue-dark">{content.data.story_caption_text}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-20">
          {stats.loading && <LoadingState />}
          {stats.error && <ErrorState message={stats.error} />}
          {stats.data && <StatsBar stats={stats.data} />}
        </div>
      </section>

      {/* 3. Vision */}
      {visionMission.data && (
        <section className="border-t border-line bg-surface/50 py-20">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2">
            {/* Live network status dashboard mock */}
            <div className="rounded-2xl border border-line bg-blue-dark p-6 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-pink-accent">
                  {visionMission.data.network_panel_title}
                </span>
                {visionMission.data.network_panel_status_label && (
                  <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-400">
                    {visionMission.data.network_panel_status_label}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-2.5">
                {visionMission.data.status_rows.map((row) => (
                  <div key={row.id} className="flex items-center justify-between rounded-lg bg-white/5 p-2.5 text-xs">
                    <span className="text-white/80">{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
              {visionMission.data.network_panel_quote && (
                <p className="mt-4 text-xs italic leading-relaxed text-white/70">
                  "{visionMission.data.network_panel_quote}"
                </p>
              )}
              {visionMission.data.network_benchmark_title && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{visionMission.data.network_benchmark_title}</p>
                    {visionMission.data.network_benchmark_subtitle && (
                      <p className="text-xs text-white/60">{visionMission.data.network_benchmark_subtitle}</p>
                    )}
                  </div>
                  {visionMission.data.network_benchmark_tag && (
                    <span className="rounded bg-red/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red">
                      {visionMission.data.network_benchmark_tag}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-red">— Our Vision</span>
              <h2 className="leading-snug text-blue-dark">{visionMission.data.vision_title}</h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base">{visionMission.data.vision_text}</p>

              {visionMission.data.highlights.length > 0 && (
                <div className="space-y-3 pt-2">
                  {visionMission.data.highlights.map((h) => (
                    <div key={h.id} className="flex gap-3 rounded-lg bg-pink-light/60 p-4">
                      <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-red" />
                      <div>
                        <p className="text-sm font-semibold text-blue-dark">{h.title}</p>
                        {h.description && <p className="mt-0.5 text-xs text-muted">{h.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. Mission + Ecosystem diagram */}
      {visionMission.data && (
        <section className="border-t border-line bg-white py-20">
          <div className="container-page grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-red">— Our Mission —</span>
                <h2 className="mt-3 leading-tight text-blue-dark">{visionMission.data.mission_title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{visionMission.data.mission_text}</p>
              </div>

              <div className="space-y-6">
                {visionMission.data.mission_pillars.map((pillar, i) => (
                  <div key={pillar.id} className="flex gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-blue-dark">{pillar.title}</p>
                      {pillar.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">{pillar.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ecosystem diagram */}
            <div className="rounded-2xl border border-line bg-blue-dark p-6 text-white shadow-xl">
              {visionMission.data.ecosystem_eyebrow && (
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-pink-accent">
                  {visionMission.data.ecosystem_eyebrow}
                </span>
              )}
              <h3 className="mt-3 text-lg font-bold">{visionMission.data.ecosystem_title}</h3>
              {visionMission.data.ecosystem_subtitle && (
                <p className="mt-1 text-xs text-white/70">{visionMission.data.ecosystem_subtitle}</p>
              )}

              <div className="mt-5 rounded-xl border border-red/30 bg-red/10 p-4 text-center">
                {visionMission.data.ecosystem_core_label && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-red">
                    {visionMission.data.ecosystem_core_label}
                  </span>
                )}
                <p className="mt-1 text-sm font-bold">{visionMission.data.ecosystem_core_title}</p>
                {visionMission.data.ecosystem_core_subtitle && (
                  <p className="mt-1 text-xs text-white/70">{visionMission.data.ecosystem_core_subtitle}</p>
                )}
              </div>

              {satellites.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {satellites.map((s) => (
                    <div key={s.id} className="rounded-lg bg-white/5 p-3 text-center">
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Icon name={s.icon} className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide">{s.title}</p>
                      {s.bullet_list[0] && <p className="mt-1 text-[10px] text-white/60">{s.bullet_list[0]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {(visionMission.data.ecosystem_footer_badge_1 || visionMission.data.ecosystem_footer_badge_2) && (
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-4 text-[10px] text-white/50">
                  {visionMission.data.ecosystem_footer_badge_1 && <span>{visionMission.data.ecosystem_footer_badge_1}</span>}
                  {visionMission.data.ecosystem_footer_badge_2 && <span>{visionMission.data.ecosystem_footer_badge_2}</span>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. About Director & Founder */}
      {leader && content.data && (
        <section className="border-t border-line bg-surface/50 py-20">
          <div className="container-page">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-red">
                — {content.data.leadership_eyebrow} —
              </span>
              <h2 className="mt-2 text-blue-dark">{content.data.leadership_title}</h2>
            </div>

            <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-md">
                  {leader.photo ? (
                    <img src={leader.photo} alt={leader.name} className="h-80 w-full object-cover" />
                  ) : (
                    <div className="flex h-80 items-center justify-center text-sm text-muted">Photo goes here</div>
                  )}
                  {leader.badge_text && (
                    <span className="absolute left-3 top-3 rounded-md bg-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {leader.badge_text}
                    </span>
                  )}
                  <div className="border-t border-line bg-white p-4">
                    <p className="font-bold text-blue-dark">{leader.name}</p>
                    {leader.title && <p className="text-xs text-muted">{leader.title}</p>}
                  </div>
                </div>

                <dl className="mt-6 space-y-3 text-sm">
                  {leader.role && <InfoRow label="Designation" value={leader.role} />}
                  {leader.prior_leadership && <InfoRow label="Prior Leadership" value={leader.prior_leadership} />}
                  {leader.domain_expertise && <InfoRow label="Domain Expertise" value={leader.domain_expertise} />}
                  {leader.operational_base && <InfoRow label="Operational Base" value={leader.operational_base} />}
                </dl>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-blue-dark">
                  {leader.name}
                  {leader.title && <span className="ml-2 text-base font-normal text-muted">{leader.title}</span>}
                </h3>
                {leader.role && <p className="mt-1 text-sm font-semibold text-red">{leader.role}</p>}

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {leader.bio_paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {leader.quote && (
                  <div className="mt-6 rounded-xl border-l-2 border-red bg-white p-5 shadow-sm">
                    {leader.quote_label && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-red">{leader.quote_label}</p>
                    )}
                    <p className="mt-2 text-sm italic leading-relaxed text-ink">"{leader.quote}"</p>
                    <p className="mt-2 text-xs font-semibold text-muted">— {leader.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Why Choose Us */}
      {content.data && content.data.why_choose_items.length > 0 && (
        <section className="border-t border-line bg-white py-20">
          <div className="container-page text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-red">
              — {content.data.why_choose_eyebrow} —
            </span>
            <h2 className="mt-3 text-blue-dark">
              {content.data.why_choose_title_main}
              <span className="text-red">{content.data.why_choose_title_highlight}</span>
            </h2>
            {content.data.why_choose_description && (
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {content.data.why_choose_description}
              </p>
            )}

            <div className="mt-16 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
              {content.data.why_choose_items.map((item) => (
                <div key={item.id} className="card space-y-3 rounded-xl border border-line bg-surface/40 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-light text-red">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-blue-dark">{item.title}</h3>
                  {item.description && <p className="text-xs leading-relaxed text-muted">{item.description}</p>}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Contact Us →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line pb-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-blue-dark">{value}</dd>
    </div>
  );
}