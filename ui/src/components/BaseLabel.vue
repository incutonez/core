<template>
  <label class="text-sm font-semibold text-slate-600 uppercase">{{ value }}{{ separator }}</label>
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
