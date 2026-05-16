/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#ffffff',
          100: '#fdfcf0', // Creamy paper
          200: '#f8f5d7', // Slightly aged paper
          300: '#f1ebd1',
        },
        ink: {
          blue: '#2b3481', // Fountain pen blue
          black: '#1a1a1a', // Pencil/Marker black
          pencil: '#4a4a4a',
        },
        marker: {
          yellow: '#fef08a', // Highlighter yellow
          green: '#bbf7d0',  // Highlighter green
          pink: '#fecdd3',   // Highlighter pink
        }
      },
      fontFamily: {
        sans: ['"Patrick Hand"', 'cursive'],
        display: ['"Architects Daughter"', 'cursive'],
        hand: ['"Patrick Hand"', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
