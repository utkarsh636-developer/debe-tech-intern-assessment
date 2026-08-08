import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts
 *
 * Extends Tailwind with the custom dark-palette colours, animations, shadows,
 * and keyframes used throughout the TutorConnect parent portal.
 * Using named tokens in the config keeps arbitrary-value noise out of JSX.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // ── Custom colour palette ─────────────────────────────────────────────
      colors: {
        // Background layers
        bg: {
          base: "#0a0b14",
          surface: "#12131f",
          surface2: "#1a1b2e",
          surface3: "#21223a",
        },
        // Brand / accent (indigo-ish)
        brand: {
          DEFAULT: "#6366f1",
          hover: "#818cf8",
          muted: "#a5b4fc",
        },
        // Text hierarchy
        content: {
          primary: "#f0f1ff",
          secondary: "#8b8fa8",
          muted: "#555870",
        },
      },

      // ── Custom font stack (picks up the Next.js Geist CSS variable) ───────
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
      },

      // ── Custom box shadows ────────────────────────────────────────────────
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        modal: "0 24px 64px rgba(0,0,0,0.7)",
        "brand-glow": "0 0 16px rgba(99,102,241,0.3)",
        "brand-glow-lg": "0 0 24px rgba(99,102,241,0.3)",
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
