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
          required
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseDialog, FieldCurrency } from "ui/index";

const value = ref(10.203);
</script>
