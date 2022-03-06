<template>
  <ul>
    <li
      v-for="(option, index) in options"
      :key="index"
      class="list-base-item"
      :class="isSelected(option, selections)"
      @click="onClickListItem($event, option)"
    >
      {{ valueField ? option[valueField] : option }}
    </li>
  </ul>
</template>

<script>
const selectedCls = "list-base-item-selected";
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
      emit("update:selections", option, event.target.classList.contains(selectedCls));
    }
    function isSelected(option, selections) {
      let cls = "";
      for (const selection of selections) {
        if (option === selection) {
          cls = selectedCls;
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
