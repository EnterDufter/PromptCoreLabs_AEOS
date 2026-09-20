import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0c1324",
        "surface-dim": "#0c1324",
        "surface-bright": "#33394c",
        "surface-container-lowest": "#070d1f",
        "surface-container-low": "#151b2d",
        "surface-container": "#191f31",
        "surface-container-high": "#23293c",
        "surface-container-highest": "#2e3447",
        "surface-navy": "#020617",
        "surface-panel": "#0F172A",
        "vibrant-cyan": "#22D3EE",
        primary: "#22D3EE",
        "primary-container": "#22D3EE",
        "on-primary": "#00363e",
        secondary: "#FB923C",
        "secondary-container": "#D34000",
        tertiary: "#4ADE80",
        "tertiary-container": "#5CD6A7",
        "blueprint-gray": "#94A3B8",
        "text-high-contrast": "#F8FAFC",
        "on-surface": "#DCE1FB",
        "on-surface-variant": "#BBC9CD",
        line: "#1e293b",
        outline: "#859397",
        "outline-variant": "#3c494c",
        panel: "#0F172A",
        navy: "#020617",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        body: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "cyan-glow": "0 0 15px rgba(34, 211, 238, 0.25), inset 0 0 2px rgba(34, 211, 238, 0.4)",
        "cyan-glow-lg": "0 0 25px rgba(34, 211, 238, 0.4), inset 0 0 4px rgba(34, 211, 238, 0.6)",
        "orange-glow": "0 0 20px rgba(251, 146, 60, 0.25)",
        "green-glow": "0 0 15px rgba(74, 222, 128, 0.3)",
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
      },
    },
  },
  plugins: [],
};

export default config;
