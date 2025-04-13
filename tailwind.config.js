/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Code", "sans-serif"],
      },
      colors: {
        darkGray: "#282C33",
        mainPink: "#C778DD",
      },
    },
  },
  plugins: [],
};
