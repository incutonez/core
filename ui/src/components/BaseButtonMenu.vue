<template>
  <BaseButton
    ref="rootEl"
    v-model:toggled="menuShowing"
    v-mousedown-document="onClickDocument"
    :toggleable="true"
    @click="onClickButton"
  >
    <template #menu>
      <!-- TODO: https://forum.vuejs.org/t/using-teleports-composition/128878 -->
      <BaseOverlay
        v-show="menuShowing"
        ref="listEl"
        class="z-10 w-48"
      >
        <BaseList
          class="shadow-top bg-slate-100"
          :class="listCls"
          :options="options"
          @click:item="onClickMenuItem"
        />
      </BaseOverlay>
    </template>
  </BaseButton>
</template>

<script setup lang="ts">
import {
  BaseButton,
  BaseList,
  BaseOverlay,
} from "ui/index";
import { ref } from "vue";

export interface IPropsBaseButtonMenu {
  options?: any | any[];
  listCls?: string;
}

withDefaults(defineProps<IPropsBaseButtonMenu>(), {
  options: () => [],
  listCls: undefined,
});
const emit = defineEmits(["click:item"]);

const rootEl = ref<InstanceType<BaseButton>>();
const listEl = ref<InstanceType<BaseOverlay>>();
const menuShowing = ref(false);
function hideMenu() {
  menuShowing.value = false;
}
function onClickMenuItem(menuItem: any) {
  emit("click:item", menuItem);
  hideMenu();
}
function onClickDocument({ target }: MouseEvent) {
  if (menuShowing.value && !(rootEl.value?.$el.contains(target) || listEl.value.$el.contains(target))) {
    hideMenu();
  }
}
function onClickButton() {
  listEl.value.$el.style.bottom = `${rootEl.value.$el.clientHeight}px`;
}
</script>
