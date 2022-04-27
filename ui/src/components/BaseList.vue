<template>
  <div class="base-list">
    <div
      v-for="group in options"
      :key="group.id"
      class="group-wrapper"
    >
      <div
        v-if="showGroups"
        class="group"
      >
        <slot
          name="groupDisplay"
          :group="group"
        >
          Group: {{ group.display }}
        </slot>
      </div>
      <ul class="list">
        <li
          v-for="option in group.options"
          :key="option[idField]"
          class="list-item"
          :class="isSelected(option, selections)"
          @click="onClickListItem($event, option)"
        >
          {{ displayField ? option[displayField] : option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

const SelectedCls = "list-item-selected";
export default {
  name: "BaseList",
  emits: ["update:selections", "click:item"],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    idField: {
      type: String,
      default: "",
    },
    /**
     * If this is supplied, then the individual options are considered as an object, and we
     * need the key to access the appropriate value
     */
    displayField: {
      type: String,
      default: "",
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const showGroups = computed(() => props.options.length > 1);
    function onClickListItem(event, option) {
      // We don't want the document click to be triggered, as the parent class will handle what to do
      event.stopPropagation();
      event.preventDefault();
      emit("update:selections", option, event.target.classList.contains(SelectedCls));
      emit("click:item", option);
    }
    function isSelected(option, selections) {
      let cls = "";
      const { idField } = props;
      const value = option[idField];
      for (const selection of selections) {
        if (value === selection[idField]) {
          cls = SelectedCls;
          break;
        }
      }
      return cls;
    }
    return {
      showGroups,
      onClickListItem,
      isSelected,
    };
  },
};
</script>

<style lang="scss">
.list-item {
  @apply py-1 px-2 hover:bg-slate-300 cursor-pointer;
  &.list-item-selected,
  &:hover {
    box-shadow: inset 2px 0 #3B82F6;
  }

  &.list-item-selected {
    @apply text-blue-700 bg-blue-100;
  }
}

.group {
  @apply px-2 text-gray-400 text-sm border-t h-8 leading-8;
}
</style>
