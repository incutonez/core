<template>
  <div class="field-tags-wrapper">
    <span class="item-text">
      <slot />
    </span>
    <IconBase
      :icon="Icons.CLOSE"
      class="fields-tags-close-icon"
      @click="onClickRemoveOption"
    />
  </div>
</template>

<script>
import { IconBase } from "ui/index.js";

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
      onClickRemoveOption,
    };
  },
};
</script>
