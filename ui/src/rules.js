import { defineRule, configure } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import { isEmpty } from "ui";

const WHITESPACE_RE = /^\s+$/;

configure({
  // Generates an English message locale generator
  generateMessage: localize("en", {
    messages: {
      required: "Value is required",
      minLength: "Value is too short",
      maxLength: "Value is too long",
      minValue: "Value is too small",
      maxValue: "Value is too large",
      whitespace: "Value is only whitespaces",
    },
  }),
});

defineRule("required", (value) => {
  return isEmpty(value) === false;
});

defineRule("minLength", (value, [minLength]) => {
  return value.length >= minLength;
});

defineRule("maxLength", (value, [maxLength]) => {
  return value.length <= maxLength;
});

defineRule("minValue", (value, [minValue]) => {
  return isEmpty(value) || value >= minValue;
});

defineRule("maxValue", (value, [maxValue]) => {
  return isEmpty(value) || value <= maxValue;
});

defineRule("whitespace", (value) => {
  return !WHITESPACE_RE.test(value);
});
