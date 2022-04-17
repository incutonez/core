import "ui/index.css";
import "shared/overrides/Date.js";
import "ui/rules.js";
import Icons from "ui/Icons.js";

export default {
  install(app) {
    const domEl = document.createElement("div");
    domEl.id = "overlayManager";
    document.body.appendChild(domEl);
    app.config.globalProperties.Icons = Icons;
  },
};
