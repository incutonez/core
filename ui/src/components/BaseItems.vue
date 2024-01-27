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

<script setup lang="ts">
import { BaseIcon, Icon } from "ui/index";

const emit = defineEmits(["remove:selection"]);

function onClickRemoveOption(event: MouseEvent) {
  emit("remove:selection", event);
}
</script>
