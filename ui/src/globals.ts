import { reactive, ref } from "vue";
import { OverlayManager } from "ui/classes/OverlayManager";

export const overlayManager = reactive(new OverlayManager());
export const errorMessage = ref();
