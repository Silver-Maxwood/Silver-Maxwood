import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Silver Maxwood Dairies brand palette
        forest: {
          950: "#0B1F14", // deepest hero green (logo background)
          900: "#0F2A1B",
          800: "#14532D", // forest dark accent / headings
          700: "#1B6B3A",
        },
        pasture: {
          600: "#16A34A", // primary action green
          500: "#22B559",
          100: "#E7F6EC",
          50: "#F3FBF5",
        },
        silver: {
          100: "#F5F6F7",
          200: "#E5E7EB", // cool grey border
          300: "#C9CDD3",
          400: "#9AA1AB",
          600: "#5B6470",
        },
        cream: "#FFFFFF",
        gold: {
          500: "#C9A648", // "Luxury in every drop" ribbon gold
          100: "#F7EFD8",
        },
        alert: {
          amber: "#D97706",
          "amber-bg": "#FEF3C7",
          red: "#DC2626",
          "red-bg": "#FEE2E2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,83,45,0.04), 0 4px 16px rgba(20,83,45,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
