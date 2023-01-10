<template>
  <BaseDialog
    title="Field Number"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldNumber
          v-model="value"
          label="Decimal"
          :min-value="minValue"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BaseDialog,
  FieldNumber,
} from "ui/index";

const value = ref(10.203);
const minValue = ref(2);
</script>
