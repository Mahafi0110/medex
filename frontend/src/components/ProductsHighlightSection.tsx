import type { ProductHighlight } from "@/types";
import SectionHeading from "@/components/SectionHeading";
import Icon from "@/components/Icon";

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

// Maps specific custom links and button text based on product name
function getProductConfig(productName: string) {
  const name = productName.toLowerCase();
  
  if (name.includes("thermacheck") || name.includes("medical ir")) {
    return {
      website: "https://thermacheck.com",
      download: "https://thermacheck.com/demo",
      primaryBtnText: "Explore ThermaCheck IR",
      secondaryBtnText: "Request Demo & Specs",
    };
  }
  if (name.includes("tehomed")) {
    return {
      website: "https://tehomed.com/mobile-app",
      download: "https://tehomed.com/mobile-app",
      primaryBtnText: "Visit Tehomed.com",
      secondaryBtnText: "Download App Here",
    };
  }
  if (name.includes("doctor") || name.includes("console")) {
    return {
      website: "https://avtelemed.com/doctor-console/",
      download: "https://avtelemed.com/doctor-console/",
      primaryBtnText: "Visit Avtelemed.com",
      secondaryBtnText: "Download App Here",
    };
  }
  if (name.includes("patient") || name.includes("avtelemed")) {
    return {
      website: "https://avtelemed.com/patient-app/",
      download: "https://avtelemed.com/patient-app/",
      primaryBtnText: "Visit Avtelemed.com",
      secondaryBtnText: "Download App Here",
    };
  }
  return {
    website: "#",
    download: "#",
    primaryBtnText: "Visit Website",
    secondaryBtnText: "Download App Here",
  };
}

function ProductHighlightCard({ p }: { p: ProductHighlight }) {
  const config = getProductConfig(p.name);
  
  const websiteUrl = p.website_url || config.website;
  const downloadUrl = p.download_url || p.app_store_url || p.play_store_url || config.download;

  return (
    <div className="card flex w-[380px] flex-shrink-0 flex-col justify-between bg-white p-7 sm:w-[420px] lg:w-[450px] rounded-2xl border border-line shadow-sm">
      <div>
        {/* Top Header: Centered Logo/Badge and Centered Titles */}
        <div className="flex flex-col items-center text-center">
          {/* Logo / Badge Frame */}
          <div className="inline-block rounded-lg border border-line bg-white px-3 py-2 shadow-2xs mb-4">
            {p.logo ? (
              <img src={p.logo} alt={`${p.name} logo`} className="h-6 w-auto object-contain" />
            ) : (
              <div className="flex h-6 items-center text-xs font-bold text-red tracking-wider uppercase">
                {p.name.split(" ")[0]}
              </div>
            )}
          </div>

          {/* Centered Title & Tagline */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-red">{p.name}</h3>
            {p.tagline && <p className="mt-1 text-sm font-semibold text-blue-dark">{p.tagline}</p>}
          </div>
        </div>

        {/* Summary Description */}
        {p.summary && <p className="mt-4 text-sm leading-relaxed text-muted text-center">{p.summary}</p>}

        {/* Feature List with Icon Bullets */}
        {p.highlight_feature_list.length > 0 && (
          <ul className="mt-6 space-y-3 text-sm text-blue-dark">
            {p.highlight_feature_list.map((f, index) => {
              const iconNames = ["shield", "clock", "monitor", "wrench", "check"];
              const currentIcon = iconNames[index % iconNames.length];

              return (
                <li key={f} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-light text-red">
                    <Icon name={currentIcon as any} className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{f}</span>
                </li>
              );
            })}
          </ul>
        )}
        
        {p.highlight_link_label && (
          <p className="mt-4 text-xs font-medium italic text-muted text-center">{p.highlight_link_label}</p>
        )}
      </div>

      {/* Action Buttons Container */}
      <div className="mt-8 space-y-3 pt-2">
        <a
          href={websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-dark"
        >
          {config.primaryBtnText} <ExternalArrowIcon />
        </a>
        
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-dark"
        >
          {config.secondaryBtnText} <ExternalArrowIcon />
        </a>
      </div>
    </div>
  );
}

export default function ProductsHighlightSection({ products }: { products: ProductHighlight[] }) {
  if (!products.length) return null;

  return (
    <section className="bg-blue-light/50 py-20 overflow-hidden border-t border-line">
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Products"
          title="Innovative Solutions for a Connected Healthcare Future"
          description="Explore our ecosystem of digital health and equipment solutions designed to make healthcare more accessible, efficient, and reliable."
          align="center"
        />

        {/* Horizontal Scroll Layout */}
        <div className="mt-12 flex items-stretch gap-8 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <div key={p.id} className="snap-start flex flex-shrink-0">
              <ProductHighlightCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}