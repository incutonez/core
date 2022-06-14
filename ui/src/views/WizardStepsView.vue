<template>
  <BaseDialog
    title="Field Text"
    class="header-blue"
  >
    <template #body>
      <div class="flex justify-center">
        <ul class="wizard-steps">
          <WizardStep
            v-model="firstStep.state"
            :index="firstStep.index"
            :title="firstStep.title"
            @click:step="onClickStep(firstStep)"
          />
          <WizardStep
            v-model="secondStep.state"
            :index="secondStep.index"
            :title="secondStep.title"
            @click:step="onClickStep(secondStep)"
          />
          <WizardStep
            v-model="thirdStep.state"
            :index="thirdStep.index"
            :title="thirdStep.title"
            @click:step="onClickStep(thirdStep)"
          />
        </ul>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import {
  BaseDialog,
} from "ui/index.js";
import WizardStep, { StepState } from "ui/components/WizardStep.vue";
import {
  reactive,
  ref,
  watch,
} from "vue";

export default {
  name: "WizardStepsView",
  components: {
    WizardStep,
    BaseDialog,
  },
  setup() {
    const firstStep = reactive({
      index: 1,
      title: "This is One",
      state: StepState.Active,
    });
    const secondStep = reactive({
      index: 2,
      title: "This is the 2nd One",
      state: StepState.Enabled,
    });
    const thirdStep = reactive({
      index: 3,
      title: "This is the 3rd One with some long text",
      state: StepState.Enabled,
    });
    const activeStep = ref(firstStep);
    function onClickStep(step) {
      activeStep.value = step;
    }
    watch(activeStep, (current, previous) => {
      if (previous) {
        previous.state = previous.state === StepState.InvalidActive ? StepState.Invalid : StepState.Completed;
      }
    });
    return {
      firstStep,
      secondStep,
      thirdStep,
      onClickStep,
    };
  },
};
</script>

<style scoped>
.wizard-steps {
  @apply flex z-10 overflow-auto;
}
</style>
