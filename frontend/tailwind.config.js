module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9', // Purple color for primary elements
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.00), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 