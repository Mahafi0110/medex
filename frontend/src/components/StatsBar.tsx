import type { CompanyStat } from "@/types";

export default function StatsBar({ stats }: { stats: CompanyStat[] }) {
  if (!stats.length) return null;
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.id} className="rounded-card border border-line bg-surface px-6 py-8 text-center">
          <div className="font-display text-3xl font-extrabold text-red">{s.value}</div>
          <div className="mt-1 text-sm text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
