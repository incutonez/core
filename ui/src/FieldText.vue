<template>
  <div
    class="flex"
    :class="containerCls"
  >
    <FieldLabel :value="label" />
    <div>
      <input
        class="field-text"
        :value="value"
        :class="inputCls"
        v-bind="inputAttrs"
        @focus="onFocusField"
        @input="onInputField"
        @blur="onBlurField"
      >
      <IconBase
        :icon="Icons.ALERT_TRIANGLE"
        :tooltip="fieldErrors"
      />
    </div>
  </div>
</template>

<script>
import FieldLabel from "ui/FieldLabel.vue";
import {
  useFieldCls,
  useFieldRules,
  useInputAttrs,
  useInputCls,
} from "ui/composables/useBaseField.js";
import { useField } from "vee-validate";
import {
  computed,
  nextTick,
  watch,
} from "vue";
import { parseString } from "shared/utilities.js";
import Icons from "ui/Icons.js";
import IconBase from "ui/IconBase.vue";

export default {
  name: "FieldText",
  components: {
    IconBase,
    FieldLabel,
  },
  emits: ["update:modelValue", "change:validity", "change:dirty"],
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    inputType: {
      type: String,
      default: "text",
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
      default: true,
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
    inputHandler: {
      type: Function,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const fieldRules = computed(() => props.rulesCfg(props));
    const field = useField("test", fieldRules, {
      initialValue: props.modelValue,
      validateOnMount: props.validateOnInit,
    });
    function updateValue(value) {
      emit("update:modelValue", value);
    }
    watch(computed(() => props.modelValue), (value) => {
      field.setTouched(true);
      field.handleChange(value, false);
    });
    const containerCls = computed(() => useFieldCls(props));
    const inputCls = computed(() => useInputCls(props, field));
    watch(fieldRules, async (value) => {
      if (value) {
        // We have to wait for the field to receive its new rules before validating
        await nextTick();
        await field.validate();
      }
    });
    watch(computed(() => field.meta.valid), (valid) => {
      if (field.meta.touched || props.validateOnInit) {
        emit("change:validity", valid);
      }
    });
    watch(computed(() => field.meta.dirty), (dirty) => {
      if (field.meta.touched) {
        emit("change:dirty", dirty);
      }
    });
    const fieldErrors = computed(() => {
      return "<ul><li>" + field.errors.value.join("</li><li>") + "</li></ul>";
    });
    function onInputField(event) {
      updateValue(event.target.value);
    }
    function onFocusField() {
      field.setTouched(true);
    }
    // We have to make sure that when we lose focus that we parse the value appropriately
    function onBlurField() {
      updateValue(props.parseValue(props.modelValue));
    }
    return {
      field,
      containerCls,
      inputCls,
      fieldErrors,
      onInputField,
      onFocusField,
      onBlurField,
      value: field.value,
      inputAttrs: props.inputAttrsCfg(props),
      Icons,
    };
  },
};
</script>

<style scoped lang="scss">
.label-horizontal {
  @apply items-center space-x-2;
  &.flex-row-reverse {
    @apply space-x-reverse;
  }
}
.label-vertical {
  @apply space-y-1;
  &.flex-col-reverse {
    @apply space-y-reverse;
  }
}

.field-text {
  @apply pl-1 bg-slate-100 rounded-sm border;
}

.field-invalid {
  &:not(:focus) {
    @apply border-red-500;
  }
  &:focus {
    @apply outline-2 outline outline-red-500;
  }
}
</style>
