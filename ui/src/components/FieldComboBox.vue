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
          <template
            v-for="(selection, index) in selections"
            :key="selection[displayField]"
          >
            <BaseItems
              v-show="isTagVisible(selection, index)"
              @remove:selection="onClickItemRemove(selection)"
            >
              {{ selection[displayField] }}
            </BaseItems>
          </template>
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
        v-show="isExpanded"
        ref="dropdownListEl"
        class="field-combo-box-list-wrapper"
        tabindex="-1"
      >
        <slot
          name="list"
          :expanded="isExpanded"
          :options="optionsAvailable"
          :display-field="displayField"
          :selections="selections"
        >
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
        </slot>
      </BaseOverlay>
    </template>
  </BaseField>
</template>

<script>
import {
  computed,
  ref,
  unref,
  watch,
} from "vue";
import {
  hasTarget,
  isArray,
  isEmpty,
  Enum,
} from "@incutonez/shared";
import {
  BaseField,
  BaseIcon,
  BaseItems,
  BaseList,
  BaseOverlay,
} from "ui/index.js";
import { Collection } from "@incutonez/shared/src/Collection.js";

/**
 * @property {Number} Above
 * @property {Number} Below
 * @property {Number} Inline
 */
export const ComboBoxTagPosition = new Enum({
  Above: "tags-above",
  Below: "tags-below",
  Inline: "tags-inline",
});
const SearchFilter = "searchFilter";
const SelectionsFilter = "selectionsFilter";
/**
 * TODO: We'll need to refactor this to allow for different heights, but right now, we're hardcoding it
 * to h-36 in field-combo-box-list-wrapper
 */
const ListPadding = 8;
const ListHeight = 144 + ListPadding;
/**
 * Implementation concept taken from Atlassian
 * Reference: https://atlassian.design/components/select/examples
 */
