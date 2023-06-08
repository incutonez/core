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
          text="Global Err"
          class="danger"
          @click="handleGlobalError"
        />
        <BaseButton
          text="Local Err"
          class="danger"
          @click="handleLocalError"
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
import { globalError } from "ui/globals";

const showDialog = ref(false);

function onClickShowModal() {
	showDialog.value = true;
}

function handleGlobalError() {
	throw new Error("Oops!  An error was thrown!");
}

function handleLocalError() {
	try {
		handleGlobalError();
	}
	catch (ex) {
		globalError.message = "Caught in HomeView and now showing in App";
		globalError.title = "Locally Caught";
	}
}
</script>

<style scoped lang="scss">
.home-view {
  @apply p-4;
}
</style>
