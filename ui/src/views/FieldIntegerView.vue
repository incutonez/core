<template>
  <FieldInteger
    v-model="value"
    label="Integer"
    :required="isRequired"
    :min-value="minValue"
  />
</template>

<script>
import {
  reactive,
  toRefs,
} from "vue";
import { FieldInteger } from "ui/index.js";

export default {
  name: "FieldIntegerView",
  components: {
    FieldInteger,
  },
  setup() {
    const state = reactive({
      isRequired: true,
      value: 0,
      minValue: 2,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
