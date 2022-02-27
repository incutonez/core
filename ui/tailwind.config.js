export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Open Sans"],
    },
  },
  safelist: [{
    pattern: /^space-.*/,
  }, {
    pattern: /^text-.*/,
  }],
};
