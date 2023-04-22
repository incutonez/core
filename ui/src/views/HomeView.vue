<template>
  <article class="home-view">
    <BaseButton
      class="default w-min"
      text="Show Modal"
      @click="onClickShowModal"
    />
    <DialogConfirm
      v-model="showDialog"
      title="Warning!"
      :title-icon="{ icon: Icon.AlertTriangle }"
    >
      <template #body>
        <div>Hello World!</div>
        <div>Are you sure?</div>
      </template>
      <template #afterCancel>
        <BaseButton
          text="Action"
          class="danger"
        />
      </template>
    </DialogConfirm>
    <BaseButton>
      Hi
      <BaseTooltip :position="EnumTooltipPosition.MiddleBottom">
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
        <div>Hello World!</div>
      </BaseTooltip>
    </BaseButton>
  </article>
</template>

<script setup lang="ts">
import { DialogConfirm, BaseButton, BaseTooltip, Icon } from "ui/index";
import { EnumTooltipPosition } from "ui/statics/Enums";
import { ref } from "vue";

const showDialog = ref(false);

function onClickShowModal() {
  showDialog.value = true;
}
</script>

<style scoped lang="scss">
.home-view {
  @apply p-4;
}
</style>
