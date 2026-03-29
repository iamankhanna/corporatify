import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f8fafc",
        clay: "#94a3b8",
        moss: "#475569",
        accent: "#2563eb",
        cloud: "#f1f5f9"
      },
      boxShadow: {
        card: "0 18px 44px rgba(15, 23, 42, 0.1)"
      }
    }
  },
  plugins: []
};

export default config;
