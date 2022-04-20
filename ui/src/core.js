import "ui/index.css";
import "shared/overrides/index.js";
import "ui/rules.js";
import Icon from "ui/statics/Icon.js";
import { OverlayManager } from "ui/components/OverlayManager.js";

/**
 * Current issue is that I want a global manager component, but I don't want all of the apps to have to
 * add the component in the App.vue... I want it to be injected, so it seems like the only way to do this
 * is through WebComponents (customElements)
 */
export default {
  install(app) {
    const overlayManager = new OverlayManager();
    app.provide("OverlayManager", overlayManager);
    app.config.globalProperties.Icon = Icon;
  },
};
