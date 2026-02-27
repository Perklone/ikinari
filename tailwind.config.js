/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_site/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'silver': '#c0c5ce',
        'red-accent': '#b83a3a',
        'dark-gray': '#2d3142',
      },
      fontFamily: {
        'dmserif': ['"DM Serif Display"', "serif"],
        'ebgaramond': ['EB Garamond', "serif"],
        'geistmono': ['Geist Mono', "monospace"],
        'dmsans': ['DM Sans', "serif"]
      }
    },
  },
  plugins: [],
}

