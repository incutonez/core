<template>
  <div class="overlay-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BaseOverlay",
};
</script>

<style scoped>
.overlay-container {
  @apply absolute;
}
</style>
