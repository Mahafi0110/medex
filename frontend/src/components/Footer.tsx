import { Link } from "react-router-dom";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Logo from "@/components/Logo";

interface FooterProps {
  logoUrl?: string | null;
}

function SocialIcons({
  facebook,
  instagram,
  linkedin,
  youtube,
}: {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}) {
  const socials = [
    { href: linkedin || "https://www.linkedin.com/company/medex-biomed-services-private-limited", label: "LinkedIn", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" },
    { href: youtube || "https://www.youtube.com/@AV_telemed", label: "YouTube", icon: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
    { href: facebook || "#", label: "Facebook", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.8l.2-4h-4V7a1 1 0 0 1 1-1h3z" },
    { href: instagram || "https://www.instagram.com/medexbiomed/", label: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  ];

  return (
    <div className="mt-6 flex items-center gap-3">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d={s.icon} />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default function Footer({ logoUrl }: FooterProps) {
  const settings = useSiteSettings();
  const name = settings?.site_name || "MedEx Biomed";

  return (
    <footer className="border-t border-white/10 bg-[#141414] text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div>
          {logoUrl ? (
            <div className="inline-block overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-12 w-auto object-contain rounded-lg" 
              />
            </div>
          ) : (
            <Logo theme="light" className="h-16" />
          )}
          <p className="mt-4 text-xs leading-relaxed text-white/70">
            {settings?.footer_tagline || "Precision biomedical engineering. Connected healthcare. Better tomorrows. Safeguarding critical hospital operations with turnkey maintenance and technology ecosystems."}
          </p>
          <SocialIcons 
            facebook={settings?.facebook_url}
            instagram={settings?.instagram_url || "https://www.instagram.com/medexbiomed/"}
            linkedin={settings?.linkedin_url || "https://www.linkedin.com/company/medex-biomed-services-private-limited"}
            youtube={settings?.youtube_url || "https://www.youtube.com/@AV_telemed"}
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-xs text-white/70">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

       <div>
          <h4 className="text-sm font-semibold tracking-wide text-white">Our Services</h4>
          <ul className="mt-4 space-y-2.5 text-xs text-white/70">
            <li><Link to="/services" className="hover:text-white transition-colors">Preventive Maintenance</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Calibration & Safety</Link></li>
            <li><Link to="/services/training" className="hover:text-white transition-colors">Training</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">AMC & CMC Contracts</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Technical Support</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Our Ecosystem</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-white/70">
              <li><a href="https://tehomed.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Tehomed Spares</a></li>
              <li><a href="https://avtelemed.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">AV Telemed</a></li>
              <li><span className="text-white/70">Hepalpha Diagnostics</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Contact Us</h4>
            <ul className="mt-4 space-y-1.5 text-xs text-white/70">
              <li>{settings?.address || "Chennai | Madurai | Others"}</li>
              <li>{settings?.phone || "+91 (0) 44 46533312"}</li>
              <li>{settings?.email || "support@medexbiomed.com"}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/55">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}