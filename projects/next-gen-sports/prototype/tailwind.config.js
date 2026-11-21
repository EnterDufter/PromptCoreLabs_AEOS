/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#031B33',
        'royal-blue': '#0D47A1',
        'telemetry-cyan': '#17B3B3',
        'canvas-light': '#FAFAFB',
        'border-subtle': '#D9E3EA',
        'graphite-text': '#263238',
        'success-emerald': '#0E9F6E',
        'warning-amber': '#F59E0B',
        'danger-coral': '#EF4444',
      },
      fontFamily: {
        display: ['Sora', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
