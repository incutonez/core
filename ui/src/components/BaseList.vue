<template>
  <ul class="base-list">
    <li
      v-for="option in records"
      :key="option.fullPath"
      :class="records.getOptionCls(option, selections)"
      @click="onClickListItem($event, option, isGrouped)"
    >
      <template v-if="isGrouped">
        <div class="group">
          <slot
            name="groupDisplay"
            :group="option"
          >
            Group: {{ records.getOptionDisplay(option) }}
          </slot>
        </div>
        <BaseList
          :options="option"
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
          {{ records.getOptionDisplay(option) }}
        </slot>
      </template>
    </li>
  </ul>
</template>

<script>
import {
  computed,
  ref,
  watchEffect,
} from "vue";
import { Collection } from "ui/classes/Collection.js";

const SelectedCls = "list-item-selected";
export default {
  name: "BaseList",
  emits: ["update:selections", "click:item"],
  props: {
    /**
     * @type {Collection}
     */
    options: {
      type: [Array, Object],
      default: () => [],
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const records = ref(null);
    watchEffect(() => {
      const { options } = props;
      // TODOJEF: Figure out better way to prevent rendering from happening on every click
      // We always want to be dealing with our class, so we can normalize the functionality
      records.value = options?.isCollection ? options : new Collection(options);
    });
    const idField = computed(() => records.value.idField);
    const displayField = computed(() => records.value.displayField);
    const isGrouped = computed(() => records.value.isGrouped);
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
    function onClickListItem(event, option, grouped) {
      if (grouped) {
        return;
      }
      emitUpdate([option, event.target.classList.contains(SelectedCls)]);
      emitClick([option]);
    }
    return {
      records,
      isGrouped,
      idField,
      displayField,
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
