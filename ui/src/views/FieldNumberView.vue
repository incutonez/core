<template>
  <FieldNumber
    v-model="value"
    label="Decimal"
    :min-value="minValue"
  />
</template>

<script>
import {
  reactive,
  toRefs,
} from "vue";
import { FieldNumber } from "ui/index.js";

export default {
  name: "FieldNumberView",
  components: {
    FieldNumber,
  },
  setup() {
    const state = reactive({
      isRequired: true,
      value: 10.203,
      minValue: 2,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
