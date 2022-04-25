<template>
  <div
    class="base-field"
    :class="labelAlign"
  >
    <BaseLabel
      v-if="!!label"
      :value="label"
      :class="labelWidth"
      :for="id"
    />
    <div
      class="relative"
      :class="inputWidth"
    >
      <div
        ref="inputWrapper"
        class="field-text"
        :class="inputWrapperCls"
      >
        <slot name="beforeItems" />
        <input
          v-bind="inputAttrs"
          :id="id"
          ref="inputEl"
          v-model="value"
          class="field-text-input"
          :class="inputCls"
          @click="onClickField"
          @focus="onFocusField"
          @blur="onBlurField"
          @input="onInputField"
        >
        <slot name="afterItems" />
      </div>
      <BaseIcon
        v-show="showErrors"
        :icon="Icon.AlertTriangle"
        class="text-red-800"
      >
        <ul>
          <li
            v-for="(fieldError, index) in fieldErrors"
            :key="index"
          >
            {{ fieldError }}
          </li>
        </ul>
      </BaseIcon>
    </div>
  </div>
</template>

<script>
import {
  useFieldRules,
  useInputAttrs,
} from "ui/composables/BaseField.js";
import { useField } from "vee-validate";
import {
  computed,
  nextTick,
  ref,
  watch,
} from "vue";
import { parseString, Enum } from "@incutonez/shared";
import {
  BaseLabel,
  BaseIcon,
} from "ui/index.js";

/**
 * @property {String} Left
 * @property {String} Right
 * @property {String} Top
 * @property {String} Down
 */
export const FieldLabelAlign = new Enum(["left", "right", "top", "down"], false);

// TODO: Should probably generate guids instead, but this works for right now
let fieldCount = 1;
export default {
  name: "BaseField",
  components: {
    BaseLabel,
    BaseIcon,
  },
  emits: ["update:modelValue", "change:validity", "change:dirty", "click:field", "blur:field", "focus:field", "input:field"],
  props: {
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: String,
      default: "w-24",
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    inputType: {
      type: String,
      default: "text",
    },
    inputCls: {
      type: [Object, String],
      default: "w-full",
    },
    inputWidth: {
      type: String,
      default: "flex-1",
    },
    labelAlign: {
      type: String,
      default: FieldLabelAlign.Left,
    },
    required: {
      type: Boolean,
      default: false,
    },
    allowEmptyWhitespace: {
      type: Boolean,
      default: false,
    },
    minLength: {
      type: Number,
      default: undefined,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
    /**
     * Only used in number and date like fields.  We have to have it in here, so we can consume it
     * in the configuration methods that are called.  If we didn't have it, the value would always
     * be undefined.
     */
    minValue: {
      type: Number,
      default: undefined,
    },
    /**
     * Only used in number and date like fields.  We have to have it in here, so we can consume it
     * in the configuration methods that are called.  If we didn't have it, the value would always
     * be undefined.
     */
    maxValue: {
      type: Number,
      default: undefined,
    },
    /**
     * Only used in number like fields.  We have to have it in here, so we can consume it in the
     * configuration methods that are called.  If we didn't have it, the value would always be
     * undefined.
     */
    step: {
      type: Number,
      default: undefined,
    },
    validateOnInit: {
      type: Boolean,
      default: false,
    },
    inputAttrsCfg: {
      type: Function,
      default: (props) => {
        return {
          ...useInputAttrs(props),
          minlength: props.minLength,
          maxlength: props.maxLength,
        };
      },
    },
    rulesCfg: {
      type: Function,
      default: (props) => {
        return {
          ...useFieldRules(props),
          minLength: props.minLength ? [props.minLength] : false,
          maxLength: props.maxLength ? [props.maxLength] : false,
        };
      },
    },
    parseValue: {
      type: Function,
      default: parseString,
    },
    id: {
      type: String,
      default: () => `input-${fieldCount++}`,
    },
  },
  setup(props, { emit }) {
    const inputEl = ref(null);
    const inputWrapper = ref(null);
    const fieldRules = computed(() => props.rulesCfg(props));
    const field = useField(props.label || `field-${props.inputType}`, fieldRules, {
      initialValue: props.modelValue,
      validateOnMount: props.validateOnInit,
      type: props.inputType,
      checkedValue: true,
      uncheckedValue: false,
    });
    field.setTouched(props.validateOnInit);
    function updateValue(value) {
      emit("update:modelValue", value);
    }
    watch(computed(() => props.modelValue), (value) => {
      field.handleChange(value, false);
    });
    const inputWrapperCls = computed(() => {
      return {
        "field-invalid": field.meta.touched && field.meta.valid === false,
      };
    });
    watch(fieldRules, async(value) => {
      if (value) {
        // We have to wait for the field to receive its new rules before validating
        await nextTick();
        await field.validate();
      }
    });
    watch(computed(() => field.meta.valid), (valid) => {
      if (field.meta.touched) {
        emit("change:validity", valid);
      }
    });
    watch(computed(() => field.meta.dirty), (dirty) => {
      if (field.meta.touched) {
        emit("change:dirty", dirty);
      }
    });
    const fieldErrors = computed(() => field.errors.value);
    const showErrors = computed(() => field.meta.touched && fieldErrors.value.length);
    function onClickField(event) {
      emit("click:field", event);
    }
    function onInputField(event) {
      emit("input:field", event.target.value);
    }
    function onFocusField() {
      inputEl.value.select();
      emit("focus:field");
    }
    // We have to make sure that when we lose focus that we parse the value appropriately
    // TODO: How to prevent this from being called when clicking a combobox list item
    function onBlurField() {
      field.setTouched(true);
      const value = props.parseValue(props.modelValue);
      if (value !== props.modelValue) {
        updateValue(value);
      }
      field.validate();
      emit("blur:field");
    }
    const value = computed({
      get() {
        return field.value.value;
      },
      set(val) {
        updateValue(val);
      },
    });
    return {
      field,
      value,
      inputWrapper,
      inputWrapperCls,
      fieldErrors,
      showErrors,
      inputEl,
      onBlurField,
      onFocusField,
      onClickField,
      onInputField,
      inputAttrs: props.inputAttrsCfg(props),
    };
  },
};
</script>

<style scoped lang="scss">
.base-field {
  @apply flex;

  &.left {
    @apply flex-row;
  }
  &.left,
  &.right {
    @apply space-x-2;
  }
  &.right {
    @apply flex-row-reverse space-x-reverse;
  }
  &.top {
    @apply flex-col;
  }
  &.top,
  &.down {
    @apply space-y-1;
  }
  &.down {
    @apply flex-col-reverse space-y-reverse;
  }
}

:deep(.base-label) {
  @apply leading-6;
}

.field-text {
  @apply bg-slate-100 rounded-sm border border-gray-300 flex relative focus-within:outline-2 focus-within:outline focus-within:outline-blue-500;
  input:not([type='checkbox']) {
    @apply bg-transparent px-1;
    &:focus {
      @apply outline-none;
    }
  }
}

.field-invalid {
  @apply focus-within:outline-2 focus-within:outline focus-within:outline-red-500;
  &:not(:focus-within) {
    @apply border-red-500;
  }
}
</style>
