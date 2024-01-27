<template>
  <BaseField ref="componentEl">
    <template #beforeItems>
      <BaseField
        v-model="color"
        class="field-color"
        input-type="color"
        input-cls="w-5 h-full !p-0 cursor-pointer"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BaseField from "ui/components/BaseField.vue";

const componentEl = ref();
const color = computed({
  get() {
    return componentEl.value?.value;
  },
  set(value) {
    componentEl.value.value = value;
  },
});
</script>

<style scoped lang="scss">
:deep(.field-color .field-text) {
  @apply border-none h-full;
}

.field-color {
  @apply p-0.5 cursor-pointer;
}
</style>
