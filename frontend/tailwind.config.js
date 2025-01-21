/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
       'student-dashboard': "url('/src/assets/student-dashboard-bg.jpg')",
      },
    },
  },
  plugins: [],
}