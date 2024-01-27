<template>
  <div class="base-icon">
    <slot>
      <FontAwesomeIcon :fixed-width="true" :icon="icon" />
    </slot>
    <slot name="tooltip" />
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export interface IPropsBaseIcon {
  icon: Object | string;
}

defineProps<IPropsBaseIcon>();
</script>

<style scoped>
.base-icon {
  @apply inline-block;
}
.toolbar {
  @apply cursor-pointer;
}
.blue {
  @apply hover:text-blue-400 text-blue-800;
}
</style>
