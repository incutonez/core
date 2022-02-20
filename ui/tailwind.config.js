export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [{
    pattern: /^space-.*/,
  }, {
    pattern: /^text-.*/,
  }],
};
