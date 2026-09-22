import { Outlet } from "react-router-dom";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContactButtons from "./FloatingContactButtons";

export default function Layout() {
  const settings = useAsync(() => api.getSiteSettings(), []);
  const logoUrl = settings.data?.logo;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar logoUrl={logoUrl} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer logoUrl={logoUrl} />

      {/* Site-wide floating Call/WhatsApp buttons — the component is
          `fixed`, so it stays pinned to the bottom-right of the viewport
          in the same spot on every route. */}
      <FloatingContactButtons position="bottom-6 right-6" direction="col" />
    </div>
  );
}