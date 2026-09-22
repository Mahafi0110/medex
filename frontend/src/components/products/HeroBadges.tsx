export default function HeroBadges({ badges }: { badges: string[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
      {badges.map((b) => (
        <div
          key={b}
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90"
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red text-white">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M5 12l5 5L19 7" />
            </svg>
          </span>
          {b}
        </div>
      ))}
    </div>
  );
}