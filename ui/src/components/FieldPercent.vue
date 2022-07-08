<template>
  <FieldNumber>
    <template #afterItems>
      <span class="pr-1">%</span>
    </template>
  </FieldNumber>
</template>

<script>
import { FieldNumber } from "ui/index";

export default {
  name: "FieldPercent",
  components: {
    FieldNumber,
  },
};
</script>

<style scoped>
:deep(.field-text .field-text-input) {
  @apply pl-1 pr-0.5;
}
</style>
