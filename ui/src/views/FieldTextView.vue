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

<script setup lang="ts">
import {
  BaseDialog,
  BaseField,
} from "ui/index";
import { ref } from "vue";

const isRequired = ref(true);
const minLength = ref(4);
const maxLength = ref(50);
const value = ref("John");

function onChangeValidity() {
  console.info("onChangeValidity");
}
function onChangeDirty() {
  console.info("onChangeDirty");
}
</script>
