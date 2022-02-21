import { defineRule, configure } from "vee-validate";
import { unref } from "vue";
import { localize } from "@vee-validate/i18n";

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

function getValidity(inputEl) {
  const { validity = {} } = unref(inputEl) || {};
  return validity;
}

defineRule("required", (value, [inputEl]) => {
  return getValidity(inputEl).valueMissing === false;
});

defineRule("minLength", (value, [minLength]) => {
  return value.length >= minLength;
});

defineRule("maxLength", (value, [maxLength]) => {
  return value.length >= maxLength;
});

defineRule("minValue", (value, [inputEl]) => {
  return getValidity(inputEl).rangeUnderflow === false;
});

defineRule("maxValue", (value, [inputEl]) => {
  return getValidity(inputEl).rangeOverflow === false;
});

defineRule("whitespace", (value) => {
  return !WHITESPACE_RE.test(value);
});
