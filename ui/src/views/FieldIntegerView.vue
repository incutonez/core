<template>
  <BaseDialog
    title="Field Currency"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldInteger
          v-model="value"
          label="Integer"
          :required="isRequired"
          :min-value="minValue"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script>
import {
  reactive,
  toRefs,
} from "vue";
import {
  BaseDialog,
  FieldInteger,
} from "ui/index.js";

export default {
  name: "FieldIntegerView",
  components: {
    BaseDialog,
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
