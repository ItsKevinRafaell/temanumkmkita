import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#f5a700",
        "brand-dark": "#242423",
        canvas: "#fcfaf7",
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          400: "#9ca3af",
          500: "#6b7280",
          700: "#374151",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(36,36,35,0.07), 0 4px 16px rgba(36,36,35,0.05)",
        "card-hover": "0 4px 12px rgba(36,36,35,0.10), 0 16px 40px rgba(36,36,35,0.08)",
      },
      backgroundImage: {
        "dot-pattern": "radial-gradient(circle, rgba(36,36,35,0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "24px 24px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite reverse",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(-10px) translateX(-15px)" },
          "75%": { transform: "translateY(-25px) translateX(5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
