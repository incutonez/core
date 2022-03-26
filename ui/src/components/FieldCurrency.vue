<template>
  <FieldNumber>
    <template #beforeItems>
      <span class="pl-1">$</span>
    </template>
  </FieldNumber>
</template>

<script>
import { FieldNumber } from "ui/index.js";

export default {
  name: "FieldCurrency",
  components: {
    FieldNumber,
  },
};
</script>

<style scoped>
:deep(.field-text .field-text-input) {
  @apply pl-0.5 pr-1;
}
</style>
