<template>
  <BaseDialog
    title="Field Number"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldNumber
          v-model="value"
          label="Decimal"
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
  FieldNumber,
} from "ui/index";

export default {
  name: "FieldNumberView",
  components: {
    BaseDialog,
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
