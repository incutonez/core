<template>
  <main class="flex overflow-auto flex-col flex-1 bg-slate-800">
    <Teleport to="#overlayManager">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="cachedDialogs">
          <Component
            :is="Component"
            :key="route.fullPath"
            :class="cmpCls"
            @vnode-mounted="onMountedDialog(Component)"
            @click:close="onClickCloseDialog(Component)"
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
        :class="getActiveCls(dialog)"
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
  reactive,
} from "vue";

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
    const activeDialogs = reactive([]);
    const route = useRoute();
    const router = useRouter();
    const cmpCls = computed(() => route.fullPath === Route.Home ? "" : "view-dialog");
    const cachedDialogs = computed(() => activeDialogs.map(({ name }) => name));
    function onClickStartItem(item) {
      router.push(item.fullPath);
    }
    function onClickCloseDialog(cmp) {
      const { name } = cmp.type;
      delete activeDialogs.remove((dialog) => dialog.name === name);
      router.push(Route.Home);
    }
    function onClickMinimizeDialog() {
      router.push(Route.Home);
    }
    function onMountedDialog(cmp) {
      const { fullPath } = route;
      if (fullPath === Route.Home) {
        return;
      }
      const { name } = cmp.type;
      const dialog = activeDialogs.find((dialog) => dialog.name === name);
      if (dialog) {
        return;
      }
      activeDialogs.push({
        fullPath,
        name,
      });
    }
    function onClickToggleDialog(dialog) {
      // Current showing dialog, so let's minimize it
      if (route.fullPath === dialog.fullPath) {
        router.push(Route.Home);
      }
      else {
        router.push(dialog.fullPath);
      }
    }
    function getActiveCls(dialog) {
      return dialog.fullPath === route.fullPath ? "bg-slate-500" : "";
    }

    return {
      route,
      cmpCls,
      activeDialogs,
      cachedDialogs,
      getActiveCls,
      ComponentList,
      onMountedDialog,
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
