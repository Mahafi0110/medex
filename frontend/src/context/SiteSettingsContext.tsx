import { createContext, useContext, ReactNode } from "react";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import type { SiteSettings } from "@/types";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useAsync(() => api.getSiteSettings(), []);
  return (
    <SiteSettingsContext.Provider value={data}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** Returns null until the site settings have loaded. */
export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}