<template>
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
          @click="handleClose"
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
            @click="handleCancel"
          />
          <slot name="afterCancel" />
        </slot>
      </section>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BaseButton, BaseIcon, Icon } from "ui/index";
import type { IPropsBaseIcon } from "ui/interfaces";

export interface IPropsDialogConfirm {
  title?: string;
  titleIcon?: IPropsBaseIcon;
  modelValue?: boolean;
}

const props = withDefaults(defineProps<IPropsDialogConfirm>(), {
  title: undefined,
  titleIcon: undefined,
  modelValue: true,
});
const emit = defineEmits(["update:modelValue"]);
const isShowing = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function handleClose() {
  isShowing.value = false;
}
function handleCancel() {
  isShowing.value = false;
}
</script>

<style scoped lang="scss">
.dialog-confirm {
  @apply fixed top-0 w-full h-full z-10 left-0;
}

.dialog-overlay {
  @apply opacity-50 absolute inset-0 bg-black;
}

.dialog-container {
  // This is so we can center the dialog in the middle of the screen
  @apply w-48 bg-white top-1/2 left-1/2 absolute shadow-md -translate-x-2/4 -translate-y-2/4;
  min-width: 20rem;
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
