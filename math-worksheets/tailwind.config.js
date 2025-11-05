/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#613613',
        'brand-primary-dark': '#4A290E',
        'brand-secondary': '#FFDF5B',
        'brand-secondary-dark': '#EEC847',
        'brand-neutral': '#1F1F1F',
        'brand-cream': '#FFF8E1',
      },
    },
  },
  plugins: [],
}
