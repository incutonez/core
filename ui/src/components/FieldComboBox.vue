<template>
  <BaseField
    ref="fieldEl"
    v-model="displayValue"
    v-mousedown-document="onMouseDownDocument"
    v-scroll-document="onScrollDocument"
    class="field-combo-box"
    :class="componentCls"
    @keydown.delete="onKeyBackspace"
    @input:field="onInputField"
    @click:field="onClickField"
    @keydown.tab="onTabField"
  >
    <template #beforeItems>
      <div v-if="multiSelect">
        <slot name="itemsDisplay">
          <BaseItems
            v-for="(selection, index) in selections"
            v-show="isTagVisible(selection, index)"
            :key="selection[optionsAvailable.idField]"
            @remove:selection="onClickItemRemove(selection)"
          >
            {{ selection[displayFieldFm] }}
          </BaseItems>
        </slot>
        <div
          v-show="showExpandTags"
          class="field-tags-wrapper-collapse"
          @click="onClickExpandTags"
        >
          <span>+ {{ collapsedTagCount }}</span>
        </div>
        <div
          v-show="showCollapseTags"
          class="field-tags-wrapper-expand"
          @click="onClickCollapseTags"
        >
          <span>- {{ collapsedTagCount }}</span>
        </div>
      </div>
    </template>
    <template #afterItems>
      <BaseIcon
        class="field-combo-box-picker"
        :icon="Icon.PickerDown"
        @click="onClickPicker"
      />
      <BaseOverlay
        ref="dropdownListEl"
        v-visible="isExpanded"
        class="field-combo-box-list-wrapper"
        :style="dropdownListStyle"
      >
        <slot
          name="list"
          :expanded="isExpanded"
          :options="optionsAvailable"
          :selections="selections"
        >
          <slot name="listBefore" />
          <BaseList
            :selections="selections"
            :options="optionsAvailable"
            @update:selections="onUpdateSelections"
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
          <slot name="listAfter" />
        </slot>
      </BaseOverlay>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
/**
 * Implementation concept taken from Atlassian
 * Reference: https://atlassian.design/components/select/examples
 */
import { computed, ref, unref, watch } from "vue";
import { Collection, isCollection } from "ui/classes/Collection";
import { BaseField, BaseIcon, BaseItems, BaseList, BaseOverlay, Icon } from "ui/index";
import type { IModel } from "ui/interfaces";
import { EnumProp } from "ui/statics/Enums";
import { hasTarget, isEmpty, makeArray } from "ui/utilities";

export interface IPropsFieldComboBox {
  modelValue?: string | number | any[];
  multiSelect?: boolean;
  options?: any[] | Collection | IModel[];
  expanded?: boolean;
  idField?: string;
  displayField?: string;
  maxSelectedTags?: number;
  filterSelections?: boolean;
  filterFn?: (options: any) => {};
  /**
   * This must be an array of objects, with at least the id property defined
   * @typedef Group
   * @property {String|Number} key
   * @property {String} [display=id]
   * This is the value that's used when displaying the group.  By default, it uses the id
   */
  groups?: any[];
  listHeight?: string;
}

interface IUpdateSelection {
  option?: any;
  remove?: boolean;
  shouldBlur?: boolean;
}

const props = withDefaults(defineProps<IPropsFieldComboBox>(), {
  modelValue: undefined,
  options: () => [],
  idField: "",
  displayField: "",
  maxSelectedTags: 2,
  filterFn: undefined,
  groups: undefined,
  listHeight: "144px",
});
const emit = defineEmits(["update:expanded", "update:modelValue", "update:selected"]);
const SearchFilter = "searchFilter";
const SelectionsFilter = "selectionsFilter";
/**
 * TODO: We'll need to refactor this to allow for different heights, but right now, we're hardcoding it
 * to h-36 in field-combo-box-list-wrapper
 */
