/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_site/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'dmserif': ['"DM Serif Display"', "serif"]
      }
    },
  },
  plugins: [],
}

