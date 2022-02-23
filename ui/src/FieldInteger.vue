<template>
  <FieldNumber
    v-bind="$props"
    :step="1"
    :parse-value="parseInteger"
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
  setup() {
    return {
      parseInteger,
    };
  },
};
</script>
