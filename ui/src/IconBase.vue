<template>
  <div
    :class="icon"
    class="group relative"
  >
    <TooltipBase :value="tooltip" />
  </div>
</template>

<script>
import TooltipBase from "ui/TooltipBase.vue";

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
};
</script>
