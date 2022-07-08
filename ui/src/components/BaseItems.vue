<template>
  <div class="field-tags-wrapper">
    <span class="item-text">
      <slot />
    </span>
    <BaseIcon
      :icon="Icon.Close"
      class="fields-tags-close-icon"
      @click="onClickRemoveOption"
    />
  </div>
</template>

<script>
import { BaseIcon } from "ui/index";

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
