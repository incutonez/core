<template>
  <Teleport to="#overlayManager">
    <div
      v-show="show"
      class="overlay-container"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "BaseOverlay",
  inheritAttrs: false,
  props: {
    /**
     * We need this because Teleport is a template component, and we can't apply directives to non-root
     * elements, so we have to basically implement our own version of it
     */
    show: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.overlay-container {
  @apply absolute pointer-events-auto;
}
</style>