export default {
  name: "FieldComboBox",
  components: {
    BaseOverlay,
    BaseList,
    BaseIcon,
    BaseItems,
    BaseField,
  },
  emits: ["update:expanded", "update:modelValue"],
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: null,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    idField: {
      type: String,
      default: "id",
    },
    displayField: {
      type: String,
      default: "value",
    },
    maxSelectedTags: {
      type: Number,
      default: 2,
    },
    filterSelections: {
      type: Boolean,
      default: false,
    },
    filterFn: {
      type: Function,
      default: null,
    },
    /**
     * This must be an array of objects, with at least the id property defined
     * @typedef Group
     * @property {String|Number} key
     * @property {String} [display=id]
     * This is the value that's used when displaying the group.  By default, it uses the id
     */
    groups: {
      type: Array,
      default: null,
    },
    // TODOJEF: Get this working
    groupSort: {
      type: Function,
      default: null,
    },
  },
  setup(props, { emit }) {
    const fieldEl = ref(null);
    const dropdownListEl = ref(null);
    const selections = ref(getSelections());
    const isExpanded = ref(props.expanded);
    const $search = ref(null);
    const showCollapseTags = ref(false);
    const collapsedTagCount = computed(() => selections.value.length - props.maxSelectedTags);
    const showExpandTags = computed(() => collapsedTagCount.value > 0 && !showCollapseTags.value);
    const optionsAvailable = computed(() => {
      const { displayField, idField, groups } = props;
      let { options, filterFn } = props;
      /* If we don't do this, we run the risk of sharing the same collection and adding filters that could
       * cause side effects elsewhere... we need our own copy for this component */
      if (options.isCollection) {
        options = options.clone();
      }
      else {
        options = new Collection({
          idField,
          displayField,
          records: options,
        });
      }
      const search = unref($search);
      options.removeFilters([SearchFilter, SelectionsFilter], true);
      if (search) {
        if (!filterFn) {
          const searchRe = new RegExp(search, "i");
          filterFn = (option) => searchRe.test(option[displayField]);
        }
        options.addFilters({
          id: SearchFilter,
          fn: filterFn,
        }, {
          suppress: true,
        });
      }
      if (props.multiSelect && props.filterSelections) {
        // TODOJEF: Selections here triggers this entire computed to be called, which is inefficient
        // Really should be using addFilters on the collection
        const selectionValues = unref(selections);
        if (!isEmpty(selectionValues)) {
          options.addFilters({
            id: SelectionsFilter,
            fn: (option) => selectionValues.indexOf(option) === -1,
          }, {
            suppress: true,
          });
        }
      }
      options.groups = groups;
      return options;
    });
    const displayValue = computed({
      get() {
        const search = unref($search);
        if (isEmpty(search)) {
          return props.multiSelect ? "" : selections.value[0]?.[props.displayField];
        }
        return search;
      },
      // User is typing
      set(value) {
        $search.value = value;
      },
    });
    const componentCls = computed(() => props.multiSelect ? "multi-select" : "");
    function getSelections() {
      const selections = [];
      const { idField } = props;
      let { modelValue } = props;
      if (isEmpty(modelValue)) {
        return selections;
      }
      modelValue = isArray(modelValue) ? modelValue : [modelValue];
      modelValue.forEach((selectedValue) => {
        const foundOption = props.options?.find((option) => option[idField] === selectedValue);
        if (foundOption) {
          selections.push(foundOption);
        }
      });
      return selections;
    }
    watch(() => props.modelValue, (() => {
      selections.value = getSelections();
    }), {
      immediate: true,
    });
    watch(() => props.expanded, (value) => {
      updateExpanded(value);
    });
    watch(() => props.multiSelect, (value) => {
      if (!value) {
        updateSelections({
          option: selections.value?.[0],
        });
      }
    });
    function updateExpanded(value = !isExpanded.value) {
      isExpanded.value = value;
      if (value) {
        const { inputWrapper } = fieldEl.value;
        const { style: dropdownStyle } = dropdownListEl.value.$el;
        const boundingClientRect = inputWrapper.getBoundingClientRect();
        const { left, width, bottom } = boundingClientRect;
        let { top } = boundingClientRect;
        if (innerHeight < bottom + ListHeight) {
          top -= ListHeight;
        }
        else {
          top = bottom + ListPadding;
        }
        dropdownStyle.top = `${top}px`;
        dropdownStyle.left = `${left - 2}px`;
        dropdownStyle.width = `${width + 4}px`;
      }
      emit("update:expanded", value);
    }
    function onKeyBackspace() {
      if (!props.multiSelect) {
        return;
      }
      let { modelValue } = props;
      if (isEmpty(modelValue) || !isEmpty($search.value)) {
        return;
      }
      modelValue = modelValue[modelValue.length - 1];
      updateSelections({
        option: props.options?.find((item) => item[props.idField] === modelValue),
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
    function onInputField(value) {
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
    function onClickItemRemove(option) {
      updateSelections({
        option,
        remove: true,
      });
    }
    function onMouseDownDocument(event) {
      const { target } = event;
      if (isExpanded.value && hasTarget(dropdownListEl.value.$el, target)) {
        event.stopPropagation();
        event.preventDefault();
      }
      else if (!hasTarget(fieldEl.value.$el, target)) {
        blurField();
      }
    }
    function onScrollDocument({ target }) {
      if (isExpanded.value && !dropdownListEl.value.$el.contains(target)) {
        updateExpanded(false);
      }
    }
    function updateSelections({ option, remove, shouldBlur = !props.multiSelect } = {}) {
      let updateValue = null;
      const { multiSelect } = props;
      let { modelValue } = props;
      const selectedId = optionsAvailable.value.getOptionId(option);
      if (multiSelect) {
        if (!isArray(modelValue)) {
          modelValue = [modelValue];
        }
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
    function onUpdateSelections(option, remove) {
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
    function isTagVisible(selection, index) {
      return showCollapseTags.value || index < props.maxSelectedTags;
    }
    return {
      selections,
      showExpandTags,
      showCollapseTags,
      collapsedTagCount,
      isExpanded,
      fieldEl,
      dropdownListEl,
      displayValue,
      componentCls,
      optionsAvailable,
      isTagVisible,
      onClickPicker,
      onClickField,
      onInputField,
      onTabField,
      onUpdateSelections,
      onClickItemRemove,
      onKeyBackspace,
      onClickExpandTags,
      onClickCollapseTags,
      onMouseDownDocument,
      onScrollDocument,
    };
  },
};
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
