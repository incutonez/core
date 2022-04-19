<template>
  <main class="flex overflow-auto flex-col flex-1 bg-slate-800">
    <Teleport to="#overlayManager">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="cachedDialogs">
          <Component
            :is="Component"
            :key="route.fullPath"
            :class="cmpCls"
            @click:close="onClickCloseDialog"
            @click:minimize="onClickMinimizeDialog"
          />
        </KeepAlive>
      </RouterView>
    </Teleport>
  </main>
  <footer class="box-border flex items-stretch bg-slate-700">
    <BaseButtonMenu
      text="Start"
      class="default"
      list-cls="h-64 overflow-auto"
      :menu-options="ComponentList"
      menu-value-field="name"
      @click:item="onClickStartItem"
    />
    <section class="flex flex-1 mx-2 space-x-2">
      <BaseButton
        v-for="dialog in activeDialogs"
        :key="dialog.name"
        :text="dialog.name"
        class="px-2 hover:bg-slate-600 border-b-2 border-gray-300"
        :class="dialog.activeCls"
        @click="onClickToggleDialog(dialog)"
      />
    </section>
    <section class="flex flex-col items-stretch text-sm">
      <span class="flex-1">Time</span>
      <span class="flex-1">Date</span>
    </section>
  </footer>
</template>

<script>
import {
  RouterView,
  useRoute,
  useRouter,
} from "vue-router";
import {
  BaseButton,
  BaseButtonMenu,
} from "ui/index.js";
import Route from "ui/statics/Route.js";
import {
  computed,
} from "vue";
import { useDialogManager } from "ui/composables/DialogManager.js";

const ComponentList = Object.keys(Route).filter((key) => key !== "Home").map((route) => {
  return {
    name: route,
    fullPath: Route[route],
  };
});
export default {
  name: "App",
  components: {
    BaseButton,
    BaseButtonMenu,
    RouterView,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const cmpCls = computed(() => route.fullPath === Route.Home ? "" : "view-dialog");
    const { cachedDialogs, activeDialogs, removeDialog, toggleDialog } = useDialogManager();
    function onClickStartItem(item) {
      router.push(item.fullPath);
    }
    function onClickCloseDialog() {
      removeDialog();
      router.push(Route.Home);
    }
    function onClickMinimizeDialog() {
      router.push(Route.Home);
    }
    function onClickToggleDialog(dialog) {
      toggleDialog(dialog);
    }

    return {
      route,
      cmpCls,
      activeDialogs,
      cachedDialogs,
      ComponentList,
      onClickToggleDialog,
      onClickStartItem,
      onClickCloseDialog,
      onClickMinimizeDialog,
    };
  },
};
</script>

<style>
.view-dialog {
  @apply top-0 w-5/6 h-fit bg-white w-full shadow;
  height: calc(100% - 2.5rem);
}
</style>
