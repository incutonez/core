<template>
  <div class="field-tags-wrapper">
    <span class="item-text">
      <slot />
    </span>
    <BaseIcon
      :icon="Icons.CLOSE"
      class="fields-tags-close-icon"
      @click="onClickRemoveOption"
    />
  </div>
</template>

<script>
import { BaseIcon } from "ui/index.js";

export default {
  name: "BaseItems",
  components: {
    BaseIcon,
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
