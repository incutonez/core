<template>
  <BaseDialog
    title="Field Text"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <BaseField
          v-model="value"
          label="First Name"
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
  BaseField,
} from "ui/index";
import {
  reactive,
  toRefs,
} from "vue";

export default {
  name: "BaseFieldView",
  components: {
    BaseDialog,
    BaseField,
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
