<template>
  <FieldNumber
    v-bind="$props"
    :step="1"
    :parse-value="parseInteger"
  />
</template>

<script>
import { parseInteger } from "@incutonez/shared";
import { FieldNumber } from "ui/index.js";

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
