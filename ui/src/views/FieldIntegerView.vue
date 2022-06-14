<template>
  <BaseDialog
    title="Field Integer"
    class="header-blue"
  >
    <template #body>
      <section class="space-y-2 base-dialog-body">
        <FieldInteger
          v-model="value"
          label="Integer"
          :label-align="labelAlign"
          :required="isRequired"
          :min-value="minValue"
        />
        <FieldComboBox
          v-model="labelAlign"
          label="Label Align"
          :options="options"
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
  FieldLabelAlign,
} from "ui/index.js";
import FieldComboBox from "ui/components/FieldComboBox.vue";

export default {
  name: "FieldIntegerView",
  components: {
    FieldComboBox,
    BaseDialog,
    FieldInteger,
  },
  setup() {
    const state = reactive({
      isRequired: true,
      value: 0,
      minValue: 2,
      labelAlign: FieldLabelAlign.Left,
    });

    return {
      options: FieldLabelAlign.options,
      ...toRefs(state),
    };
  },
};
</script>
