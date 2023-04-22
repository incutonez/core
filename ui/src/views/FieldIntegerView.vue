<template>
  <BaseDialog
    title="Field Integer"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body space-y-2">
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
          :options="EnumLabelAlign.options"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseDialog, FieldInteger } from "ui/index";
import FieldComboBox from "ui/components/FieldComboBox.vue";
import { EnumLabelAlign } from "ui/statics/Enums";

const isRequired = ref(true);
const value = ref(0);
const minValue = ref(2);
const labelAlign = ref(EnumLabelAlign.Left);
</script>
