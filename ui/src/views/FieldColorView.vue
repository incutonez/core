<template>
  <BaseDialog title="Field Color" class="header-blue">
    <template #body>
      <section class="base-dialog-body">
        <FieldColor v-model="value" :required="isRequired" @change:validity="onChangeValidity" @change:dirty="onChangeDirty" />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FieldColor from "ui/components/FieldColor.vue";
import { BaseDialog } from "ui/index";

const isRequired = ref(true);
const value = ref("#867530");

function onChangeValidity() {
  console.info("onChangeValidity");
}
function onChangeDirty() {
  console.info("onChangeDirty");
}
</script>
