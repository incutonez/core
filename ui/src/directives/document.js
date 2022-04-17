export const clickDocument = {
  mounted(el, binding) {
    document.addEventListener("click", binding.value);
  },
  unmounted(el, binding) {
    document.removeEventListener("click", binding.value);
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
