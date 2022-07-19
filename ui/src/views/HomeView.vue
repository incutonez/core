<template>
  <article class="home-view">
    <BaseButton
      class="w-min default"
      text="Show Modal"
      @click="onClickShowModal"
    />
    <DialogConfirm
      v-model="showDialog"
      title="Warning!"
      :title-icon="{icon: Icon.AlertTriangle}"
    >
      <template #body>
        <div>
          Hello World!
        </div>
        <div>
          Are you sure?
        </div>
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
      <BaseTooltip :position="TooltipPosition.MiddleBottom">
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

<script>
import { DialogConfirm, BaseButton, BaseTooltip, TooltipPosition } from "ui/index";
import { ref } from "vue";

export default {
  name: "HomeView",
  components: {
    BaseTooltip,
    DialogConfirm,
    BaseButton,
  },
  setup() {
    const showDialog = ref(false);
    function onClickShowModal() {
      showDialog.value = true;
    }

    return {
      TooltipPosition,
      showDialog,
      onClickShowModal,
    };
  },
};
</script>

<style scoped lang="scss">
.home-view {
  @apply p-4;
}
</style>
