import { Link } from "react-router-dom";
import type { AboutSection, CompanyStat } from "@/types";
import Icon from "@/components/Icon";

interface Props {
  about: AboutSection;
  stats: CompanyStat[];
}

export default function AboutPreview({ about, stats }: Props) {
  return (
    <section className="container-page py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Image + floating credential badge */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-card border border-line bg-blue-light">
            {about.image ? (
              <img src={about.image} alt={about.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Building / facility photo goes here
              </div>
            )}
          </div>

          {about.badge_title && (
            <div className="card absolute -bottom-6 right-6 flex max-w-[260px] items-center gap-3 bg-white p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pink-light text-red">
                <Icon name={about.badge_icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-dark">{about.badge_title}</p>
                {about.badge_subtitle && (
                  <p className="text-xs text-muted">{about.badge_subtitle}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Text + stat cards */}
        <div>
          <p className="section-eyebrow mb-3">— {about.eyebrow}</p>
          <h2 className="text-3xl font-bold text-blue-dark md:text-4xl">{about.title}</h2>

          <div
            className="mt-5 space-y-4 leading-relaxed text-muted [&_strong]:text-ink [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: [about.paragraph_1, about.paragraph_2].filter(Boolean).join(""),
            }}
          />

          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.id} className="card p-4">
                  {s.icon && (
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-pink-light text-red">
                      <Icon name={s.icon} className="h-4 w-4" />
                    </div>
                  )}
                  <p className="text-xl font-bold text-blue-dark">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <Link to="/about" className="btn-outline mt-8 inline-flex">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}