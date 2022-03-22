<template>
  <FieldText
    ref="fieldEl"
    v-bind="$props"
    v-model="displayValueFm"
    :input-wrapper-classes="inputWrapperCls"
    :input-cls="inputCls"
    @keydown.delete="onKeyBackspace"
    @click:field="onClickField"
    @keydown.tab="onTabField"
  >
    <template #beforeItems>
      <div
        v-if="multiSelect"
        :class="itemsWrapperCls"
      >
        <slot name="itemsDisplay">
          <template
            v-for="(selection, index) in selections"
            :key="selection[valueField]"
          >
            <ItemsBase
              v-show="isTagVisible(selection, index)"
              @remove:selection="onClickItemRemove(selection)"
            >
              {{ selection[valueField] }}
            </ItemsBase>
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
      <IconBase
        class="field-combo-box-picker"
        :icon="Icons.PICKER_DOWN"
        @click="onClickPicker"
      />
      <div
        v-show="isExpanded"
        class="field-combo-box-list-wrapper"
        tabindex="-1"
      >
        <slot
          name="list"
          :expanded="isExpanded"
          :options="optionsAvailable"
          :value-field="valueField"
          :selections="selections"
        >
          <ListBase
            :selections="selections"
            :options="optionsAvailable"
            :value-field="valueField"
            @update:selections="onUpdateSelections"
          />
        </slot>
      </div>
    </template>
  </FieldText>
</template>

<script>
import {
  FieldText,
  IconBase,
  Icons,
} from "ui/index.js";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from "vue";
import ListBase from "ui/ListBase.vue";
import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import ItemsBase from "ui/ItemsBase.vue";
import { Enum } from "shared/Enum.js";

/**
 * @property {Number} Above
 * @property {Number} Below
 * @property {Number} Pack
 */
export const ComboBoxTagPositions = new Enum(["above", "below", "pack"]);
/**
 * Implementation concept taken from Atlassian
 * Reference: https://atlassian.design/components/select/examples
 */
/**
 * TODOJEF:
 * - Switch to using CSS instead of the TagPositions like above
 * - When you scroll, the height is determined and flips
 * - Add a master DropdownList component
 * -- Add radio/checkboxes
 * - Add groups
 * -- Create a grouper class
 * - Change hover to be changed through JS
 * - Add keyboard events... up, down, enter
 * -- https://stackoverflow.com/a/52835382/1253609
 * - Probably create a shadow collection class that can alter the items in list provided
 * - Add components:
 * -- Avatar
 * -- Badge (this is what the tags will use)
 * -- Window that can be dragged, minimized/maximized
 */
