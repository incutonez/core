import { defineRule, configure } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import { isEmpty } from "ui/utilities";

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

defineRule("required", (value: any) => isEmpty(value) === false);
defineRule("minLength", (value: any, [minLength]: [number]) => value.length >= minLength);
defineRule("maxLength", (value: any, [maxLength]: [number]) => value.length <= maxLength);
defineRule("minValue", (value: any, [minValue]: [number]) => isEmpty(value) || value >= minValue);
defineRule("maxValue", (value: any, [maxValue]: [number]) => isEmpty(value) || value <= maxValue);
defineRule("whitespace", (value: any) => !WHITESPACE_RE.test(value));
