const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
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
        secondaryLightHover: colors.blueGray["300"],
        secondaryDark: colors.blueGray["800"],
        secondaryDarkHover: colors.blueGray["600"],
        textLight: colors.gray["700"],
        textDark: colors.gray["200"],
        secondaryTextDark: colors.gray["400"],
        textLightHover: colors.gray["900"],
        textDarkHover: colors.gray["300"]
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')
  ]
}
