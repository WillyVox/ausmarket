import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1a",
          900: "#0f172a",
          800: "#1a2438",
        },
        charcoal: "#1c1f26",
        brand: {
          blue: "#2563eb",
          green: "#16a34a",
          red: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};

export default config;
