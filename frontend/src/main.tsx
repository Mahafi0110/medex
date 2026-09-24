import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ScrollToTop from "@/components/ScrollToTop"; // Import your ScrollToTop component
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Placed here so it globally listens to all navigation events */}
      <ScrollToTop />
      
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);