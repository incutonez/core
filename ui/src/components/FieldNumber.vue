<template>
  <BaseField
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
  </BaseField>
</template>

<script setup lang="ts">
import { useFieldRules, useInputAttrs } from "ui/composables/BaseField";
import { BaseField } from "ui/index";
import type { IPropsBaseField } from "ui/interfaces";
import { parseNumber } from "ui/utilities";

export interface IPropsFieldNumber extends IPropsBaseField {
	step?: number;
	inputAttrsCfg?(props: IPropsBaseField): {};
	rulesCfg?(props: IPropsBaseField): {};
}

withDefaults(defineProps<IPropsFieldNumber>(), {
	step: 0.01,
	inputAttrsCfg: (props: IPropsFieldNumber) => {
		return {
			...useInputAttrs(props),
			min: props.minValue,
			max: props.maxValue,
			step: props.step,
		};
	},
	rulesCfg: (props: IPropsFieldNumber) => {
		return {
			...useFieldRules(props),
			minValue: props.minValue ? [props.minValue] : false,
			maxValue: props.maxValue ? [props.maxValue] : false,
		};
	},
});
</script>
