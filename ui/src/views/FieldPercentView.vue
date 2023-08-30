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
          input-width="w-16"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseDialog, FieldPercent } from "ui/index";

const value = ref(22.2);
</script>
