import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards",
        fadeOut: "fadeOut 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
