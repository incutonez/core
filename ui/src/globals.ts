import { reactive } from "vue";
import { OverlayManager } from "ui/classes/OverlayManager";

export const overlayManager = reactive(new OverlayManager());
export const globalError = reactive({
  message: "",
  title: "Globally Caught",
});