const ListPadding = 8;
const fieldEl = ref<InstanceType<typeof BaseField>>();
const dropdownListEl = ref<InstanceType<typeof BaseOverlay>>();
const isExpanded = ref(props.expanded);
const $search = ref(null);
const showCollapseTags = ref(false);
const selections = ref<any[]>([]);
const collapsedTagCount = computed(() => selections.value.length - props.maxSelectedTags);
const showExpandTags = computed(() => collapsedTagCount.value > 0 && !showCollapseTags.value);
const dropdownListStyle = computed(() => {
  return {
    height: props.listHeight,
  };
});

const optionsAvailable = computed(() => {
  const { groups, options } = props;
  let { filterFn, displayField, idField } = props;
  let optionsCollection: Collection;
  /* If we don't do this, we run the risk of sharing the same collection and adding filters that could
   * cause side effects elsewhere... we need our own copy for this component */
  if (isCollection(options)) {
    optionsCollection = options.clone();
  }
  else {
    optionsCollection = new Collection({
      [EnumProp.Data]: options as IModel[],
    });
  }
  // If this is explicitly set, we prefer it
  if (idField) {
    optionsCollection.idField = idField;
  }
  else {
    idField = optionsCollection.idField;
  }
  // If this is explicitly set, we prefer it
  if (displayField) {
    optionsCollection[EnumProp.DisplayField] = displayField;
  }
  else {
    displayField = optionsCollection[EnumProp.DisplayField];
  }
  const search = unref($search);
  optionsCollection.removeFilters([SearchFilter, SelectionsFilter], true);
  if (search) {
    if (!filterFn) {
      const searchRe = new RegExp(search, "i");
      filterFn = (option) => searchRe.test(option[displayField]);
    }
    optionsCollection.addFilters(
      [{
        id: SearchFilter,
        fn: filterFn,
      }],
      {
        suppress: true,
      },
    );
  }
  if (props.multiSelect && props.filterSelections) {
    // TODO: Selections here triggers this entire computed to be called, which is inefficient
    const selectionValues = unref(selections);
    if (!isEmpty(selectionValues)) {
      optionsCollection.addFilters(
        [{
          id: SelectionsFilter,
          fn: (option: any) => {
            let include = true;
            for (const selection of selectionValues) {
              if (selection[idField] === option[idField]) {
                include = false;
                break;
              }
            }
            return include;
          },
        }],
        {
          suppress: true,
        },
      );
    }
  }
  optionsCollection[EnumProp.Groups] = groups;
  return optionsCollection;
});
const displayFieldFm = computed(() => optionsAvailable.value[EnumProp.DisplayField]);
const displayValue = computed({
  get() {
    const search = unref($search);
    if (isEmpty(search)) {
      return props.multiSelect ? "" : selections.value[0]?.[displayFieldFm.value];
    }
    return search;
  },
  // User is typing
  set(value) {
    $search.value = value;
  },
});
const componentCls = computed(() => (props.multiSelect ? "multi-select" : ""));

selections.value = getSelections();

function getSelections() {
  const selections: any[] = [];
  const { idField } = optionsAvailable.value;
  let { modelValue } = props;
  if (isEmpty(modelValue)) {
    return selections;
  }
  modelValue = makeArray(modelValue);
  modelValue.forEach((selectedValue) => {
    const foundOption = props.options?.find((option) => option[idField] === selectedValue);
    if (foundOption) {
      selections.push(foundOption);
    }
  });
  return selections;
}
function updateExpanded(value = !isExpanded.value) {
  isExpanded.value = value;
  if (value) {
    const $dropdownListEl = dropdownListEl.value.$el;
    const { style: dropdownStyle } = $dropdownListEl;
    const { height } = $dropdownListEl.getBoundingClientRect();
    const boundingClientRect = fieldEl.value.inputWrapper.getBoundingClientRect();
    const { left, width, bottom } = boundingClientRect;
    let { top } = boundingClientRect;
    if (innerHeight < bottom + height + ListPadding) {
      top -= height;
    }
    else {
      top = bottom + ListPadding;
    }
    dropdownStyle.top = `${top + scrollY}px`;
    dropdownStyle.left = `${left - 2}px`;
    dropdownStyle.width = `${width + 4}px`;
  }
  emit("update:expanded", value);
}
function onKeyBackspace() {
  if (!props.multiSelect) {
    return;
  }
  let modelValue = props.modelValue as any[];
  if (isEmpty(modelValue) || !isEmpty($search.value)) {
    return;
  }
  modelValue = modelValue[modelValue.length - 1];
  const { idField } = optionsAvailable.value;
  updateSelections({
    option: props.options?.find((item) => item[idField] === modelValue),
    remove: true,
  });
}
function onClickField() {
  updateExpanded();
}
/**
 * When the user does any sort of input for the single select, we need to update
 * our search value to what's been typed, as the search acts as both the display
 * value and the filter value for the dropdown list.  And we don't want to initially
 * set the search value until the user does some sort of input.
 * @param {String} value
 */
