import type { DirectiveBinding } from "vue";

export function visible(el: HTMLElement, binding: DirectiveBinding) {
  el.style.visibility = binding.value ? "visible" : "hidden";
}
