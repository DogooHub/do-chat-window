/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        "dg__screen--1280": {"max": "1280px"}
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

