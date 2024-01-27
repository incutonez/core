<template>
  <RouterView v-slot="{ Component }">
    <!-- TODOJEF: This doesn't work... create issue on GH? -->
    <KeepAlive :include="cachedDialogs">
      <main class="flex flex-1 flex-col overflow-auto bg-slate-800">
        <Component :is="Component" :key="route.fullPath" :class="cmpCls" @click:close="onClickCloseDialog" @click:minimize="onClickMinimizeDialog" />
      </main>
    </KeepAlive>
  </RouterView>
  <footer class="box-border flex items-stretch bg-slate-700">
    <BaseButtonMenu text="Start" class="default" list-cls="h-64 overflow-auto" :options="ComponentList" @click:item="onClickStartItem">
      <template #beforeList>
        <section class="bg-slate-100 p-2">Version: {{ PackageJson.version }}</section>
      </template>
    </BaseButtonMenu>
    <section class="mx-2 flex flex-1 space-x-2">
      <BaseButton v-for="dialog in activeDialogs" :key="dialog.name" :text="dialog.name" class="border-b-2 border-gray-300 px-2 hover:bg-slate-600" :class="dialog.activeCls" @click="onClickToggleDialog(dialog)" />
      <IconDelete />
    </section>
    <section class="flex flex-col items-stretch px-2 py-0.5 text-xs text-stone-200">
      <span class="flex-1">{{ dateTime.toLocaleTimeString() }}</span>
      <span class="flex-1">{{ dateTime.toMMDDYYYY() }}</span>
    </section>
  </footer>
  <DialogConfirm v-model="showErrorDialog" :title="globalError.title" :title-icon="{ icon: Icon.AlertTriangle }">
    <template #body>
      <div>{{ globalError.message }}</div>
    </template>
  </DialogConfirm>
</template>

<script setup lang="ts">
import { computed, onErrorCaptured, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import PackageJson from "ui/../package.json";
import { Collection } from "ui/classes";
import DialogConfirm from "ui/components/DialogConfirm.vue";
import IconDelete from "ui/components/IconDelete.vue";
import { useDialogManager } from "ui/composables/DialogManager";
import { globalError } from "ui/globals";
import { BaseButton, BaseButtonMenu, Icon } from "ui/index";
import type { IActiveDialog } from "ui/interfaces";
import { EnumProp } from "ui/statics/Enums";
import Route from "ui/statics/Route";

// TODO: Adding comment to test semantic release
const ComponentList = new Collection({
  [EnumProp.DisplayField]: "name",
  [EnumProp.Data]: Object.keys(Route)
    .filter((key) => key !== "Home")
    .map((route) => {
      return {
        name: route,
        fullPath: Route[route as keyof typeof Route],
      };
    }),
});
const route = useRoute();
const router = useRouter();
const dateTime = ref(new Date());
const showErrorDialog = computed({
  get() {
    return !!globalError.message;
  },
  set() {
    globalError.message = "";
    globalError.title = "Globally Caught";
  },
});
const cmpCls = computed(() => (route.fullPath === Route.Home ? "" : "view-dialog"));
const { cachedDialogs, activeDialogs, removeDialog, toggleDialog } = useDialogManager();
function onClickStartItem(item: any) {
  router.push(item.fullPath);
}
function onClickCloseDialog() {
  removeDialog();
  router.push(Route.Home);
}
function onClickMinimizeDialog() {
  router.push(Route.Home);
}
function onClickToggleDialog(dialog: IActiveDialog) {
  toggleDialog(dialog);
}

setInterval(() => {
  // Reactivity won't work unless we have a brand new object
  dateTime.value = new Date(dateTime.value.getTime() + 1000);
}, 1000);

onErrorCaptured((ex) => {
  globalError.message = ex.toString();
  return false;
});
</script>
