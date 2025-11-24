/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5D866C",
        mainbg: "#C2A68C",
        secondarybg: "#E6D8C3",
        headerbg: "#F5F5F0",
      }
    },
  },
  plugins: [],
}

