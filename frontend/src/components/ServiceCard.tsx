import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card flex flex-col gap-4 p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-light text-red">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-blue-dark">{service.name}</h3>
      <p className="text-sm leading-relaxed text-muted">{service.summary}</p>
    </div>
  );
}
