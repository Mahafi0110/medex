import { useSiteSettings } from "@/context/SiteSettingsContext";

interface Props {
  /** "dark" for light backgrounds (navbar), "light" for dark backgrounds (footer). */
  theme?: "dark" | "light";
  className?: string;
}

/**
 * Renders the site logo from Django Admin once it's loaded. While settings
 * are still loading, this renders a fixed-size blank placeholder instead of
 * the fallback mark — that's what prevents the "flash of one logo replaced
 * by another" effect: nothing swaps out from under the user, it just
 * appears once, already correct.
 */
export default function Logo({ theme = "dark", className = "h-14" }: Props) {
  const settings = useSiteSettings();

  // Still loading — reserve the space, render nothing yet.
  if (settings === null) {
    return <div className={`${className} w-32`} aria-hidden="true" />;
  }

  const name = settings.site_name || "MedEx";

  if (settings.logo) {
    return <img src={settings.logo} alt={name} className={`${className} w-auto object-contain`} />;
  }

  // Fallback text mark — only shown once we know for certain no logo was uploaded.
  const first = name.slice(0, Math.ceil(name.length / 2));
  const rest = name.slice(Math.ceil(name.length / 2));
  const textColor = theme === "light" ? "text-white" : "text-blue-dark";

  return (
    <span className="flex items-center gap-2">
      <span className={`flex ${className} aspect-square items-center justify-center rounded-lg bg-red text-white`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2">
          <path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8V3z" fill="currentColor" />
        </svg>
      </span>
      <span className={`font-display text-2xl font-extrabold ${textColor}`}>
        {first}<span className="text-red">{rest}</span>
      </span>
    </span>
  );
}