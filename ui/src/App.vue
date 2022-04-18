<template>
  <main class="flex overflow-auto flex-col flex-1 bg-slate-800">
    <RouterView v-slot="{ Component }">
      <Teleport to="#overlayManager">
        <KeepAlive :include="activeDialogs">
          <component
            :is="Component"
            v-show="isShowing(activeDialog, Component)"
            :class="cmpCls"
            @vnode-mounted="onMountedDialog(Component)"
            @click:close="onClickCloseDialog(Component)"
          />
        </KeepAlive>
      </Teleport>
    </RouterView>
  </main>
  <footer class="bg-slate-700 border-t border-gray-300">
    <BaseButtonMenu
      text="Start"
      class="default lg"
      list-cls="h-64 overflow-auto"
      :menu-options="ComponentList"
      menu-value-field="name"
      @click:item="onClickStartItem"
    />
  </footer>
</template>

<script>
import {
  RouterView,
  useRoute,
  useRouter,
} from "vue-router";
import {
  BaseButtonMenu,
} from "ui/index.js";
import Route from "ui/statics/Route.js";
import {
  computed,
  reactive,
  ref,
} from "vue";

const ComponentList = Object.keys(Route).map((route) => {
  return {
    name: route,
    path: Route[route],
  };
});
export default {
  name: "App",
  components: {
    BaseButtonMenu,
    RouterView,
  },
  setup() {
    const activeDialog = ref(null);
    const activeDialogs = reactive([]);
    const route = useRoute();
    const router = useRouter();
    const cmpCls = computed(() => route.path === Route.Home ? "" : "view-dialog");
    function onClickStartItem(item) {
      router.push(item.path);
    }
    function onClickCloseDialog(cmp) {
      activeDialogs.remove(cmp?.type.name);
      router.push(Route.Home);
    }
    function isShowing(active, cmp) {
      return active === cmp?.type.name;
    }
    function onMountedDialog(cmp) {
      const { name } = cmp.type;
      activeDialog.value = name;
      if (activeDialogs.find((item) => item === name)) {
        return;
      }
      activeDialogs.push(name);
    }

    return {
      route,
      cmpCls,
      activeDialog,
      activeDialogs,
      isShowing,
      ComponentList,
      onMountedDialog,
      onClickStartItem,
      onClickCloseDialog,
    };
  },
};
</script>

<style>
.view-dialog {
  @apply top-0 w-5/6 h-fit bg-white w-full border border-gray-300 shadow;
  height: calc(100% - 2rem);
}
</style>
