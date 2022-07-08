<template>
  <BaseDialog
    title="Field CheckBox"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldCheckBox
          v-model="value"
          label="Check Box"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script>
import {
  BaseDialog,
  FieldCheckBox,
} from "ui/index";
import { ref } from "vue";

export default {
  name: "FieldCheckboxView",
  components: {
    BaseDialog,
    FieldCheckBox,
  },
  setup() {
    const value = ref(true);
    return {
      value,
    };
  },
};
</script>
