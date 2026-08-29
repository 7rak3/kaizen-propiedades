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
        background: "var(--background)",
        foreground: "var(--foreground)",
        kaizen: {
          dark: "#0a0f1d",
          navy: "#0f172a",
          slate: "#1e293b",
          muted: "#334155",
          border: "#e2e8f0",
          card: "#ffffff",
          gold: {
            DEFAULT: "#c5a059",
            light: "#dfb76c",
            dark: "#a37f38",
            subtle: "#fbf6ec",
          },
          accent: "#2563eb",
          emerald: "#059669",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
      boxShadow: {
        luxury: "0 20px 40px -15px rgba(10, 15, 29, 0.08)",
        gold: "0 10px 25px -5px rgba(197, 160, 89, 0.25)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #dfb76c 0%, #c5a059 50%, #9e7d37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0f1d 0%, #131b2e 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
