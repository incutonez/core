<template>
  <div class="inline-block p-1 mt-1 mr-1 h-6 text-xs bg-gray-200 rounded border">
    <slot />
    <IconBase
      :icon="Icons.CLOSE"
      class="inline-block ml-1 hover:text-red-800 cursor-pointer"
      @click="onClickRemoveOption"
    />
  </div>
</template>

<script>
import { Icons } from "ui/index.js";
import IconBase from "ui/IconBase.vue";

export default {
  name: "ItemsBase",
  components: {
    IconBase,
  },
  emits: ["remove:selection"],
  setup(props, { emit }) {
    function onClickRemoveOption(event) {
      emit("remove:selection", event);
    }
    return {
      Icons,
      onClickRemoveOption,
    };
  },
};
</script>
