<template>
  <BaseDialog
    title="Field Currency"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldCurrency
          v-model="value"
          label="Currency"
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
  FieldCurrency,
} from "ui/index";

export default {
  name: "FieldCurrencyView",
  components: {
    BaseDialog,
    FieldCurrency,
  },
  setup() {
    const state = reactive({
      value: 10.203,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
