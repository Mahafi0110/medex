import { useSiteSettings } from "@/context/SiteSettingsContext";

interface Props {
  /** Tailwind position classes, e.g. "bottom-6 right-6" or "right-6 top-1/2 -translate-y-1/2". */
  position?: string;
  /** "row" for side-by-side, "col" for stacked (one below another). */
  direction?: "row" | "col";
  className?: string;
}

export default function FloatingContactButtons({
  position = "bottom-6 right-6", // Defaults to bottom right
  direction = "col",           // Defaults to stacked (one below another)
  className = "",
}: Props) {
  const settings = useSiteSettings();
  if (!settings?.phone && !settings?.whatsapp_link) return null;

  return (
    <div
      className={`fixed ${position} z-50 hidden ${direction === "row" ? "flex-row" : "flex-col"} gap-4 md:flex ${className}`}
    >
      {settings.phone && (
        <a
          href={`tel:${settings.phone.replace(/\s+/g, "")}`}
          aria-label={`Call ${settings.site_name}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z" />
          </svg>
        </a>
      )}
      {settings.whatsapp_link && (
        <a
          href={settings.whatsapp_link}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.06L2 22l5.2-1.44a9.9 9.9 0 004.84 1.24h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.27-3.42-.71-2.9-1.19-4.77-4.12-4.92-4.32-.14-.2-1.17-1.56-1.17-2.98 0-1.42.74-2.11 1-2.4.27-.29.58-.36.78-.36h.56c.18 0 .43-.07.66.5.24.58.8 2 .87 2.15.07.14.12.31.02.5-.1.2-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.39-.24.65-.14.27.1 1.69.8 1.98.94.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
          </svg>
        </a>
      )}
    </div>
  );
}