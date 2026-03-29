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
        ink: "#111111",
        sand: "#f4efe6",
        clay: "#d7b98d",
        moss: "#4e6b57",
        accent: "#e76f51",
        cloud: "#f9f7f2"
      },
      boxShadow: {
        card: "0 16px 40px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
