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
        primary: {
          DEFAULT: "#4F46E5", // indigo-600
          hover: "#4338CA", // indigo-700
          light: "#EEF2FF", // indigo-50
        },
        secondary: {
          DEFAULT: "#86CC00",
          hover: "#669900",
          deepest: "#3D6600",
        },
        danger: {
          DEFAULT: "#EF4444", // red-500
          hover: "#DC2626", // red-600
        },
        success: {
          DEFAULT: "#22C55E", // green-500
        },
        warning: {
          DEFAULT: "#F59E0B", // amber-500
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
