/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1E3A2F',
        'brand-primary-dark': '#14261F',
        'brand-secondary': '#C9A15A',
        'brand-secondary-dark': '#B08840',
        'brand-neutral': '#1C1F1D',
        'brand-cream': '#F6F1E4',
      },
    },
  },
  plugins: [],
}
