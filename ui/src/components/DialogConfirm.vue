﻿<template>
  <article
    v-show="isShowing"
    class="dialog-confirm"
  >
    <div class="dialog-overlay" />
    <section class="dialog-container">
      <section class="container-header">
        <slot name="titleIcon">
          <BaseIcon
            v-if="!!titleIcon"
            v-bind="titleIcon"
            class="mr-1"
          />
        </slot>
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <BaseButton
          :icon="Icon.Close"
          class="button-close"
          @click="onClickCloseButton"
        />
      </section>
      <section class="container-body">
        <slot name="body" />
      </section>
      <section class="container-footer">
        <slot name="footer">
          <BaseButton
            class="toolbar"
            text="Cancel"
            @click="onClickCancelButton"
          />
          <slot name="afterCancel" />
        </slot>
      </section>
    </section>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue";
import { BaseButton, BaseIcon, type IBaseIcon } from "ui/index";

export default defineComponent({
  name: "DialogConfirm",
  components: {
    BaseButton,
    BaseIcon,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    titleIcon: {
      type: Object as PropType<IBaseIcon>,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isShowing = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });
    function onClickCloseButton() {
      isShowing.value = false;
    }
    function onClickCancelButton() {
      isShowing.value = false;
    }

    return {
      isShowing,
      onClickCloseButton,
      onClickCancelButton,
    };
  },
});
</script>

<style scoped lang="scss">
.dialog-confirm {
  @apply fixed top-0 w-full h-full z-10 left-0;
}

.dialog-overlay {
  @apply opacity-50 absolute inset-0 bg-black;
}

.dialog-container {
  @apply w-48 bg-white top-1/2 left-1/2 absolute shadow-md;
  min-width: 20rem;
  transform: translate(-50%, -50%);
}

.container-body {
  @apply p-2;
}

.container-footer {
  @apply p-2 flex justify-end bg-slate-300 space-x-2;
}

.container-header {
  @apply flex p-2 bg-slate-700 text-stone-100;
}

.button-close {
  @apply ml-auto;
}
</style>
