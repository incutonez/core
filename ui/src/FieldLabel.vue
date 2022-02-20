<template>
  <label class="uppercase text-sm text-slate-600 font-semibold">{{ value }}{{ separator }}</label>
</template>

<script>
export default {
  name: "FieldLabel",
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
