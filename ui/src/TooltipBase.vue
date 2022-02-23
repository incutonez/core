<template>
  <span
    ref="root"
    class="tooltip-base"
    v-html="value"
  />
</template>

<script>
import {
  onMounted,
  ref,
} from "vue";

export default {
  name: "TooltipBase",
  props: {
    value: {
      type: String,
      required: true,
    },
    // TODOJEF: Figure out how to do this
    position: {
      type: String,
      default: "leftMiddle",
    },
  },
  setup() {
    const root = ref(null);
    onMounted(() => {
      root.value.parentNode.classList.add("cursor-help");
    });
    return {
      root,
    };
  },
};
</script>

<style scoped>
.tooltip-base {
  @apply cursor-help hidden group-hover:block absolute border drop-shadow w-32 left-5 -top-2 z-10 bg-white p-2 text-sm text-black font-normal font-sans;
}
</style>
