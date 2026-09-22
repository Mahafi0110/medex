import { Link } from "react-router-dom";
import type { ProductSidebarItem, ProductDetail } from "@/types";

interface Props {
  items: ProductSidebarItem[];
  activeSlug: string;
  /** The currently viewed product — only used to render its optional sidebar note. */
  activeProduct: ProductDetail;
}

export default function ProductSidebar({ items, activeSlug, activeProduct }: Props) {
  return (
    <aside className="card p-5">
      <h2 className="text-lg font-bold text-blue-dark">Our Products</h2>
      <p className="mt-1 text-xs text-muted">
        Explore our digital healthcare solutions for a connected tomorrow.
      </p>

      <div className="mt-5 space-y-2">
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <Link
              key={item.id}
              to={`/products/${item.slug}`}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                active ? "border-blue bg-blue-light" : "border-line hover:border-blue/40"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-red">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="text-xs font-bold">{item.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${active ? "text-blue-dark" : "text-ink"}`}>
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-muted">{item.category.name}</p>
                </div>
              </div>
              <span className={active ? "text-blue" : "text-muted"}>›</span>
            </Link>
          );
        })}
      </div>

      {/* Generic sidebar note — any product can enable this from Django Admin,
          it's not tied to a specific product by name or slug. */}
      {activeProduct.sidebar_note_title && (
        <div className="mt-6 rounded-lg bg-blue-dark p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-pink-accent">
            {activeProduct.sidebar_note_title}
          </p>
          {activeProduct.sidebar_note_text && (
            <p className="mt-2 text-xs leading-relaxed text-white/80">{activeProduct.sidebar_note_text}</p>
          )}
          {(activeProduct.sidebar_note_phone || activeProduct.sidebar_note_email) && (
            <div className="mt-3 border-t border-white/10 pt-3 text-xs">
              {activeProduct.sidebar_note_phone && (
                <p className="font-semibold text-white">{activeProduct.sidebar_note_phone}</p>
              )}
              {activeProduct.sidebar_note_email && (
                <p className="mt-0.5 text-white/70">{activeProduct.sidebar_note_email}</p>
              )}
            </div>
          )}
          {activeProduct.sidebar_note_cta_label && (
            <Link
              to={activeProduct.sidebar_note_cta_url || "/contact"}
              className="mt-4 block rounded-md bg-white/10 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {activeProduct.sidebar_note_cta_label}
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}