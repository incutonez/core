<template>
  <RouterView v-slot="{ Component }">
    <!-- TODOJEF: This doesn't work... create issue on GH? -->
    <KeepAlive :include="cachedDialogs">
      <main class="flex flex-1 flex-col overflow-auto bg-slate-800">
        <Component
          :is="Component"
          :key="route.fullPath"
          :class="cmpCls"
          @click:close="onClickCloseDialog"
          @click:minimize="onClickMinimizeDialog"
        />
      </main>
    </KeepAlive>
  </RouterView>
  <footer class="box-border flex items-stretch bg-slate-700">
    <BaseButtonMenu
      text="Start"
      class="default"
      list-cls="h-64 overflow-auto"
      :options="ComponentList"
      @click:item="onClickStartItem"
    />
    <section class="mx-2 flex flex-1 space-x-2">
      <BaseButton
        v-for="dialog in activeDialogs"
        :key="dialog.name"
        :text="dialog.name"
        class="border-b-2 border-gray-300 px-2 hover:bg-slate-600"
        :class="dialog.activeCls"
        @click="onClickToggleDialog(dialog)"
      />
    </section>
    <section class="flex flex-col items-stretch py-0.5 px-2 text-xs text-stone-200">
      <span class="flex-1">{{ dateTime.toLocaleTimeString() }}</span>
      <span class="flex-1">{{ dateTime.toMMDDYYYY() }}</span>
    </section>
  </footer>
</template>

<script setup lang="ts">
import {
  RouterView,
  useRoute,
  useRouter,
} from "vue-router";
import {
  BaseButton,
  BaseButtonMenu,
} from "ui/index";
import Route from "ui/statics/Route";
import {
  computed,
  ref,
} from "vue";
import { useDialogManager } from "ui/composables/DialogManager";
import type { IActiveDialog } from "ui/interfaces";
import { EnumProp } from "ui/statics/Enums";
import { Collection } from "ui/classes";

const ComponentList = new Collection({
  [EnumProp.DisplayField]: "name",
  [EnumProp.Data]: Object.keys(Route).filter((key) => key !== "Home").map((route) => {
    return {
      name: route,
      fullPath: Route[route as keyof typeof Route],
    };
  }),
});
const route = useRoute();
const router = useRouter();
const dateTime = ref(new Date());
const cmpCls = computed(() => route.fullPath === Route.Home ? "" : "view-dialog");
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
</script>
