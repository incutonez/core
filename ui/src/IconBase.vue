<template>
  <div class="relative">
    <span :class="icon" />
    <div
      v-if="hasInner"
      class="inline-block pl-1"
    >
      <slot>
        <TooltipBase :value="tooltip" />
      </slot>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { TooltipBase } from "ui/index.js";

export default {
  name: "IconBase",
  components: {
    TooltipBase,
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
