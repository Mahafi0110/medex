import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import Icon from "@/components/Icon";
import AboutPreview from "@/components/AboutPreview";
import EcosystemSection from "@/components/EcosystemSection";
import OperatingPillarsSection from "@/components/OperatingPillarsSection";
import ServicesPreview from "@/components/ServicesPreview";
import ProductsHighlightSection from "@/components/ProductsHighlightSection";
import PhilosophyLeadershipSection from "@/components/PhilosophyLeadershipSection";
import ContactCTASection from "@/components/ContactCTASection";
import { LoadingState, ErrorState } from "@/components/AsyncState";

export default function Home() {
  // Each homepage section fetches its own, independent content — none of
  // these reuse the dedicated Products/Services/About/Contact page data
  // structures, per the site's content model.
  const hero = useAsync(() => api.getHomeHero(), []);
  const about = useAsync(() => api.getAboutSection(), []);
  const stats = useAsync(() => api.getStats(), []);
  const ecosystem = useAsync(() => api.getEcosystemPillars(), []);
  const pillars = useAsync(() => api.getOperatingPillars(), []);
  const services = useAsync(() => api.getServices(), []);
  const productHighlights = useAsync(() => api.getProductHighlights(), []);
  const visionMission = useAsync(() => api.getVisionMission(), []);
  const leadership = useAsync(() => api.getLeadership(), []);

  return (
    <>
      {/* 1. Hero — layout/styling fixed here; every piece of text, the
          background photo, buttons, and trust points come from Django Admin. */}
      {hero.loading && <LoadingState label="Loading…" />}
      {hero.error && <div className="container-page py-16"><ErrorState message={hero.error} /></div>}
      {hero.data && (
        <section
          className="relative bg-cover bg-center text-white"
          style={hero.data.background_image ? { backgroundImage: `url(${hero.data.background_image})` } : undefined}
        >
          <div
            className={
              hero.data.background_image
                ? "absolute inset-0 bg-gradient-to-r from-blue-dark/95 via-blue-dark/70 to-blue-dark/20"
                : "absolute inset-0 bg-blue-dark"
            }
          />

          <div className="container-page relative py-24 lg:py-32">
            <div className="max-w-2xl">
              {hero.data.eyebrow && (
                <span className="section-eyebrow rounded-full bg-white/10 px-4 py-1.5 text-pink-accent">
                  {hero.data.eyebrow}
                </span>
              )}
              <h1 className="mt-6 leading-tight text-white">
                {hero.data.title_main}
                {hero.data.title_highlight && (
                  <span className="border-b-2 border-red text-pink-accent">{hero.data.title_highlight}</span>
                )}
              </h1>
              {hero.data.subtitle && (
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80">{hero.data.subtitle}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                {hero.data.primary_button_label && (
                  <Link to={hero.data.primary_button_url || "/services"} className="btn-primary">
                    {hero.data.primary_button_label}
                  </Link>
                )}
                {hero.data.secondary_button_label && (
                  <Link
                    to={hero.data.secondary_button_url || "/contact"}
                    className="btn border border-white/30 text-white hover:bg-white/10"
                  >
                    {hero.data.secondary_button_label}
                  </Link>
                )}
              </div>
            </div>

            {hero.data.trust_points.length > 0 && (
              <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8">
                {hero.data.trust_points.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm font-medium text-white/85">
                    <Icon name={t.icon} className="h-4 w-4 text-red" />
                    {t.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. About preview — layout fixed here, content editable via Django Admin */}
      {about.loading && <LoadingState label="Loading…" />}
      {about.error && <div className="container-page py-16"><ErrorState message={about.error} /></div>}
      {about.data && <AboutPreview about={about.data} stats={stats.data ?? []} />}

      {/* 3. The MedEx Biomed Ecosystem */}
      {ecosystem.data && <EcosystemSection pillars={ecosystem.data} />}

      {/* 4. Our Operating Pillars */}
      {pillars.data && <OperatingPillarsSection pillars={pillars.data} />}

      {/* 5. Our Services (homepage preview — own layout, distinct from /services) */}
      {services.data && <ServicesPreview services={services.data.results} />}

      {/* 6. Our Products (homepage highlight — own layout, distinct from /products) */}
      {productHighlights.data && <ProductsHighlightSection products={productHighlights.data} />}

      {/* 7. Vision & Mission + Our Leadership */}
      {(visionMission.data || leadership.data) && (
        <PhilosophyLeadershipSection
          visionMission={visionMission.data}
          leader={leadership.data?.[0] ?? null}
        />
      )}

      {/* 8. Contact CTA (homepage teaser — own compact form, distinct from /contact) */}
      {services.data && productHighlights.data && (
        <ContactCTASection services={services.data.results} products={productHighlights.data} />
      )}
    </>
  );
}