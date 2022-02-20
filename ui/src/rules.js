import { defineRule } from "vee-validate";
import { unref } from "vue";

defineRule("required", (value, [inputEl]) => {
  const { validity = {} } = unref(inputEl) || {};
  if (validity.valueMissing) {
    return "Field is required";
  }
  return true;
});
