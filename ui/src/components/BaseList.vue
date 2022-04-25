<template>
  <ul class="base-list">
    <li
      v-for="(option, index) in options"
      :key="index"
      class="base-list-item"
      :class="isSelected(option, selections)"
      @click="onClickListItem($event, option)"
    >
      {{ valueField ? option[valueField] : option }}
    </li>
  </ul>
</template>

<script>
const SelectedCls = "base-list-item-selected";
export default {
  name: "BaseList",
  emits: ["update:selections", "click:item"],
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
      default: "",
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    function onClickListItem(event, option) {
      // We don't want the document click to be triggered, as the parent class will handle what to do
      event.stopPropagation();
      event.preventDefault();
      emit("update:selections", option, event.target.classList.contains(SelectedCls));
      emit("click:item", option);
    }
    function isSelected(option, selections) {
      let cls = "";
      const { valueField } = props;
      const value = option[valueField];
      for (const selection of selections) {
        if (value === selection[valueField]) {
          cls = SelectedCls;
          break;
        }
      }
      return cls;
    }
    return {
      onClickListItem,
      isSelected,
    };
  },
};
</script>

<style lang="scss">
.base-list-item {
  @apply py-1 px-2 hover:bg-slate-300 cursor-pointer;
  &.base-list-item-selected,
  &:hover {
    box-shadow: inset 2px 0 #3B82F6;
  }

  &.base-list-item-selected {
    @apply text-blue-700 bg-blue-100;
  }
}
</style>
