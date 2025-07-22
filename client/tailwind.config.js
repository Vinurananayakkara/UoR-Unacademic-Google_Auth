/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // make sure this line is included
  ],
  theme: {
    extend: {
      fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    },
  },
  plugins: [],
};
