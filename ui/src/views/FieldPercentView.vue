<template>
  <FieldPercent
    v-model="value"
    label="Percent"
    input-width="w-14"
  />
</template>

<script>
import {
  reactive,
  toRefs,
} from "vue";
import { FieldPercent } from "ui/index.js";

export default {
  name: "FieldPercentView",
  components: {
    FieldPercent,
  },
  setup() {
    const state = reactive({
      value: 12.42,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
