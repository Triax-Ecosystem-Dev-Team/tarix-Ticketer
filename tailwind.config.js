/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0095FF',
        'cashback-green': '#00D665',
        'gradient-blue-light': '#40A8FF',
        'gradient-blue-dark': '#1E7BCC',
        'text-dark': '#212121',
        'text-gray': '#757575',
        'border-gray': '#E5E5E5',
        'brand-blue-dark': '#003BB5',
        'brand-blue-light': '#06A8F7',
      },
      fontFamily: {
        'sans': ['DM Sans', 'ui-sans-serif', 'system-ui'],
        'display': ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
