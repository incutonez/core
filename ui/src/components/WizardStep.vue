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

<script>
import { computed } from "vue";
import BaseIcon from "ui/components/BaseIcon.vue";

export const StepState = {
  Disabled: 0,
  Enabled: 1,
  Active: 2,
  Invalid: 3,
  InvalidActive: 4,
  Completed: 5,
};
const InvalidClickStates = [StepState.Disabled, StepState.Active, StepState.InvalidActive];
export default {
  name: "WizardStep",
  components: {
    BaseIcon,
  },
  emits: ["click:step", "update:modelValue"],
  props: {
    modelValue: {
      type: Number,
      default: StepState.Disabled,
    },
    index: {
      type: [String, Number],
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const cssClass = computed(() => {
      let css = "";
      switch (props.modelValue) {
        case StepState.Disabled:
          css = "disabled";
          break;
        case StepState.Enabled:
          css = "enabled";
          break;
        case StepState.Active:
          css = "active";
          break;
        case StepState.Invalid:
          css = "invalid";
          break;
        case StepState.InvalidActive:
          css = "active invalid";
          break;
        case StepState.Completed:
          css = "completed";
          break;
      }
      return css;
    });
    const isCompleted = computed(() => props.modelValue === StepState.Completed);
    const isInvalid = computed(() => props.modelValue === StepState.Invalid);
    function onClickStep() {
      const { modelValue } = props;
      if (InvalidClickStates.indexOf(modelValue) !== -1) {
        return;
      }
      emit("update:modelValue", modelValue === StepState.Invalid ? StepState.InvalidActive : StepState.Active);
      emit("click:step");
    }
    return {
      cssClass,
      isCompleted,
      isInvalid,
      onClickStep,
    };
  },
};
</script>

<style lang="scss">
.wizard-step {
  @apply flex flex-1 flex-col items-center cursor-pointer relative;
  min-width: 192px;

  &:not(:first-child) {
    @apply w-48;
    &::before {
      content: '';
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
