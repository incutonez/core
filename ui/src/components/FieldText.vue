<template>
  <div
    class="flex"
    :class="containerCls"
  >
    <BaseLabel
      :value="label"
      :class="labelWidth"
    />
    <div
      class="relative"
      :class="inputWidth"
    >
      <div
        class="field-text"
        :class="inputWrapperCls"
      >
        <slot name="beforeItems" />
        <input
          ref="inputEl"
          :value="value"
          class="field-text-input"
          :class="inputCls"
          v-bind="inputAttrs"
          @click="onClickField"
          @input="onInputField"
          @blur="onBlurField"
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
  useFieldCls,
  useFieldRules,
  useInputAttrs,
  useInputCls,
} from "ui/composables/BaseField.js";
import { useField } from "vee-validate";
import {
  computed,
  nextTick,
  ref,
  watch,
} from "vue";
import { parseString } from "shared/utilities.js";
import {
  BaseLabel,
  BaseIcon,
} from "ui/index.js";

export default {
  name: "FieldText",
  components: {
    BaseLabel,
    BaseIcon,
  },
  emits: ["update:modelValue", "change:validity", "change:dirty", "click:field", "blur:field"],
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
    inputWrapperClasses: {
      type: [Object, String],
      default: null,
    },
    inputWidth: {
      type: String,
      default: "flex-1",
    },
    labelAlign: {
      type: String,
      default: "left",
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
  },
  setup(props, { emit }) {
    const inputEl = ref(null);
    const fieldRules = computed(() => props.rulesCfg(props));
    const field = useField(props.label || "field-text", fieldRules, {
      initialValue: props.modelValue,
      validateOnMount: props.validateOnInit,
    });
    field.setTouched(props.validateOnInit);
    function updateValue(value) {
      emit("update:modelValue", value);
    }
    watch(computed(() => props.modelValue), (value) => {
      field.handleChange(value, false);
    });
    const containerCls = computed(() => useFieldCls(props));
    const inputWrapperCls = computed(() => useInputCls(props, field));
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
    const showErrors = computed(() => {
      return field.meta.touched && fieldErrors.value.length;
    });
    function onClickField(event) {
      emit("click:field", event);
    }
    function onInputField(event) {
      updateValue(event.target.value);
    }
    // We have to make sure that when we lose focus that we parse the value appropriately
    function onBlurField() {
      field.setTouched(true);
      updateValue(props.parseValue(props.modelValue));
      field.validate();
      emit("blur:field");
    }
    return {
      field,
      containerCls,
      inputWrapperCls,
      fieldErrors,
      showErrors,
      inputEl,
      onInputField,
      onBlurField,
      onClickField,
      value: field.value,
      inputAttrs: props.inputAttrsCfg(props),
    };
  },
};
</script>

<style scoped lang="scss">
.label-horizontal {
  @apply space-x-2;
  &.flex-row-reverse {
    @apply space-x-reverse;
  }
  label {
    @apply leading-6;
  }
}
.label-vertical {
  @apply space-y-1;
  &.flex-col-reverse {
    @apply space-y-reverse;
  }
}

.field-text {
  @apply bg-slate-100 rounded-sm border border-gray-300 flex relative focus-within:outline-2 focus-within:outline focus-within:outline-blue-500;
  input {
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
