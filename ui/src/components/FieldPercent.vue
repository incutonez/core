<template>
  <FieldNumber>
    <template #afterItems>
      <span class="pr-1">%</span>
    </template>
  </FieldNumber>
</template>

<script setup lang="ts">
import { FieldNumber } from "ui/index";
</script>

<style scoped>
:deep(.field-text .field-text-input) {
  @apply pl-1 pr-0.5;
}
</style>
