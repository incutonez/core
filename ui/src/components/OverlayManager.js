export class OverlayManager extends HTMLElement {
  constructor() {
    super();
    this.classList.add("absolute", "top-0", "left-0", "contents", "pointer-events-none", "z-10", "contain-layout");
    document.body.appendChild(this);
  }

  add(element) {
    this.appendChild(element);
  }

  remove(element) {
    this.removeChild(element);
  }
}

customElements.define("overlay-manager", OverlayManager);
