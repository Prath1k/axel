/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        text: "var(--text)",
        "brand-muted": "var(--text-muted)",
        card: "var(--card)",
        "brand-separator": "var(--border)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
