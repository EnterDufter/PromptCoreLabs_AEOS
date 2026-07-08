/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          paper: "#f4f7f6",
          panel: "#ffffff",
          ink: "#172126",
          muted: "#5f6f73",
          line: "#cdd9dc",
          petrol: "#0f4c5c",
          cyan: "#1aa6b7",
          graphite: "#263238"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        technical: "0 24px 70px rgba(15, 76, 92, 0.10)"
      }
    }
  },
  plugins: []
};
