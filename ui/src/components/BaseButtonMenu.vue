<template>
  <BaseButton @click="onClickButton">
    <template #menu>
      <!-- TODO: https://forum.vuejs.org/t/using-teleports-composition/128878 -->
      <Teleport to="#overlayManager">
        <BaseOverlay class="bottom-8">
          <BaseList
            v-show="showMenu"
            class="bg-white shadow-top"
            :options="['blah', 'bleh']"
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
  setup() {
    const showMenu = ref(false);
    function onClickButton() {
      showMenu.value = !showMenu.value;
    }

    return {
      showMenu,
      onClickButton,
    };
  },
};
</script>
