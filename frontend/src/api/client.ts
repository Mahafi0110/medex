import type {
  ProductCategory,
  ProductSummary,
  ProductDetail,
  ProductHighlight,
  ProductSidebarItem,
  Service,
  ServicePageSidebarItem,
  ServicePageDetail,
  AboutSection,
  HomeHero,
  EcosystemPillar,
  OperatingPillar,
  VisionMission,
  TeamMember,
  CompanyStat,
  Paginated,
  ContactPayload,
  SiteSettings,
  PageIntro,
  PageKey,
  AboutPageContent,
  OfficeLocation,
  ContactPageContent,
} from "@/types";

// In dev, Vite proxies /api -> http://127.0.0.1:8000 (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the deployed backend origin.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

// Helper to extract CSRF token from cookies (Django convention)
function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  // If it's a mutation request (POST, PUT, DELETE, etc.), attach the CSRF token
  const method = options?.method?.toUpperCase() || "GET";
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) {
      headers["X-CSRFToken"] = csrftoken;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    // No `credentials: "include"` on purpose: every public endpoint is
    // anonymous (DRF skips CSRF checks for anonymous requests) and the client
    // never relies on cookies. Sending credentials would force the backend to
    // answer with Access-Control-Allow-Credentials and would make the Contact
    // form depend on third-party cookies, which Safari/iOS block by default.
    ...options,
    headers,
  });

  if (res.status === 429) {
    // The backend rate-limits the Contact/Career forms per IP.
    throw new Error("Too many submissions from this device. Please wait a little while and try again.");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status} on ${path}: ${body}`);
  }
  return res.json() as Promise<T>;
}

/** For submissions that include a file (e.g. resume upload) — no Content-Type
 * header, so the browser sets the correct multipart boundary itself. */
async function requestMultipart<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    headers["X-CSRFToken"] = csrftoken;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (res.status === 429) {
    throw new Error("Too many submissions from this device. Please wait a little while and try again.");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status} on ${path}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // ---- Dedicated Products page -------------------------------------------
  getCategories: () => request<Paginated<ProductCategory>>("/categories/"),

  getProducts: (params?: { category?: string; product_type?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category__slug", params.category);
    if (params?.product_type) qs.set("product_type", params.product_type);
    if (params?.search) qs.set("search", params.search);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<Paginated<ProductSummary>>(`/products/${suffix}`);
  },

  getProduct: (slug: string) => request<ProductDetail>(`/products/${slug}/`),

  getProductSidebar: () => request<ProductSidebarItem[]>("/product-sidebar/"),

  // ---- Dedicated Services page --------------------------------------------
  getServices: () => request<Paginated<Service>>("/services/"),
  getService: (slug: string) => request<Service>(`/services/${slug}/`),
  getServicePageSidebar: () => request<ServicePageSidebarItem[]>("/service-page-sidebar/"),
  getServicePage: (slug: string) => request<ServicePageDetail>(`/service-pages/${slug}/`),

  // ---- Homepage-only sections (independent of the dedicated pages) -------
  getHomeHero: () => request<HomeHero>("/home-hero/"),
  getAboutSection: () => request<AboutSection>("/about-section/"),
  getEcosystemPillars: () => request<EcosystemPillar[]>("/ecosystem-pillars/"),
  getOperatingPillars: () => request<OperatingPillar[]>("/operating-pillars/"),
  getProductHighlights: () => request<ProductHighlight[]>("/product-highlights/"),
  getVisionMission: () => request<VisionMission>("/vision-mission/"),
  getLeadership: () => request<TeamMember[]>("/team/?is_leadership=true"),

  // ---- Shared / small content blocks --------------------------------------
  getStats: () => request<CompanyStat[]>("/stats/"),

  // ---- Contact ------------------------------------------------------------
  submitContact: (payload: ContactPayload) =>
    request<ContactPayload & { id: number; created_at: string }>("/contact/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** Used by the Career tab's application form (includes a resume file). */
  submitContactMultipart: (formData: FormData) =>
    requestMultipart<{ id: number; created_at: string }>("/contact/", formData),

  // ---- Site-wide identity, contact info & static-page copy ---------------
  getSiteSettings: () => request<SiteSettings>("/site-settings/"),
  getPageIntro: (page: PageKey) => request<PageIntro>(`/page-intros/${page}/`),
  getAboutPageContent: () => request<AboutPageContent>("/about-page-content/"),
  getOfficeLocations: () => request<OfficeLocation[]>("/office-locations/"),
  getContactPageContent: () => request<ContactPageContent>("/contact-page-content/"),
};