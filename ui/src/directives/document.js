export const mouseDownDocument = {
  mounted(el, binding) {
    document.addEventListener("mousedown", binding.value);
  },
  unmounted(el, binding) {
    document.removeEventListener("mousedown", binding.value);
  },
};

export const scrollDocument = {
  mounted(el, binding) {
    document.addEventListener("scroll", binding.value, true);
  },
  unmounted(el, binding) {
    document.removeEventListener("scroll", binding.value, true);
  },
};
