<template>
  <BaseDialog
    title="Field Percent"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldPercent
          v-model="value"
          label="Percent"
          input-width="w-14"
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
  FieldPercent,
} from "ui/index.js";

export default {
  name: "FieldPercentView",
  components: {
    BaseDialog,
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
