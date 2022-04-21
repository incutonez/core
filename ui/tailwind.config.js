export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Open Sans"],
    },
    minWidth: {
      "16": "4rem",
    },
    extend: {
      cursor: {
        cell: "cell",
        copy: "copy",
      },
      boxShadow: {
        top: "0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
    },
  },
  safelist: [{
    pattern: /^space-.*/,
  }, {
    pattern: /^text-.*/,
  }],
};
