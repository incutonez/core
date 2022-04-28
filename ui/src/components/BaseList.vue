<template>
  <ul class="base-list">
    <li
      v-for="option in options"
      :key="option.isGroup ? option.id : option[idField]"
      :class="getOptionCls(option, selections)"
      @click="onClickListItem($event, option)"
    >
      <template v-if="option.options">
        <div class="group">
          <slot
            name="groupDisplay"
            :group="option"
          >
            Group: {{ option.display }}
          </slot>
        </div>
        <BaseList
          :options="option.options"
          :id-field="option.idField"
          :display-field="option.displayField"
          :selections="selections"
          @update:selections="onUpdateSelections"
          @click:item="onClickItem"
        >
          <template
            v-for="(_, slot) of $slots"
            #[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template>
        </BaseList>
      </template>
      <template v-else>
        <slot
          name="listItemDisplay"
          :option="option"
        >
          {{ displayField ? option[displayField] : option }}
        </slot>
      </template>
    </li>
  </ul>
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
    function emitUpdate(args) {
      emit("update:selections", ...args);
    }
    function emitClick(args) {
      emit("click:item", ...args);
    }
    function onUpdateSelections(...args) {
      emitUpdate(args);
    }
    function onClickItem(...args) {
      emitClick(args);
    }
    function onClickListItem(event, option) {
      if (option.isGroup) {
        return;
      }
      emitUpdate([option, event.target.classList.contains(SelectedCls)]);
      emitClick([option]);
    }
    function getOptionCls(option, selections) {
      const cls = [option.isGroup ? "group-wrapper" : "list-item"];
      const { idField } = props;
      const value = option[idField];
      for (const selection of selections) {
        if (value === selection[idField]) {
          cls.push(SelectedCls);
          break;
        }
      }
      return cls;
    }
    return {
      showGroups,
      getOptionCls,
      onClickListItem,
      onUpdateSelections,
      onClickItem,
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
  @apply px-2 text-gray-400 text-sm h-8 leading-8;
}

.group-wrapper:not(:first-child) {
  @apply border-t;
}
</style>
