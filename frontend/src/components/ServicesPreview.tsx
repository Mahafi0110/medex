import type { Service } from "@/types";
import Icon from "@/components/Icon";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";

export default function ServicesPreview({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <section className="container-page py-20">
      <SectionHeading
        eyebrow="Our Services"
        title="Our Services"
        description="Comprehensive biomedical support for uninterrupted care."
        align="center"
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {services.map((s) => (
          <div key={s.id} className="card p-5 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-pink-light text-red">
              <Icon name={s.icon} className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-blue-dark">{s.name}</h3>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-blue-dark">
            Need specialized multi-vendor biomedical engineering?
          </p>
          <p className="mt-1 text-sm text-muted">
            We service patient monitors, anaesthesia workstations, ventilators, defibs, and surgical units.
          </p>
        </div>
        <Link to="/contact" className="btn-primary whitespace-nowrap">
          Schedule Field Service
        </Link>
      </div>
    </section>
  );
}