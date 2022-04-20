<template>
  <div
    ref="rootEl"
    class="overlay-container"
  >
    <slot />
  </div>
</template>

<script>
import {
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

export default {
  name: "BaseOverlay",
  setup() {
    const rootEl = ref(null);
    const OverlayManager = inject("OverlayManager");
    onMounted(() => {
      OverlayManager.add(rootEl.value);
    });
    onBeforeUnmount(() => {
      OverlayManager.remove(rootEl.value);
    });
    return {
      rootEl,
    };
  },
};
</script>
