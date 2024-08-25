/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_site/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'dmserif': ['"DM Serif Display"', "serif"],
        'ebgaramond': ['EB Garamond', "serif"],
        'geistmono': ['Geist Mono', "monospace"]
      }
    },
  },
  plugins: [],
}

