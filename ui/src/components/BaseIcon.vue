<template>
  <div class="base-icon">
    <slot>
      <FontAwesomeIcon
        :fixed-width="true"
        :icon="icon"
      />
    </slot>
    <slot name="tooltip" />
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "BaseIcon",
  components: {
    FontAwesomeIcon,
  },
  props: {
    icon: {
      type: Object,
      required: true,
    },
  },
};
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
