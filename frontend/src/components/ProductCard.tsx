import { Link } from "react-router-dom";
import type { ProductSummary } from "@/types";

const typeLabel: Record<string, string> = {
  mobile: "Mobile App",
  web: "Web App",
  desktop: "Desktop Software",
  device: "Healthcare Tool",
};

export default function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="flex h-40 items-center justify-center border-b border-line bg-blue-light">
        {product.cover_image ? (
          <img
            src={product.cover_image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-2xl font-extrabold text-blue">
            {product.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-red">
          {typeLabel[product.product_type] ?? product.product_type}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-blue-dark group-hover:text-red">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue">
          View product details
        </span>
      </div>
    </Link>
  );
}
