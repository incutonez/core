<template>
  <FieldText
    ref="fieldEl"
    v-bind="$props"
    class="field-number"
    input-type="number"
    :parse-value="parseNumber"
    @keydown.down.prevent
    @keydown.up.prevent
    @wheel.prevent
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
  </FieldText>
</template>

<script>
import {
  useFieldRules,
  useInputAttrs,
} from "ui/composables/useBaseField.js";
import {
  parseNumber,
} from "shared/utilities.js";
import { FieldText } from "ui/index.js";

export default {
  name: "FieldNumber",
  components: {
    FieldText,
  },
  props: {
    step: {
      type: Number,
      default: 0.01,
    },
    inputAttrsCfg: {
      type: Function,
      default: (props) => {
        return {
          ...useInputAttrs(props),
          min: props.minValue,
          max: props.maxValue,
          step: props.step,
        };
      },
    },
    rulesCfg: {
      type: Function,
      default: (props) => {
        return {
          ...useFieldRules(props),
          minValue: props.minValue ? [props.minValue] : false,
          maxValue: props.maxValue ? [props.maxValue] : false,
        };
      },
    },
  },
  setup() {
    return {
      parseNumber,
    };
  },
};
</script>
