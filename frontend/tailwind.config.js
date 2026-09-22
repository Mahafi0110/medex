/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#C62828", // Primary Red — primary CTA, active states, brand accents
          dark: "#B71C1C", // Dark Crimson — hover/darker CTA states
        },
        pink: {
          accent: "#F6A0AA", // supplementary — legible accent text on dark backgrounds (no brand-doc equivalent given)
          light: "#FFF0F2", // Soft Pink Tint — icon backgrounds, light accent sections
        },
        blue: {
          dark: "#0A192F", // Healthcare Navy — header, footer, hero sections, dark cards
          DEFAULT: "#0D6EFD", // Action Blue — call buttons, links, secondary actions
          light: "#EAF2FE", // light tint of Action Blue, for soft background sections
        },
        whatsapp: "#28A745", // WhatsApp Green — WhatsApp CTA and related status/actions
        ink: "#1F1F1F", // Dark Text/Ink — body text, labels, primary content
        muted: "#5F6368",
        surface: "#F8FAFC", // Background Light — page/section background
        line: "#E2E8F0", // Subtle Border — card borders, dividers, input borders
        charcoal: "#141414",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Poppins'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,25,47,0.04), 0 8px 24px -12px rgba(10,25,47,0.12)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};