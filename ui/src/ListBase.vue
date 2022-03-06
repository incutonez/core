<template>
  <ul class="box-border overflow-auto border border-gray-300 list-base-container">
    <li
      v-for="(option, index) in options"
      :key="index"
      class="list-base-item"
      :class="isSelected(option, modelValue)"
      @click="onClickListItem(option)"
    >
      {{ valueField ? option[valueField] : option }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "ListBase",
  emits: ["update:modelValue"],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * If this is supplied, then the individual options are considered as an object, and we
     * need the key to access the appropriate value
     */
    valueField: {
      type: String,
      default: "value",
    },
    modelValue: {
      type: [Array, Object],
      default: null,
    },
  },
  setup(props, { emit }) {
    function onClickListItem(option) {
      emit("update:modelValue", option);
    }
    function isSelected(option, selection) {
      return option === selection ? "list-base-item-selected" : null;
    }
    return {
      onClickListItem,
      isSelected,
    };
  },
};
</script>

<style lang="scss">
.list-base-container {
  @apply top-7 rounded;
  width: calc(100% + 4px);
  left: -2px;
}
.list-base-item {
  @apply py-1 px-2 hover:bg-slate-100 cursor-pointer;
  &.list-base-item-selected,
  &:hover {
    box-shadow: inset 2px 0 #3B82F6;
  }

  &.list-base-item-selected {
    @apply text-blue-700 bg-blue-100;
  }
}
</style>
