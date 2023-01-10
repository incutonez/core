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

<script setup lang="ts">
import {
  BaseDialog,
  FieldPercent,
} from "ui/index";
import { ref } from "vue";

const value = ref(12.42);
</script>
