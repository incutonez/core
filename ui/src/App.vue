<template>
  <main class="flex overflow-auto flex-col flex-1 bg-slate-800">
    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        :class="cmpCls"
        @vnode-mounted="onMountedDialog"
        @click:close="onClickCloseDialog"
      />
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
import BaseDialog from "ui/components/BaseDialog.vue";
import {
  computed,
  reactive,
} from "vue";
import BaseOverlay from "ui/components/BaseOverlay.vue";

const ComponentList = Object.keys(Route).map((route) => {
  return {
    name: route,
    path: Route[route],
  };
});
export default {
  name: "App",
  components: {
    BaseOverlay,
    BaseDialog,
    BaseButtonMenu,
    RouterView,
  },
  setup() {
    const activeDialogs = reactive([]);
    const route = useRoute();
    const router = useRouter();
    const cmpCls = computed(() => route.path === Route.Home ? "" : "view-dialog");
    function onClickStartItem(item) {
      router.push(item.path);
    }
    function onClickCloseDialog() {
      router.push(Route.Home);
    }
    // TODOJEF: Revisit this and fix it... issue with KeepAlive, Teleport, and dynamic include
    function onMountedDialog(cmp) {
      const { name } = cmp.type;
      if (activeDialogs.find((item) => item === name)) {
        return;
      }
      activeDialogs.push(name);
    }

    return {
      route,
      cmpCls,
      activeDialogs,
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
