import "ui/index.css";
import "shared/overrides/Date.js";
import "ui/rules.js";
import Icons from "ui/Icons.js";

export default {
  install(app) {
    /**
     * TODOJEF: When you do it this way, you don't have styles associated to it
     * @type {HTMLDivElement}
     */
    const domEl = document.createElement("div");
    domEl.id = "overlayManager";
    document.body.appendChild(domEl);
    app.config.globalProperties.Icons = Icons;
  },
};
