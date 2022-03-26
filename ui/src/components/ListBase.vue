<template>
  <ul tabindex="-1">
    <li
      v-for="(option, index) in options"
      :key="index"
      tabindex="-1"
      class="list-base-item"
      :class="isSelected(option, selections)"
      @click="onClickListItem($event, option)"
    >
      {{ valueField ? option[valueField] : option }}
    </li>
  </ul>
</template>

<script>
const SelectedCls = "list-base-item-selected";
export default {
  name: "ListBase",
  emits: ["update:selections"],
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
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    function onClickListItem(event, option) {
      // We don't want the document click to be triggered, as the parent class will handle what to do
      event.stopPropagation();
      emit("update:selections", option, event.target.classList.contains(SelectedCls));
    }
    function isSelected(option, selections) {
      let cls = "";
      for (const selection of selections) {
        if (option === selection) {
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
