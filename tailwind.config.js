const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
    },
    screens: {
      'bp360': '360px',
      'bp520': '520px',
      ...defaultTheme.screens,
    }
  },
  plugins: [],
}
