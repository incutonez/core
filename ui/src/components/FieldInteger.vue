<template>
  <FieldNumber
    v-bind="$props"
    :step="1"
    :parse-value="parseInteger"
  />
</template>

<script>
import { parseInteger } from "ui";
import { FieldNumber } from "ui/index";

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
