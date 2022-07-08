<template>
  <BaseField
    input-type="checkbox"
    input-width="w-auto"
    class="checkbox"
    :parse-value="parseValue"
  />
</template>

<script>
import { BaseField } from "ui/index";
import { parseBoolean } from "@incutonez/shared";

export default {
  name: "FieldCheckBox",
  components: {
    BaseField,
  },
  props: {
    parseValue: {
      type: Function,
      default: parseBoolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  :deep(.field-text) {
    @apply items-center flex h-6 w-6 cursor-pointer;
    input {
      @apply appearance-none rounded-sm border h-full w-full cursor-pointer;

      &:checked:after {
        @apply h-full w-full inline-block text-center text-xl leading-5;
        content: '✔';
      }
    }
  }
}
</style>
