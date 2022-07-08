<template>
  <button
    ref="element"
    class="base-button"
    :class="elementCls"
    @mousedown="onMouseDownButton"
    @mouseup="onMouseUpButton"
  >
    <slot name="icon">
      <BaseIcon
        v-if="icon"
        :icon="icon"
      />
    </slot>
    <slot>
      <span class="base-button-text">{{ text }}</span>
    </slot>
    <slot name="menu" />
  </button>
</template>

<script>
import {
  computed,
  ref,
  watch,
} from "vue";
import {
  BaseIcon,
} from "ui/index";

export default {
  name: "BaseButton",
  emits: ["update:toggled"],
  components: {
    BaseIcon,
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    icon: {
      type: [String, Object],
      default: null,
    },
    toggleable: {
      type: Boolean,
      default: false,
    },
    toggled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const element = ref(null);
    const toggled = ref(props.toggled);
    /* When mousedown occurs, we want to ensure that the mouseup event is captured by this button because
     * we want to remove the focus state properly... this is for cases where mousedown is click on button,
     * but the user keeps holding it down and clicks outside of the button.
     * Reference: https://stackoverflow.com/a/71643994/1253609 */
    function onMouseDownButton({ target, pointerId }) {
      target.setPointerCapture(pointerId);
    }
    function shouldBlur() {
      if (!toggled.value) {
        element.value?.blur();
      }
    }
    function onMouseUpButton({ target, pointerId }) {
      target.releasePointerCapture(pointerId);
      if (props.toggleable) {
        toggled.value = !toggled.value;
        emit("update:toggled", toggled.value);
      }
      shouldBlur();
    }

    /**
     * TODO: Is there a better way of doing this?  I basically shadow the props.toggled value because
     * it's possible we don't bind to that, and if a binding isn't present, then we still have our local value
     */
    watch(toggled, () => shouldBlur());
    watch(() => props.toggled, (current) => toggled.value = current);
    watch(() => props.toggleable, (current) => {
      if (!current) {
        // Reset the toggleState
        toggled.value = false;
      }
    });
    const elementCls = computed(() => {
      const cls = [];
      if (toggled.value) {
        cls.push("toggled");
      }
      return cls;
    });

    return {
      element,
      elementCls,
      onMouseUpButton,
      onMouseDownButton,
    };
  },
};
</script>

<style lang="scss" scoped>

.base-button {
  &.default,
  &.danger,
  &.toolbar {
    @apply relative px-2 py-0.5 shadow-sm;

    .base-button-text {
      @apply flex text-sm uppercase;
    }
  }

  &.default {
    @apply bg-blue-200 hover:bg-blue-300;

    &.toggled,
    &:focus-within {
      @apply bg-blue-400;
    }
  }
  &.toolbar {
    @apply bg-slate-700 hover:bg-slate-800 text-white;

    &.toggled,
    &:focus-within {
      @apply bg-slate-900;
    }
  }
  &.danger {
    @apply bg-red-700 hover:bg-red-800 text-white;

    &.toggled,
    &:focus-within {
      @apply bg-red-900;
    }
  }

  &.lg {
    @apply h-8;

    .base-button-text {
      @apply text-base;
    }
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
