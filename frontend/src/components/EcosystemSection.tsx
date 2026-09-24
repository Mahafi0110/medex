import type { EcosystemPillar } from "@/types";
import SectionHeading from "@/components/SectionHeading";

export default function EcosystemSection({ pillars }: { pillars: EcosystemPillar[] }) {
  if (!pillars.length) return null;
  return (
    <section className="container-page py-20">
      <SectionHeading
        eyebrow="Our Ecosystem"
        title="The MedEx Biomed Ecosystem"
        description="Integrated solutions for a stronger healthcare tomorrow."
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div key={p.id} className="card flex flex-col gap-4 p-6">
            {p.logo && (
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-light overflow-hidden">
                <img src={p.logo} alt={p.title} className="h-full w-full object-contain p-1.5" />
              </div>
            )}
            <h3 className="text-base font-semibold text-blue-dark">{p.title}</h3>
            <ul className="flex-1 space-y-1.5 text-sm text-muted">
              {p.bullet_list.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-red" />
                  {b}
                </li>
              ))}
            </ul>
            {p.link_label && (
              p.link_url ? (
                <a href={p.link_url} className="text-sm font-semibold text-red hover:underline">
                  {p.link_label} →
                </a>
              ) : (
                <span className="text-sm font-semibold text-red">{p.link_label} →</span>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}