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
import Route from "ui/statics/Route.js";

export function useDialogManager() {
  const route = useRoute();
  const router = useRouter();
  const showingDialog = ref(null);
  const activeDialogs = reactive([]);
  const cachedDialogs = computed(() => activeDialogs.map(({ name }) => name));

  watch(router.currentRoute, (current) => {
    const { fullPath } = current;
    let dialog;
    if (fullPath === Route.Home) {
      dialog = null;
    }
    else {
      dialog = activeDialogs.find((dialog) => dialog.fullPath === fullPath);
      if (!dialog) {
        const { name } = current.matched.flatMap(({ components }) => Object.values(components))[0];
        dialog = {
          fullPath,
          name,
        };
        activeDialogs.push(dialog);
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
    activeDialogs.remove((dialog) => dialog.fullPath === fullPath);
  }

  function toggleDialog(dialog) {
    // Current showing dialog, so let's minimize it
    if (route.fullPath === dialog.fullPath) {
      router.push(Route.Home);
    }
    else {
      router.push(dialog.fullPath);
    }
  }

  return {
    activeDialogs,
    cachedDialogs,
    removeDialog,
    toggleDialog,
  };
}
