<template>
  <main class="flex overflow-auto flex-col flex-1 bg-slate-800">
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
    <section class="flex flex-col items-stretch py-0.5 px-2 text-xs text-stone-200">
      <span class="flex-1">{{ dateTime.toLocaleTimeString() }}</span>
      <span class="flex-1">{{ dateTime.toMMDDYYYY() }}</span>
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
  ref,
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
    const dateTime = ref(new Date());
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
    setInterval(() => {
      // Reactivity won't work unless we have a brand new object
      dateTime.value = new Date(dateTime.value.getTime() + 1000);
    }, 1000);

    return {
      route,
      cmpCls,
      dateTime,
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
