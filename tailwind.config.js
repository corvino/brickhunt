const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/renderer/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        cyan: colors.cyan,
        fuchsia: colors.fuchsia,
        orange: colors.orange,
        rose: colors.rose,
        sky: colors.sky,
        teal: colors.teal
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
