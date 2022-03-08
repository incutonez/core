export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Open Sans"],
    },
    minWidth: {
      "16": "4rem",
    },
  },
  safelist: [{
    pattern: /^space-.*/,
  }, {
    pattern: /^text-.*/,
  }],
};
