/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        medieval: ["MedievalSharp"],
      },
      colors: {
        'game-primary': '#2C3E50',
        'game-secondary': '#E74C3C',
        'game-accent': '#F1C40F',
        'board-light': '#ECF0F1',
        'board-dark': '#BDC3C7',
        'player-1': '#3498DB',
        'player-2': '#2ECC71',
        'player-3': '#E67E22',
        'player-4': '#9B59B6',
      }
    },
  },
  plugins: [],
};
