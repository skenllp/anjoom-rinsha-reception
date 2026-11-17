/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sapphire: '#10377D',
        midnight: '#09265C',
        ivory: '#F5F5F2',
        silver: '#B7C9E0',
      },
      fontFamily: {
        script: ['"Pinyon Script"', 'cursive'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        arabic: ['Amiri', 'serif'],
      },
      letterSpacing: { royal: '0.28em' },
    },
  },
  plugins: [],
};
