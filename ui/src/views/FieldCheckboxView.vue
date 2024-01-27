<template>
  <BaseDialog
    title="Field CheckBox"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body">
        <FieldCheckBox
          v-model="value"
          label="Check Box"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseDialog, FieldCheckBox } from "ui/index";

const value = ref(true);
</script>
