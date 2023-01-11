import {
  computed,
  reactive,
  ref,
  watch,
} from "vue";
import {
  useRoute,
  useRouter,
} from "vue-router";
import Route from "ui/statics/Route";
import type { IActiveDialog } from "ui/interfaces";

export function useDialogManager() {
  const route = useRoute();
  const router = useRouter();
  const showingDialog = ref<IActiveDialog>();
  const activeDialogs = reactive<IActiveDialog[]>([]);
  const cachedDialogs = computed(() => activeDialogs.map(({ name }) => name));

  watch(router.currentRoute, (current) => {
    const { fullPath } = current;
    let dialog;
    if (fullPath !== Route.Home) {
      dialog = activeDialogs.find((dialog) => dialog.fullPath === fullPath);
      if (!dialog) {
        // script setup doesn't expose a name property, but __name has the value, so it's a fallback
        const component = current.matched.flatMap(({ components }) => components && Object.values(components))[0];
        if (component) {
          dialog = {
            fullPath,
            name: component.name || (component as any).__name,
          };
          activeDialogs.push(dialog);
        }
      }
    }
    showingDialog.value = dialog;
  });

  watch(showingDialog, (current, previous) => {
    if (previous) {
      previous.isActive = false;
      previous.activeCls = "";
    }
    if (current) {
      current.isActive = true;
      current.activeCls = "bg-slate-500";
    }
  });

  function removeDialog(fullPath = router.currentRoute.value.fullPath) {
    activeDialogs.remove((dialog: IActiveDialog) => dialog.fullPath === fullPath);
  }

  function toggleDialog(dialog: IActiveDialog) {
    // Current showing dialog, so let's minimize it
    if (route.fullPath === dialog.fullPath) {
      return router.push(Route.Home);
    }
    return router.push(dialog.fullPath);
  }

  return {
    activeDialogs,
    cachedDialogs,
    removeDialog,
    toggleDialog,
  };
}
