<template>
  <div
    class="flex"
    :class="containerCls"
  >
    <FieldLabel :value="label" />
    <input
      ref="inputEl"
      v-model="value"
      class="field-text"
      :class="inputCls"
      :type="inputType"
      :required="required"
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
  watchEffect,
} from "vue";
import { useField } from "vee-validate";

export default {
  name: "FieldText",
  components: {
    FieldLabel,
  },
  emits: ["update:modelValue", "validation:change"],
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
        "field-invalid": field.meta.valid === false,
      };
    });
    const fieldRules = computed(() => {
      return {
        required: props.required ? [inputEl] : false,
      };
    });
    const field = useField("test", fieldRules, {
      initialValue: props.modelValue,
    });
    watch(fieldRules, async (value) => {
      if (value) {
        // We have to wait for the field to receive its new rules before validating
        await nextTick();
        await field.validate();
      }
    });
    watchEffect(() => {
      emit("update:modelValue", field.value);
    });
    watchEffect(() => {
      emit("validation:change", field.meta.valid);
    });
    const fieldErrors = computed(() => {
      return field.errors.value;
    });
    return {
      value: field.value,
      containerCls,
      inputEl,
      inputCls,
      fieldErrors,
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
