<template>
  <div
    ref="root"
    class="tooltip-base"
  >
    <slot>
      {{ value }}
    </slot>
  </div>
</template>

<script>
import {
  onMounted,
  onUpdated,
  ref,
  unref,
} from "vue";
import { Enum } from "shared/Enum.js";

/**
 * @property {String} RIGHT_MIDDLE
 * @property {String} RIGHT_TOP
 * @property {String} RIGHT_BOTTOM
 * @property {String} MIDDLE
 * @property {String} MIDDLE_TOP
 * @property {String} MIDDLE_BOTTOM
 * @property {String} LEFT_MIDDLE
 * @property {String} LEFT_TOP
 * @property {String} LEFT_BOTTOM
 */
export const TooltipPositions = new Enum(["right-middle", "right-top", "right-bottom", "middle", "middle-top", "middle-bottom", "left-middle", "left-top", "left-bottom"], false);

export default {
  name: "BaseTooltip",
  props: {
    value: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: TooltipPositions.RIGHT_MIDDLE,
    },
    margin: {
      type: Number,
      default: 4,
    },
  },
  setup(props) {
    const root = ref(null);
    function reposition() {
      const rootEl = unref(root);
      if (!rootEl) {
        return;
      }
      const { style } = rootEl;
      const { height, width } = rootEl.getBoundingClientRect();
      const { height: parentHeight, width: parentWidth } = rootEl.parentNode.getBoundingClientRect();
      // Must unset the previous values
      let top = null;
      let bottom = null;
      let left = null;
      let right = null;
      switch (props.position) {
        case TooltipPositions.LEFT_TOP:
          bottom = `${parentHeight + props.margin}px`;
          right = `${parentWidth + props.margin}px`;
          break;
        case TooltipPositions.LEFT_MIDDLE:
          top = `${-(height / 2 - parentHeight / 2)}px`;
          right = `${parentWidth + props.margin}px`;
          break;
        case TooltipPositions.LEFT_BOTTOM:
          top = `${parentHeight + props.margin}px`;
          right = `${parentWidth + props.margin}px`;
          break;
        case TooltipPositions.MIDDLE:
          top = `${-(height / 2 - parentHeight / 2)}px`;
          right = `${-(width / 2 - parentWidth / 2)}px`;
          break;
        case TooltipPositions.MIDDLE_TOP:
          bottom = `${(parentHeight + props.margin)}px`;
          right = `${-(width / 2 - parentWidth / 2)}px`;
          break;
        case TooltipPositions.MIDDLE_BOTTOM:
          top = `${(parentHeight + props.margin)}px`;
          right = `${-(width / 2 - parentWidth / 2)}px`;
          break;
        case TooltipPositions.RIGHT_TOP:
          bottom = `${parentHeight + props.margin}px`;
          left = `${parentWidth + props.margin}px`;
          break;
        case TooltipPositions.RIGHT_BOTTOM:
          top = `${parentHeight + props.margin}px`;
          left = `${parentWidth + props.margin}px`;
          break;
        case TooltipPositions.RIGHT_MIDDLE:
        default:
          top = `${-(height / 2 - parentHeight / 2)}px`;
          left = `${parentWidth + props.margin}px`;
          break;
      }
      style.top = top;
      style.right = right;
      style.bottom = bottom;
      style.left = left;
    }
    onUpdated(() => {
      reposition();
    });
    onMounted(() => {
      reposition();
      root.value.parentNode.classList.add("cursor-help", "group");
    });
    return {
      root,
    };
  },
};
</script>

<style scoped lang="scss">
.tooltip-base {
  @apply cursor-help invisible group-hover:visible absolute border drop-shadow w-32 z-10 bg-white p-2 text-sm text-black font-normal font-sans;
}
</style>
