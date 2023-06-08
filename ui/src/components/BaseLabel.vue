<template>
  <label class="base-label">{{ value }}{{ separator }}</label>
</template>

<script setup lang="ts">
export interface IPropsBaseLabel {
	value: string;
	separator?: string;
}

withDefaults(defineProps<IPropsBaseLabel>(), {
	separator: ":",
});
</script>

<style>
.base-label {
  @apply text-sm font-semibold text-slate-600 uppercase;
}
</style>
