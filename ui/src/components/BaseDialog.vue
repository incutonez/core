﻿<template>
  <BaseOverlay>
    <div class="base-dialog">
      <header class="base-dialog-header">
        <slot name="title">
          <span class="base-dialog-header-title">{{ title }}</span>
        </slot>
        <div class="base-dialog-header-toolbar">
          <slot name="toolbar" />
          <BaseIcon
            v-if="minimizable"
            :icon="Icon.Minus"
            class="base-dialog-minimize-icon toolbar"
            @click="onClickMinimize"
          />
          <BaseIcon
            v-show="showMaximized"
            :icon="Icon.Maximize"
            class="base-dialog-maximize-icon toolbar"
            @click="onClickMaximize"
          />
          <BaseIcon
            v-show="showRestoreDown"
            :icon="Icon.Restore"
            class="base-dialog-maximize-icon toolbar"
            @click="onClickRestoreDown"
          />
          <BaseIcon
            :icon="Icon.Close"
            class="base-dialog-close-icon toolbar"
            @click="onClickClose"
          />
        </div>
      </header>
      <slot name="body" />
      <slot name="footer" />
    </div>
  </BaseOverlay>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BaseIcon, BaseOverlay, Icon } from "ui/index";

export interface IPropsBaseDialog {
  open?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<IPropsBaseDialog>(), {
  open: true,
  minimizable: true,
  maximizable: true,
  title: "",
});
const emit = defineEmits(["update:open", "click:close", "click:minimize", "click:maximize", "click:restore"]);
const opened = ref(props.open);
const maximized = ref(true);
const showRestoreDown = computed(() => props.maximizable && maximized.value);
const showMaximized = computed(() => props.maximizable && !maximized.value);

function hide() {
  opened.value = false;
}
function onClickClose() {
  emit("click:close");
}
function onClickMinimize() {
  hide();
  maximized.value = false;
  emit("click:minimize");
}
function onClickMaximize() {
  maximized.value = true;
  emit("click:maximize");
}
function onClickRestoreDown() {
  maximized.value = false;
  emit("click:restore");
}

watch(opened, (value) => emit("update:open", value));
watch(
  () => props.open,
  (value) => (opened.value = value),
);
</script>

<style lang="scss" scoped>
.base-dialog {
  @apply flex flex-col h-full w-full;
}

.header-blue {
  .base-dialog-header {
    @apply bg-slate-700 text-stone-100;
  }

  .toolbar {
    @apply hover:text-stone-300;
  }
}

.base-dialog-header {
  @apply flex py-1 px-2;
}

.base-dialog-header-title {
  @apply flex-1;
}

.base-dialog-header-toolbar {
  @apply space-x-2;
}
</style>
