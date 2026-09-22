import type { OperatingPillar } from "@/types";
import Icon from "@/components/Icon";
import SectionHeading from "@/components/SectionHeading";

export default function OperatingPillarsSection({ pillars }: { pillars: OperatingPillar[] }) {
  if (!pillars.length) return null;
  return (
    <section className="bg-surface py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Reliability First"
          title="Our Operating Pillars"
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.id} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-light text-red">
                <Icon name={p.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-blue-dark">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}