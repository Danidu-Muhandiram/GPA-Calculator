/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F88A22',      // main orange for buttons and navbar
        accent: '#FFD580',       // soft yellow for highlights
        background: '#F8F9FB',   // clean white-gray background
        text: '#1E1E1E',         // dark charcoal for main text
        'text-secondary': '#6B7280', // neutral gray for placeholders
      }
    },
  },
  plugins: [],
}
