import "ui/index.css";
import "shared/overrides/index.js";
import "ui/rules.js";
import Icon from "ui/statics/Icon.js";

export default {
  install(app) {
    const domEl = document.createElement("div");
    domEl.id = "overlayManager";
    document.body.appendChild(domEl);
    app.config.globalProperties.Icon = Icon;
  },
};
