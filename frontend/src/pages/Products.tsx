import { Navigate } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import { LoadingState, ErrorState } from "@/components/AsyncState";

/**
 * /products has no listing UI of its own — the mockup always shows the
 * sidebar + hero + detail experience, even from a bare "Products" nav
 * click. So this route just resolves the first available product and
 * redirects into its real /products/:slug page (same pattern as /services).
 */
export default function Products() {
  const sidebar = useAsync(() => api.getProductSidebar(), []);

  if (sidebar.loading) return <LoadingState label="Loading products…" />;
  if (sidebar.error) {
    return <div className="container-page py-16"><ErrorState message={sidebar.error} /></div>;
  }
  if (sidebar.data && sidebar.data.length > 0) {
    return <Navigate to={`/products/${sidebar.data[0].slug}`} replace />;
  }
  return (
    <div className="container-page py-16">
      <ErrorState message="No products configured yet." />
    </div>
  );
}