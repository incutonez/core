<template>
  <button
    ref="element"
    class="base-button"
    @mousedown="onMouseDownButton"
    @mouseup="onMouseUpButton"
  >
    <slot name="icon">
      <BaseIcon
        v-if="icon"
        :icon="icon"
      />
    </slot>
    {{ text }}
    <slot name="menu" />
  </button>
</template>

<script>
import { ref } from "vue";
import {
  BaseIcon,
} from "ui/index.js";

export default {
  name: "BaseButton",
  components: {
    BaseIcon,
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  setup() {
    const element = ref(null);
    /* When mousedown occurs, we want to ensure that the mouseup event is captured by this button because
     * we want to remove the focus state properly... this is for cases where mousedown is click on button,
     * but the user keeps holding it down and clicks outside of the button.
     * Reference: https://stackoverflow.com/a/71643994/1253609 */
    function onMouseDownButton({ target, pointerId }) {
      target.setPointerCapture(pointerId);
    }
    function onMouseUpButton({ target, pointerId }) {
      target.releasePointerCapture(pointerId);
      element.value.blur();
    }

    return {
      element,
      onMouseUpButton,
      onMouseDownButton,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-button {
  &.default {
    @apply relative bg-blue-200 hover:bg-blue-300 border px-2 border-gray-300 focus:bg-blue-400;
  }

  &.lg {
    @apply h-8;
  }

  &.xl {
    @apply h-12;
  }

  &.rounded {
    @apply rounded-sm;
  }

  &.circular {
    @apply rounded-full;
  }
}
</style>
