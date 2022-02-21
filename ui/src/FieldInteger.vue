<template>
  <FieldNumber
    v-bind="$props"
    :step="1"
  />
</template>

<script>
import FieldNumber from "ui/FieldNumber.vue";
import { parseInteger } from "shared/utilities.js";

export default {
  name: "FieldInteger",
  components: {
    FieldNumber,
  },
  props: {
    parseValue: {
      type: Function,
      default: parseInteger,
    },
  },
};
</script>
