<template>
  <FieldText
    ref="fieldEl"
    v-bind="$props"
    v-model="displayValue"
    @click:field="onClickField"
  >
    <template #beforeItems>
      <ul v-if="multiSelect">
        <li
          v-for="(item, index) in selection"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </template>
    <template #afterItems>
      <IconBase
        class="box-border pr-2 text-xs leading-6 cursor-pointer"
        :icon="Icons.PICKER_DOWN"
        @click="onClickPicker"
      />
      <slot
        name="list"
        :expanded="isExpanded"
        :options="options"
        :value-field="valueField"
        :selection="selection"
      >
        <ListBase
          v-show="isExpanded"
          v-model="selection"
          class="absolute z-10 w-full h-36 indent-px bg-white shadow"
          :options="options"
          :value-field="valueField"
        />
      </slot>
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
  watchEffect,
} from "vue";
import ListBase from "ui/ListBase.vue";

/**
 * Implementation concept taken from Atlassian
 * Reference: https://atlassian.design/components/select/examples
 */
export default {
  name: "FieldComboBox",
  components: {
    ListBase,
    IconBase,
    FieldText,
  },
  emits: ["update:expanded", "update:modelValue"],
  props: {
    modelValue: {
      type: [String, Number],
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
    const selection = ref(props.options?.find((item) => item[props.idField] === props.modelValue));
    const isExpanded = ref(props.expanded);
    const displayValue = ref(null);
    watchEffect(() => {
      const value = props.modelValue;
      const foundRecord = props.options?.find((item) => item[props.idField] === value);
      selection.value = foundRecord;
      displayValue.value = foundRecord?.[props.valueField];
    });
    // Watch on the selection... this changes when a selection is made
    watch(() => selection.value, (value) => {
      emit("update:modelValue", value?.[props.idField]);
      updateExpanded(false);
    });
    // Watch on the modelValue... this changes when the value is set outside of this component
    watch(() => props.modelValue, (value) => {
      emit("update:modelValue", value);
      updateExpanded(false);
    });
    watch(() => props.expanded, (value) => {
      updateExpanded(value);
    });
    function updateExpanded(value = !isExpanded.value) {
      emit("update:expanded", value);
      isExpanded.value = value;
    }
    function onBlurField() {
      updateExpanded(false);
    }
    function onClickField() {
      updateExpanded();
    }
    function onClickPicker() {
      updateExpanded();
    }
    function onClickDocument(event) {
      if (!fieldEl.value.$el.contains(event.target)) {
        updateExpanded(false);
      }
    }
    onMounted(() => {
      document.addEventListener("click", onClickDocument);
    });
    onUnmounted(() => {
      document.removeEventListener("click", onClickDocument);
    });
    return {
      Icons,
      selection,
      onClickPicker,
      onClickField,
      onBlurField,
      isExpanded,
      fieldEl,
      displayValue,
    };
  },
};
</script>