function onInputField(value: string) {
  if (props.multiSelect) {
    return;
  }
  if (isEmpty(value)) {
    updateSelections({
      shouldBlur: false,
    });
  }
}
function onTabField() {
  blurField();
}
function blurField() {
  updateExpanded(false);
  $search.value = null;
}
function onClickPicker() {
  updateExpanded();
}
function onClickItemRemove(option: any) {
  updateSelections({
    option,
    remove: true,
  });
}
function onMouseDownDocument({ target }: { target: HTMLElement }) {
  if (isExpanded.value && !(hasTarget(dropdownListEl.value.$el, target) || hasTarget(fieldEl.value.$el, target))) {
    blurField();
  }
}
function onScrollDocument({ target }: { target: HTMLElement }) {
  if (isExpanded.value && !dropdownListEl.value.$el.contains(target)) {
    updateExpanded(false);
  }
}
function updateSelections({ option, remove, shouldBlur = !props.multiSelect }: IUpdateSelection = {}) {
  let updateValue = null;
  const { multiSelect } = props;
  let { modelValue } = props;
  const selectedId = optionsAvailable.value.getOptionId(option);
  if (multiSelect) {
    modelValue = makeArray(modelValue);
    if (remove) {
      updateValue = modelValue.filter((item) => item !== selectedId);
    }
    else {
      updateValue = modelValue.concat(selectedId);
    }
  }
  else if (!remove) {
    updateValue = selectedId;
  }
  if (shouldBlur) {
    blurField();
  }
  emit("update:modelValue", updateValue);
}
function onUpdateSelections(option: any, remove: boolean) {
  updateSelections({
    option,
    remove,
  });
}
function onClickCollapseTags() {
  showCollapseTags.value = false;
}
function onClickExpandTags() {
  showCollapseTags.value = true;
}
function isTagVisible(selection: any, index: number) {
  return showCollapseTags.value || index < props.maxSelectedTags;
}

// We don't use watchEffect here because of the logic in getSelections... it requires some breathing room
watch(
  () => props.modelValue,
  () => {
    selections.value = getSelections();
    emit("update:selected", props.multiSelect ? selections.value : selections.value[0]);
  },
  {
    immediate: true,
  },
);
watch(
  () => props.expanded,
  (value) => updateExpanded(value),
);
watch(
  () => props.multiSelect,
  (value) => {
    if (!value) {
      updateSelections({
        option: selections.value?.[0],
      });
    }
  },
);

defineExpose([getSelections]);
</script>

<style lang="scss" scoped>
@use "sass:math";
$padding: 4px;
.field-combo-box-list-wrapper {
  @apply pointer-events-auto rounded overflow-auto absolute top-24 z-10 w-full h-36 indent-px bg-white border border-gray-300 shadow;
}
.field-combo-box-picker {
  @apply leading-7 box-border absolute top-0 right-0 pr-2 text-xs leading-6 cursor-pointer hover:text-blue-600;
}

.multi-select {
  :deep(.field-text-input) {
    @apply mt-1;
  }

  :deep(.field-text) {
    @apply pb-1 pl-1 flex-col;
  }

  &.tags-below {
    :deep(.field-text) {
      @apply flex-col-reverse;
    }
  }

  &.tags-inline {
    :deep(.field-text) {
      @apply flex-row;
    }
  }
}

:deep(.field-text) {
  @apply box-border flex-wrap pr-5;
}

:deep(.field-text-input) {
  @apply flex-1 w-full;
}
</style>
