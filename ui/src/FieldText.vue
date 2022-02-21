<template>
  <div
    class="flex"
    :class="containerCls"
  >
    <FieldLabel :value="label" />
    <input
      ref="inputEl"
      class="field-text"
      :value="value"
      :class="inputCls"
      :type="inputType"
      :required="required"
      :minlength="minLength"
      :maxlength="maxLength"
      @focus="onFocusField"
      @input="onInputField"
    >
    <div
      v-for="(fieldError, index) in fieldErrors"
      :key="index"
    >
      {{ fieldError }}
    </div>
  </div>
</template>

<script>
import FieldLabel from "ui/FieldLabel.vue";
import {
  computed,
  nextTick,
  ref,
  watch,
} from "vue";
import { useField } from "vee-validate";

export default {
  name: "FieldText",
  components: {
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
      default: null,
    },
    maxLength: {
      type: Number,
      default: null,
    },
    validateOnInit: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const inputEl = ref(null);
    const containerCls = computed(() => {
      const { labelAlign } = props;
      return {
        "flex-col label-vertical": labelAlign === "top",
        "flex-row-reverse label-horizontal": labelAlign === "right",
        "flex-col-reverse label-vertical": labelAlign === "bottom",
        "flex-row label-horizontal": labelAlign === "left",
      };
    });
    const inputCls = computed(() => {
      return {
        "field-invalid": (field.meta.touched || props.validateOnInit) && field.meta.valid === false,
      };
    });
    const fieldRules = computed(() => {
      return {
        required: props.required ? [inputEl] : false,
        whitespace: !props.allowEmptyWhitespace,
        minLength: props.minLength ? [props.minLength] : false,
        maxLength: props.maxLength ? [props.maxLength] : false,
      };
    });
    const field = useField("test", fieldRules, {
      initialValue: props.modelValue,
      validateOnMount: props.validateOnInit,
    });
    watch(fieldRules, async (value) => {
      if (value) {
        // We have to wait for the field to receive its new rules before validating
        await nextTick();
        await field.validate();
      }
    });
    watch(computed(() => props.modelValue), (value) => {
      field.setTouched(true);
      field.handleChange(value, false);
      /* For some reason, let the call stack finish updating the input el before we validate, as
       * we require the input element's validity state to be updated */
      setTimeout(() => {
        field.validate();
      });
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
      return field.errors.value;
    });
    function onInputField(event) {
      emit("update:modelValue", event.target.value);
    }
    function onFocusField() {
      field.setTouched(true);
    }
    return {
      value: field.value,
      containerCls,
      inputEl,
      inputCls,
      fieldErrors,
      onFocusField,
      onInputField,
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
