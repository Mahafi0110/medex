import type { IconKey } from "@/types";

const paths: Record<Exclude<IconKey, "">, string> = {
  shield: "M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z",
  clock: "M12 8v4l3 2 M12 21a9 9 0 100-18 9 9 0 000 18z",
  monitor: "M4 5h16v10H4z M9 19h6 M12 15v4",
  building: "M5 21V7l7-4 7 4v14 M9 21v-6h6v6 M9 10h.01 M12 10h.01 M15 10h.01",
  check: "M5 12l5 5L19 7",
  wrench: "M14.7 6.3a4 4 0 10-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.83 2.83-2.12-2.12L14.7 6.3z",
  video: "M4 6h11v12H4z M15 10l5-3v10l-5-3",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M20 20H4",
  package: "M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8",
  link: "M9 15l6-6 M8 12l-2 2a3 3 0 004 4l2-2 M16 12l2-2a3 3 0 00-4-4l-2 2",
  file: "M6 3h8l4 4v14H6z M14 3v4h4 M9 13h6 M9 17h6",
  bolt: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
  eye: "M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z M12 15a3 3 0 100-6 3 3 0 000 6z",
  headset: "M3 11v3a4 4 0 004 4h1v-8H7a4 4 0 00-4 4z M21 11v3a4 4 0 01-4 4h-1v-8h1a4 4 0 014 4z M18 18v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  flask: "M9 3h6 M10 3v7l-4 8a1 1 0 001 1h10a1 1 0 001-1l-4-8V3 M6 14h12",
  calendar: "M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M3 10h18",
};

export default function Icon({ name, className = "h-6 w-6" }: { name: IconKey; className?: string }) {
  if (!name || !(name in paths)) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}