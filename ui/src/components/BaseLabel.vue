<template>
  <label class="base-label">{{ value }}{{ separator }}</label>
</template>

<script>
export default {
  name: "BaseLabel",
  props: {
    value: {
      type: String,
      required: true,
    },
    separator: {
      type: String,
      default: ":",
    },
  },
};
</script>

<style>
.base-label {
  @apply text-sm font-semibold text-slate-600 uppercase;
}
</style>
