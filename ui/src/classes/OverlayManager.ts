/**
 * It's good to note why I'm not using Shadow DOM here, and that's mainly because Tailwind CSS isn't easy to
 * propagate down to shadow components without doing a full import of Tailwind.  Even then, the purging
 * mechanism isn't robust enough to deal with this, so because this component is fairly lightweight and
 * essentially just a wrapper/replacement for Teleport, we can get away with doing this.  If we had a larger
 * use case (slots, etc.) or very seriously needed to use this as a WebComponent in other projects, this
 * should be reworked.  We also don't define a Vue WebComponent
 * Resources:
 * - https://github.com/tailwindlabs/tailwindcss/discussions/1935
 * - https://stackoverflow.com/a/71933848/1253609
 * - https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue
 * - https://forum.vuejs.org/t/how-to-access-webcomponent-methods-using-vue-syntax/129033
 */
export class OverlayManager extends HTMLElement {
  constructor() {
    super();
    document.body.appendChild(this);
  }

  add(element?: HTMLElement) {
    if (element) {
      this.appendChild(element);
    }
  }

  unmount(element?: HTMLElement) {
    if (element) {
      this.removeChild(element);
    }
  }
}

customElements.define("overlay-manager", OverlayManager);
