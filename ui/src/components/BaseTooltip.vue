<template>
  <article
    ref="root"
    class="tooltip-base"
    :class="tooltipCls"
  >
    <slot>
      {{ value }}
    </slot>
  </article>
</template>

<script>
import {
  onMounted,
  onUpdated,
  ref,
  unref,
} from "vue";
import { Enum } from "ui";

/**
 * @property {String} RightMiddle
 * @property {String} RightTop
 * @property {String} RightBottom
 * @property {String} Middle
 * @property {String} MiddleTop
 * @property {String} MiddleBottom
 * @property {String} LeftMiddle
 * @property {String} LeftTop
 * @property {String} LeftBottom
 */
export const TooltipPosition = new Enum(["right-middle", "right-top", "right-bottom", "middle", "middle-top", "middle-bottom", "left-middle", "left-top", "left-bottom"], false);

export default {
  name: "BaseTooltip",
  props: {
    value: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: TooltipPosition.RightMiddle,
    },
  },
  setup(props) {
    const root = ref(null);
    const tooltipCls = ref();
    function reposition() {
      const rootEl = unref(root);
      if (!rootEl) {
        return;
      }
      let cls;
      switch (props.position) {
        case TooltipPosition.LeftTop:
          // TODO: Impl
          break;
        case TooltipPosition.LeftMiddle:
          cls = "middle-left left";
          break;
        case TooltipPosition.LeftBottom:
          // TODO: Impl
          break;
        case TooltipPosition.Middle:
          // TODO: Impl
          break;
        case TooltipPosition.MiddleTop:
          cls = "middle-top top";
          break;
        case TooltipPosition.MiddleBottom:
          cls = "middle-bottom bottom";
          break;
        case TooltipPosition.RightTop:
          // TODO: Impl
          break;
        case TooltipPosition.RightBottom:
          // TODO: Impl
          break;
        case TooltipPosition.RightMiddle:
        default:
          cls = "middle-right right";
          break;
      }
      tooltipCls.value = cls;
    }
    onUpdated(() => {
      reposition();
    });
    onMounted(() => {
      reposition();
      root.value.parentNode.classList.add("cursor-help", "group", "relative");
    });
    return {
      root,
      tooltipCls,
    };
  },
};
</script>

<style scoped lang="scss">
.tooltip-base {
  @apply rounded cursor-help invisible group-hover:visible absolute border drop-shadow w-32 z-10 bg-white p-2 text-sm text-black font-normal font-sans;
}
.tooltip-base::after {
  @apply border-white absolute h-0 w-0 content-[''];
}
.tooltip-base.top,
.tooltip-base.bottom {
  &::after {
    border-right: 1rem solid transparent;
    border-left: 1rem solid transparent;
  }
}
.tooltip-base.right,
.tooltip-base.left {
  &::after {
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
}
.middle-bottom {
  @apply left-1/2;
  top: calc(100% + 1rem);
  transform: translate(-50%, 0%);

  &::after {
    @apply left-1/2 -top-4;
    border-bottom-width: 1rem;
    transform: translate(-50%, 0);
  }
}
.middle-top {
  @apply -top-4 left-1/2;
  transform: translate(-50%, -100%);

  &::after {
    @apply left-1/2;
    top: calc(100% - 1rem);
    border-top-width: 1rem;
    transform: translate(-50%, 100%);
  }
}
.middle-right {
  @apply left-full top-1/2;
  transform: translate(1rem, -50%);

  &::after {
    @apply -left-4 top-1/2;
    border-right-width: 1rem;
    transform: translate(0%, -50%);
  }
}
.middle-left {
  @apply -left-4 top-1/2;
  transform: translate(-100%, -50%);

  &::after {
    @apply left-full top-1/2;
    border-left-width: 1rem;
    transform: translate(0%, -50%);
  }
}
</style>
