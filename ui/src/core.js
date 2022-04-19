import "ui/index.css";
import "shared/overrides/index.js";
import "ui/rules.js";
import Icon from "ui/statics/Icon.js";
import {
  createApp,
  h,
} from "vue";

/**
 * This is more of an experiment on how to have a global OverlayManager
 */
class OverlayManager {
  rootEl = document.createElement("div");

  constructor() {
    this.rootEl.id = "overlayManager";
    document.body.appendChild(this.rootEl);
  }

  add(cmp, props) {
    const componentApp = createApp({
      setup: () => {
        return () => h(cmp, props);
      },
    });
    addGlobals(componentApp);
    componentApp.mount(this.rootEl);
  }
}

function addGlobals(app) {
  app.config.globalProperties.Icon = Icon;
}

export default {
  install(app) {
    window.OverlayManager = new OverlayManager();
    addGlobals(app);
  },
};
