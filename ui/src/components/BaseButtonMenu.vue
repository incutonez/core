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
          class="bg-slate-100 shadow-top"
          :class="listCls"
          :options="menuOptions"
          :value-field="menuValueField"
          @click:item="onClickMenuItem"
        />
      </BaseOverlay>
    </template>
  </BaseButton>
</template>

<script>
import {
  BaseButton,
  BaseList,
  BaseOverlay,
} from "ui/index.js";
import { ref } from "vue";

export default {
  name: "BaseButtonMenu",
  emits: ["click:item"],
  components: {
    BaseList,
    BaseOverlay,
    BaseButton,
  },
  props: {
    menuOptions: {
      type: Array,
      default: () => [],
    },
    menuValueField: {
      type: String,
      default: "",
    },
    listCls: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const rootEl = ref(null);
    const listEl = ref(null);
    const menuShowing = ref(false);
    function hideMenu() {
      menuShowing.value = false;
    }
    function onClickMenuItem(menuItem) {
      emit("click:item", menuItem);
      hideMenu();
    }
    function onClickDocument({ target }) {
      if (menuShowing.value && !(rootEl.value.$el.contains(target) || listEl.value.$el.contains(target))) {
        hideMenu();
      }
    }
    function onClickButton() {
      listEl.value.$el.style.bottom = `${rootEl.value.$el.clientHeight}px`;
    }

    return {
      rootEl,
      listEl,
      menuShowing,
      onClickButton,
      onClickDocument,
      onClickMenuItem,
    };
  },
};
</script>
