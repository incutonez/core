<template>
  <div class="base-icon">
    <span :class="icon" />
    <div
      v-if="hasInner"
      class="inline-block z-10 pl-1"
    >
      <slot>
        <!-- TODO: This is no longer working after moving to an overlay container -->
        <BaseTooltip :value="tooltip" />
      </slot>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { BaseTooltip } from "ui/index.js";

export default {
  name: "BaseIcon",
  components: {
    BaseTooltip,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    const hasInner = computed(() => !!slots.default || props.tooltip);
    return {
      hasInner,
    };
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
