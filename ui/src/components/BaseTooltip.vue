<template>
  <article ref="root" class="tooltip-base" :class="tooltipCls">
    <slot>
      {{ value }}
    </slot>
  </article>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, unref } from "vue";
import { EnumTooltipPosition } from "ui/statics/Enums";

export interface IPropsBaseTooltip {
  value?: string;
  position?: string;
}

const props = withDefaults(defineProps<IPropsBaseTooltip>(), {
  value: "",
  position: EnumTooltipPosition.RightMiddle,
});
const root = ref();
const tooltipCls = ref();

function reposition() {
  const rootEl = unref(root);
  if (!rootEl) {
    return;
  }
  let cls;
  switch (props.position) {
    case EnumTooltipPosition.LeftTop:
      // TODO: Impl
      break;
    case EnumTooltipPosition.LeftMiddle:
      cls = "middle-left left";
      break;
    case EnumTooltipPosition.LeftBottom:
      // TODO: Impl
      break;
    case EnumTooltipPosition.Middle:
      // TODO: Impl
      break;
    case EnumTooltipPosition.MiddleTop:
      cls = "middle-top top";
      break;
    case EnumTooltipPosition.MiddleBottom:
      cls = "middle-bottom bottom";
      break;
    case EnumTooltipPosition.RightTop:
      // TODO: Impl
      break;
    case EnumTooltipPosition.RightBottom:
      // TODO: Impl
      break;
    case EnumTooltipPosition.RightMiddle:
    default:
      cls = "middle-right right";
      break;
  }
  tooltipCls.value = cls;
}

onUpdated(() => reposition());
onMounted(() => {
  reposition();
  root.value?.parentNode.classList.add("cursor-help", "group", "relative");
});
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
