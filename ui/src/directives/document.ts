import type { DirectiveBinding } from "vue";

export const mouseDownDocument = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    document.addEventListener("mousedown", binding.value);
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    document.removeEventListener("mousedown", binding.value);
  },
};

export const scrollDocument = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    document.addEventListener("scroll", binding.value, true);
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    document.removeEventListener("scroll", binding.value, true);
  },
};
