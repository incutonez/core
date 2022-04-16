<template>
  <div>
    <span :class="icon" />
    <div
      v-if="hasInner"
      class="inline-block pl-1"
    >
      <slot>
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
