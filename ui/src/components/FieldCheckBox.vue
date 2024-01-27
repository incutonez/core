<template>
  <BaseField input-type="checkbox" input-width="w-auto" class="checkbox" :parse-value="parseBoolean" />
</template>

<script setup lang="ts">
import { BaseField } from "ui/index";
import { parseBoolean } from "ui/utilities";
</script>

<style lang="scss" scoped>
.checkbox {
  :deep(.field-text) {
    @apply items-center flex h-6 w-6 cursor-pointer;
    input {
      @apply appearance-none rounded-sm border h-full w-full cursor-pointer;

      &:checked:after {
        @apply h-full w-full inline-block text-center text-xl leading-5;
        content: "✔";
      }
    }
  }
}
</style>
