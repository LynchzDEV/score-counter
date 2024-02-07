/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkTheme: true,
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  themes: ['dracula', 'cupcake'],
};
