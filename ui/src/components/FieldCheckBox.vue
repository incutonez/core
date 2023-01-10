<template>
  <BaseField
    input-type="checkbox"
    input-width="w-auto"
    class="checkbox"
    :parse-value="parseValue"
  />
</template>

<script setup lang="ts">
import { BaseField } from "ui/index";
import type { TFieldValue } from "ui/interfaces";
import { parseBoolean } from "ui/utilities";

export interface IPropsFieldCheckBox {
  parseValue: (value: TFieldValue) => TFieldValue;
}

withDefaults(defineProps<IPropsFieldCheckBox>(), {
  parseValue: parseBoolean,
});
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
