<template>
  <FieldText
    ref="fieldEl"
    v-bind="$props"
    v-model="displayValue"
    input-wrapper-classes="flex-wrap"
    @keydown.delete="onKeyBackspace"
    @click:field="onClickField"
  >
    <template #beforeItems>
      <ItemsBase
        v-if="multiSelect"
        :selections="selections"
        :value-field="valueField"
        @remove:selection="onClickItemRemove"
      />
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
      >
        <slot
          name="list"
          :expanded="isExpanded"
          :options="options"
          :value-field="valueField"
          :selections="selections"
        >
          <ListBase
            :selections="selections"
            :options="options"
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
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import ListBase from "ui/ListBase.vue";
import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import ItemsBase from "ui/ItemsBase.vue";

/**
 * Implementation concept taken from Atlassian
 * Reference: https://atlassian.design/components/select/examples
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
  },
  setup(props, { emit }) {
    const fieldEl = ref(null);
    const selections = ref(getSelections());
    const isExpanded = ref(props.expanded);
    const displayValue = ref(null);
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
      updateExpanded(false);
    }), {
      immediate: true,
    });
    watch(() => props.expanded, (value) => {
      updateExpanded(value);
    });
    function updateExpanded(value = !isExpanded.value) {
      isExpanded.value = value;
      emit("update:expanded", value);
    }
    function onBlurField() {
      updateExpanded(false);
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
    function onClickPicker() {
      updateExpanded();
    }
    function onClickItemRemove(option) {
      updateSelections(option, true);
    }
    function onClickDocument(event) {
      if (!fieldEl.value.$el.contains(event.target)) {
        updateExpanded(false);
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
      else if( !remove) {
        updateValue = selectedId;
      }
      emit("update:modelValue", updateValue);
    }
    function onUpdateSelections(option, remove) {
      updateSelections(option, remove);
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
      onClickPicker,
      onClickField,
      onBlurField,
      onUpdateSelections,
      onClickItemRemove,
      onKeyBackspace,
      isExpanded,
      fieldEl,
      displayValue,
    };
  },
};
</script>

<style scoped lang="scss">
@use "sass:math";
$padding: 4px;
.field-combo-box-list-wrapper {
  @apply rounded overflow-auto absolute z-10 w-full h-36 indent-px bg-white border border-gray-300 shadow;
  width: calc(100% + #{$padding});
  left: -#{math.div($padding, 2)};
  top: calc(100% + #{$padding});
}
.field-combo-box-picker {
  @apply box-border absolute right-0 bottom-0 pr-2 text-xs leading-6 cursor-pointer hover:text-blue-600;
}
</style>
