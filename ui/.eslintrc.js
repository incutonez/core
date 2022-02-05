module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
  },
};