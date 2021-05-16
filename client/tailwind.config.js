const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        blueGray : colors.blueGray,
        primaryLight: colors.blueGray["200"],
        primaryLightHover: colors.blueGray["300"],
        primaryDark: colors.blueGray["900"],
        primaryDarkHover: colors.blueGray["800"],
        secondaryLight: colors.blueGray["300"],
        secondaryDark: colors.blueGray["800"],
        textLight: colors.gray["700"],
        textDark: colors.gray["200"]
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ]
}