export default {
  name: "FieldComboBox",
  components: {
    ItemsBase,
    ListBase,
    IconBase,
    FieldText,
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
    valueField: {
      type: String,
      default: "value",
    },
    tagsPosition: {
      type: Number,
      default: ComboBoxTagPositions.Above,
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
  },
  setup(props, { emit }) {
    const fieldEl = ref(null);
    const selections = ref(getSelections());
    const isExpanded = ref(props.expanded);
    const searchValue = ref(null);
    const displayValue = ref(null);
    const showCollapseTags = ref(false);
    const collapsedTagCount = computed(() => selections.value.length - props.maxSelectedTags);
    const showExpandTags = computed(() => collapsedTagCount.value > 0 && !showCollapseTags.value);
    const optionsAvailable = computed(() => {
      let { options } = props;
      const { filterFn, valueField, idField } = props;
      const search = unref(searchValue);
      if (search) {
        if (filterFn) {
          options = filterFn({
            search,
            options,
            valueField,
            idField,
          });
        }
        else {
          const searchRe = new RegExp(search, "i");
          options = options.filter((option) => searchRe.test(option[valueField]));
        }
      }
      if (props.filterSelections) {
        const selectionValues = props.modelValue;
        if (!isEmpty(selectionValues)) {
          options = options.filter((option) => selectionValues.indexOf(option[idField]) === -1);
        }
      }
      return options;
    });
    const displayValueFm = computed({
      get() {
        if (searchValue.value) {
          return searchValue.value;
        }
        return displayValue.value;
      },
      // User is typing
      set(value) {
        searchValue.value = value;
      },
    });
    const itemsWrapperCls = computed(() => {
      let cls;
      switch (props.tagsPosition) {
        case ComboBoxTagPositions.Pack:
          cls = "contents";
          break;
        case ComboBoxTagPositions.Below:
        case ComboBoxTagPositions.Above:
        default:
          cls = "flex-wrap";
          break;
      }
      return cls;
    });
    const inputCls = computed(() => {
      const cls = ["flex-1 w-full"];
      if (props.multiSelect) {
        cls.push("mt-1");
      }
      return cls.join(" ");
    });
    const inputWrapperCls = computed(() => {
      const cls = ["box-border flex-wrap pr-5"];
      if (props.multiSelect) {
        cls.push("pb-1 pl-1");
      }
      switch (props.tagsPosition) {
        case ComboBoxTagPositions.Above:
          cls.push("flex-col");
          break;
        case ComboBoxTagPositions.Below:
          cls.push("flex-col-reverse");
          break;
      }
      return cls.join(" ");
    });
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
      const { multiSelect } = props;
      const values = getSelections();
      selections.value = values;
      if (multiSelect || isEmpty(values)) {
        displayValue.value = null;
      }
      else {
        displayValue.value = values[0][props.valueField];
      }
    }), {
      immediate: true,
    });
    watch(() => props.expanded, (value) => {
      updateExpanded(value);
    });
    function updateExpanded(value = !isExpanded.value) {
      isExpanded.value = value;
      if (value) {
        fieldEl.value.inputEl.focus();
      }
      emit("update:expanded", value);
    }
    function onKeyBackspace() {
      let { modelValue } = props;
      if (isEmpty(modelValue) || !isEmpty(displayValue.value)) {
        return;
      }
      modelValue = props.multiSelect ? modelValue[modelValue.length - 1] : modelValue;
      updateSelections(props.options?.find((item) => item[props.idField] === modelValue), true);
    }
    function onClickField() {
      updateExpanded();
    }
    function onTabField() {
      blurField();
    }
    function blurField() {
      updateExpanded(false);
      searchValue.value = null;
    }
    function onClickPicker() {
      updateExpanded();
    }
    function onClickItemRemove(option) {
      updateSelections(option, true);
    }
    function onClickDocument(event) {
      if (!fieldEl.value.$el.contains(event.target)) {
        blurField();
      }
    }
    function updateSelections(option, remove) {
      let updateValue = null;
      const { modelValue, multiSelect } = props;
      const selectedId = option?.[props.idField];
      if (multiSelect) {
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
      if (!props.multiSelect) {
        updateExpanded(false);
      }
      emit("update:modelValue", updateValue);
    }
    function onUpdateSelections(option, remove) {
      updateSelections(option, remove);
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
    onMounted(() => {
      document.addEventListener("click", onClickDocument);
    });
    onUnmounted(() => {
      document.removeEventListener("click", onClickDocument);
    });
    return {
      Icons,
      selections,
      showExpandTags,
      showCollapseTags,
      collapsedTagCount,
      inputWrapperCls,
      isExpanded,
      fieldEl,
      displayValue,
      displayValueFm,
      itemsWrapperCls,
      inputCls,
      optionsAvailable,
      isTagVisible,
      onClickPicker,
      onClickField,
      onTabField,
      onUpdateSelections,
      onClickItemRemove,
      onKeyBackspace,
      onClickExpandTags,
      onClickCollapseTags,
    };
  },
};
</script>

<style lang="scss">
@use "sass:math";
$padding: 4px;
.field-combo-box-list-wrapper {
  @apply rounded overflow-auto absolute z-10 w-full h-36 indent-px bg-white border border-gray-300 shadow;
  width: calc(100% + #{$padding});
  left: -#{math.div($padding, 2)};
  top: calc(100% + #{$padding});
}
.field-combo-box-picker {
  @apply leading-7 box-border absolute top-0 right-0 pr-2 text-xs leading-6 cursor-pointer hover:text-blue-600;
}
</style>
