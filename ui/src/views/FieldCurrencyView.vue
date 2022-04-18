<template>
  <BaseDialog>
    <template #body>
      <section class="flex-1">
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
  onMounted,
  reactive,
  toRefs,
} from "vue";
import {
  BaseDialog,
  FieldCurrency,
} from "ui/index.js";

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

    onMounted(() => {
      console.log("FieldCurrencyView");
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
