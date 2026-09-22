import { useSiteSettings } from "@/context/SiteSettingsContext";

interface Props {
  /** Which buttons to show, and in what order. */
  include?: ("call" | "whatsapp" | "email")[];
  /** "solid" = brand-colored pills (dark CTA banners); "outline" = bordered pills (light backgrounds). */
  variant?: "solid" | "outline";
  className?: string;
}

/**
 * Labeled contact buttons ("Call Now", "WhatsApp", "Email Us") for CTA
 * banners and contact sections. Reads phone/WhatsApp/email from Django
 * Admin (Site Settings) and only renders the buttons for channels that are
 * actually configured.
 */
export default function ContactButtons({
  include = ["call", "whatsapp", "email"],
  variant = "solid",
  className = "",
}: Props) {
  const settings = useSiteSettings();
  if (!settings) return null;

  const base = variant === "solid" ? "btn bg-white/10 text-white hover:bg-white/20" : "btn-outline";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {include.includes("call") && settings.phone && (
        <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className={base}>
          Call Now
        </a>
      )}
      {include.includes("whatsapp") && settings.whatsapp_link && (
        <a
          href={settings.whatsapp_link}
          target="_blank"
          rel="noreferrer"
          className="btn bg-whatsapp text-white hover:brightness-95"
        >
          WhatsApp
        </a>
      )}
      {include.includes("email") && settings.email && (
        <a href={`mailto:${settings.email}`} className={variant === "solid" ? base : "btn-outline"}>
          Email Us
        </a>
      )}
    </div>
  );
}