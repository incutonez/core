<template>
  <BaseDialog
    title="Field Currency"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldText
          v-model="value"
          label="Name"
          :required="isRequired"
          :min-length="minLength"
          :max-length="maxLength"
          @change:validity="onChangeValidity"
          @change:dirty="onChangeDirty"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script>
import {
  BaseDialog,
  FieldText,
} from "ui/index.js";
import {
  reactive,
  toRefs,
} from "vue";

export default {
  name: "FieldTextView",
  components: {
    BaseDialog,
    FieldText,
  },
  setup() {
    const state = reactive({
      isRequired: true,
      minLength: 4,
      maxLength: 50,
      value: "John",
    });
    function onChangeValidity() {
      console.log("onChangeValidity");
    }
    function onChangeDirty() {
      console.log("onChangeDirty");
    }

    return {
      ...toRefs(state),
      onChangeValidity,
      onChangeDirty,
    };
  },
};
</script>
