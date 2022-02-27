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
import TooltipBase from "ui/TooltipBase.vue";
import { computed } from "vue";

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
