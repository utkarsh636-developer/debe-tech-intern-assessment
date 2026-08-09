import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts
 *
 * Extends Tailwind with the custom light-palette colours, animations, shadows,
 * and keyframes used throughout the TutorConnect parent portal.
 * Using named tokens in the config keeps arbitrary-value noise out of JSX.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // ── Custom colour palette ─────────────────────────────────────────────
      colors: {
        // Background layers — light theme
        bg: {
          base: "#f5f6ff",       // very light indigo-tinted white page bg
          surface: "#ffffff",     // pure white card surface
          surface2: "#f0f1ff",   // light indigo inputs / secondary surfaces
          surface3: "#e8e9f8",   // slightly deeper for hover states
        },
        // Brand / accent (indigo)
        brand: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          muted: "#818cf8",
        },
        // Text hierarchy — dark on light
        content: {
          primary: "#1e1b4b",    // deep indigo near-black
          secondary: "#4b5563",  // gray-600
          muted: "#9ca3af",      // gray-400
        },
      },

      // ── Custom font stack (picks up the Next.js Geist CSS variable) ───────
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
      },

      // ── Custom box shadows ────────────────────────────────────────────────
      boxShadow: {
        card: "0 2px 12px rgba(99,102,241,0.08), 0 1px 3px rgba(0,0,0,0.06)",
        modal: "0 16px 48px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.08)",
        "brand-glow": "0 0 16px rgba(99,102,241,0.25)",
        "brand-glow-lg": "0 0 24px rgba(99,102,241,0.35)",
      },

      // ── Custom keyframes ──────────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        popIn: {
          from: { transform: "scale(0)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shakeIn: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
      },

      // ── Named animations that reference the keyframes above ───────────────
      animation: {
        "fade-in": "fadeIn 0.2s ease",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "pop-in": "popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "shake-in": "shakeIn 0.3s ease",
      },
    },
  },
  plugins: [],
};

export default config;
