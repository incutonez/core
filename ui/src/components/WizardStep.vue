<template>
  <li
    class="wizard-step"
    :class="cssClass"
    @click="onClickStep"
  >
    <div class="step-index">
      <BaseIcon
        v-if="isCompleted"
        :icon="Icon.Check"
      />
      <BaseIcon
        v-else-if="isInvalid"
        :icon="Icon.Close"
      />
      <span v-else>
        {{ index }}
      </span>
    </div>
    <span class="step-title">
      {{ title }}
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "ui/components/BaseIcon.vue";
import { EnumWizardStep } from "ui/statics/Enums";
import { Icon } from "ui/index";

export interface IPropsWizardStep {
	modelValue?: number;
	index?: string | number;
	title?: string;
}

const props = withDefaults(defineProps<IPropsWizardStep>(), {
	modelValue: EnumWizardStep.Disabled,
	index: "",
	title: "",
});
const emit = defineEmits(["click:step", "update:modelValue"]);
const InvalidClickStates = [EnumWizardStep.Disabled, EnumWizardStep.Active, EnumWizardStep.InvalidActive];
const isCompleted = computed(() => props.modelValue === EnumWizardStep.Completed);
const isInvalid = computed(() => props.modelValue === EnumWizardStep.Invalid);
const cssClass = computed(() => {
	let css = "";
	switch (props.modelValue) {
		case EnumWizardStep.Disabled:
			css = "disabled";
			break;
		case EnumWizardStep.Enabled:
			css = "enabled";
			break;
		case EnumWizardStep.Active:
			css = "active";
			break;
		case EnumWizardStep.Invalid:
			css = "invalid";
			break;
		case EnumWizardStep.InvalidActive:
			css = "active invalid";
			break;
		case EnumWizardStep.Completed:
			css = "completed";
			break;
	}
	return css;
});

function onClickStep() {
	const { modelValue } = props;
	if (InvalidClickStates.indexOf(modelValue) !== -1) {
		return;
	}
	emit("update:modelValue", modelValue === EnumWizardStep.Invalid ? EnumWizardStep.InvalidActive : EnumWizardStep.Active);
	emit("click:step");
}
</script>

<style lang="scss">
.wizard-step {
  @apply flex flex-1 flex-col items-center cursor-pointer relative;
  min-width: 192px;

  &:not(:first-child) {
    @apply w-48;
    &::before {
      content: "";
      z-index: -1;
      @apply bg-gray-300 absolute top-5 h-1 right-2/4 w-full;
    }
  }

  .step-index {
    @apply flex w-10 h-10 bg-gray-300 rounded-full items-center justify-center relative;
  }

  &.completed,
  &.active {
    > .step-index {
      @apply bg-blue-400 text-white;
    }

    &::before {
      @apply bg-blue-400;
    }
  }
}

.active {
  > .step-title {
    @apply text-blue-400;
  }
}

//https://christabor.github.io/css-progress-wizard/
.step-title {
  @apply text-gray-600 text-center mt-1;
}

.step-index,
.step-title {
  @apply font-semibold text-sm;
}
</style>
