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
          @mousedown="onMouseDownField"
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

<script setup lang="ts">
import { useFieldRules, useInputAttrs, useUniqueId } from "ui/composables/BaseField";
import { useField } from "vee-validate";
import { computed, nextTick, ref, watch } from "vue";
import { BaseLabel, BaseIcon, Icon } from "ui/index";
import { parseString } from "ui/utilities";
import { EnumLabelAlign } from "ui/statics/Enums";
import type { TFieldValue } from "ui/interfaces";

export interface IPropsBaseField {
  label?: string;
  labelWidth?: string;
  modelValue?: TFieldValue;
  inputType?: string;
  inputCls?: string | CSSStyleDeclaration;
  inputWidth?: string;
  labelAlign?: string;
  required?: boolean;
  allowEmptyWhitespace?: boolean;
  minLength?: number;
  maxLength?: number;
  /**
   * Only used in number and date like fields.  We have to have it in here, so we can consume it
   * in the configuration methods that are called.  If we didn't have it, the value would always
   * be undefined.
   */
  minValue?: number;
  /**
   * Only used in number and date like fields.  We have to have it in here, so we can consume it
   * in the configuration methods that are called.  If we didn't have it, the value would always
   * be undefined.
   */
  maxValue?: number;
  /**
   * Only used in number like fields.  We have to have it in here, so we can consume it in the
   * configuration methods that are called.  If we didn't have it, the value would always be
   * undefined.
   */
  step?: number;
  validateOnInit?: boolean;
  inputAttrsCfg?: (props: IPropsBaseField) => {};
  rulesCfg?: (props: IPropsBaseField) => {};
  parseValue?: (value: any) => TFieldValue;
  id?: string;
}

const props = withDefaults(defineProps<IPropsBaseField>(), {
  label: "",
  labelWidth: "w-24",
  modelValue: "",
  inputType: "text",
  inputCls: "w-full",
  inputWidth: "flex-1",
  labelAlign: EnumLabelAlign.Left,
  minLength: undefined,
  maxLength: undefined,
  minValue: undefined,
  maxValue: undefined,
  step: undefined,
  validateOnInit: false,
  inputAttrsCfg: (props: IPropsBaseField) => {
    return {
      ...useInputAttrs(props),
      minlength: props.minLength,
      maxlength: props.maxLength,
    };
  },
  rulesCfg: (props: IPropsBaseField) => {
    return {
      ...useFieldRules(props),
      minLength: props.minLength ? [props.minLength] : false,
      maxLength: props.maxLength ? [props.maxLength] : false,
    };
  },
  parseValue: parseString,
  id: `input-${useUniqueId()}`,
});
const emit = defineEmits(["update:modelValue", "change:validity", "change:dirty", "click:field", "blur:field", "focus:field", "input:field"]);
const inputAttrs = props.inputAttrsCfg(props);
const inputEl = ref<HTMLInputElement>();
const inputWrapper = ref(null);
const fieldRules = computed(() => props.rulesCfg(props));
const field = useField(props.label || `field-${props.inputType}`, fieldRules, {
  initialValue: props.modelValue,
  validateOnMount: props.validateOnInit,
  type: props.inputType,
  checkedValue: true,
  uncheckedValue: false,
});
const value = computed({
  get() {
    return field.value.value;
  },
  set(val) {
    updateValue(val);
  },
});
const inputWrapperCls = computed(() => {
  return {
    "field-invalid": field.meta.touched && !field.meta.valid,
  };
});
const fieldErrors = computed(() => field.errors.value);
const showErrors = computed(() => field.meta.touched && fieldErrors.value.length);

field.setTouched(props.validateOnInit);

function updateValue(value: TFieldValue) {
  emit("update:modelValue", value);
}
/**
 * We use mousedown here because we want it to be able to veto blurring of the field, and the
 * only way to do that is if we use mousedown
 */
function onMouseDownField(event: MouseEvent) {
  emit("click:field", event);
}
function onInputField(event: InputEvent) {
  emit("input:field", (event.target as HTMLInputElement).value);
}
function onFocusField() {
  inputEl.value?.select();
  emit("focus:field");
}
// We have to make sure that when we lose focus that we parse the value appropriately
function onBlurField() {
  field.setTouched(true);
  const value = props.parseValue(props.modelValue);
  if (value !== props.modelValue) {
    updateValue(value);
  }
  field.validate();
  emit("blur:field");
}
watch(fieldRules, async(value) => {
  if (value) {
    // We have to wait for the field to receive its new rules before validating
    await nextTick();
    await field.validate();
  }
});

watch(
  () => props.modelValue,
  (value) => field.handleChange(value, false),
);
watch(
  () => field.meta.valid,
  (valid) => {
    if (field.meta.touched) {
      emit("change:validity", valid);
    }
  },
);
watch(
  () => field.meta.dirty,
  (dirty) => {
    if (field.meta.touched) {
      emit("change:dirty", dirty);
    }
  },
);

defineExpose({
  inputWrapper,
});
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
  input:not([type="checkbox"]) {
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
