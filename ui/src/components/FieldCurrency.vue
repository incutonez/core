<template>
  <FieldNumber>
    <template #beforeItems>
      <span class="pl-1">$</span>
    </template>
  </FieldNumber>
</template>

<script setup lang="ts">
import { FieldNumber } from "ui/index";
</script>

<style scoped>
:deep(.field-text .field-text-input) {
  @apply pl-0.5 pr-1;
}
</style>
