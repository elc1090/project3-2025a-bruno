/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        screens: {
          'md2': '1100px',
        },
      },
    },
    plugins: [],
  }
  