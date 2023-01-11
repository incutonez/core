<template>
  <ul class="base-list">
    <li
      v-for="option in records"
      :key="option.fullPath"
      :class="records.getOptionCls(option, selections)"
      @mousedown="onMouseDownListItem($event, option)"
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
    <slot name="emptyList">
      <li
        v-if="!records.length"
        class="list-item-empty"
      >
        No Records
      </li>
    </slot>
  </ul>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watchEffect,
} from "vue";
import { Collection } from "ui/classes/Collection";
import { EnumProp } from "ui/statics/Enums";

export interface IPropsBaseList {
  /**
   * @type {Collection}
   */
  options?: any | any[];
  selections?: any[];
}

const SelectedCls = "list-item-selected";
const props = withDefaults(defineProps<IPropsBaseList>(), {
  options: () => [],
  selections: () => [],
});
const emit = defineEmits(["update:selections", "click:item"]);
const records = ref<Collection>();
watchEffect(() => {
  const { options } = props;
  // TODO: Figure out better way to prevent rendering from happening on every click
  // We always want to be dealing with our class, so we can normalize the functionality
  records.value = options?.[EnumProp.IsCollection] ? options : new Collection(options);
});
const isGrouped = computed(() => records.value?.isGrouped);
function emitUpdate(args: any[]) {
  emit("update:selections", ...args);
}
function emitClick(args: any[]) {
  emit("click:item", ...args);
}
function onUpdateSelections(...args: any[]) {
  emitUpdate(args);
}
function onClickItem(...args: any[]) {
  emitClick(args);
}

/**
 * The reason we use mousedown instead of click is because we want to prevent the focus from being lost
 * on the input field, and that can only be done with mousedown... click happens AFTER focus has already
 * been lost.
 */
function onMouseDownListItem(event: MouseEvent, option: any) {
  // We prevent focus from being lost in the parent component
  event.stopPropagation();
  event.preventDefault();
  if (isGrouped.value) {
    return;
  }
  emitUpdate([option, (event.target as HTMLLIElement).classList.contains(SelectedCls)]);
  emitClick([option]);
}
</script>

<style lang="scss">
.list-item-empty {
  @apply py-1 px-2 text-gray-400;
}

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
