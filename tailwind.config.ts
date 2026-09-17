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
        brand: {
          dark: "#082F38",
          teal: "#0D5C68",
          tealLight: "#147B8B",
          emerald: "#059669",
          emeraldLight: "#10B981",
          cream: "#FAF9F6",
          creamLight: "#FFFDF9",
          orange: "#F97316",
          orangeHover: "#EA580C",
        },
        opp: {
          internship: "#10B981",
          micro: "#2563EB",
          task: "#F97316",
          parttime: "#9333EA",
          fulltime: "#0D9488",
          challenge: "#E11D48",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)",
        cardHover: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
      }
    },
  },
  plugins: [],
};
export default config;
