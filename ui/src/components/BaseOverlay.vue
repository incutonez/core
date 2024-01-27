<template>
  <div ref="rootEl" class="overlay-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { overlayManager } from "ui/globals";

const rootEl = ref<HTMLDivElement>();
onMounted(() => overlayManager.add(rootEl.value));
onBeforeUnmount(() => overlayManager.unmount(rootEl.value));
</script>
