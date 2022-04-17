<template>
  <BaseButton
    ref="rootEl"
    v-model:toggled="menuShowing"
    v-click-document="onClickDocument"
    :toggleable="true"
  >
    <template #menu>
      <!-- TODO: https://forum.vuejs.org/t/using-teleports-composition/128878 -->
      <Teleport to="#overlayManager">
        <BaseOverlay class="bottom-8 w-48">
          <BaseList
            v-show="menuShowing"
            ref="listEl"
            class="bg-white shadow-top"
            :class="listCls"
            :options="menuOptions"
            :value-field="menuValueField"
            @click:item="onClickMenuItem"
          />
        </BaseOverlay>
      </Teleport>
    </template>
  </BaseButton>
</template>

<script>
import { BaseButton } from "ui/index.js";
import { ref } from "vue";
import BaseOverlay from "ui/components/BaseOverlay.vue";
import BaseList from "ui/components/BaseList.vue";

export default {
  name: "BaseButtonMenu",
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
  setup() {
    const rootEl = ref(null);
    const listEl = ref(null);
    const menuShowing = ref(false);
    function hideMenu() {
      menuShowing.value = false;
    }
    function onClickMenuItem(menuItem) {
      // TODO: Load route here
      hideMenu();
    }
    function onClickDocument({ target }) {
      if (menuShowing.value && !(rootEl.value.$el.contains(target) || listEl.value.$el.contains(target))) {
        hideMenu();
      }
    }

    return {
      rootEl,
      listEl,
      menuShowing,
      onClickDocument,
      onClickMenuItem,
    };
  },
};
</script>
