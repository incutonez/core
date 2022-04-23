<template>
  <BaseDialog
    title="Field ComboBox"
    class="header-blue"
  >
    <template #body>
      <section class="space-y-2 base-dialog-body">
        <FieldComboBox
          v-model="selectedName"
          label="Combo"
          :options="listOptions"
          value-field="name"
          :tags-position="tagPosition"
          :filter-selections="filterSelections"
          :multi-select="multiSelect"
        />
        <FieldCheckBox
          v-model="multiSelect"
          label="Multi Select"
        />
        <FieldCheckBox
          v-model="filterSelections"
          label="Filter Selections"
        />
        <FieldInteger
          v-model="tagPosition"
          label="Tag Position"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script>
import {
  FieldComboBox,
  FieldInteger,
  ComboBoxTagPositions,
  BaseDialog,
  FieldCheckBox,
} from "ui/index.js";
import {
  reactive,
  toRefs,
} from "vue";
import { names } from "shared/data/names.js";

export default {
  name: "FieldComboBoxView",
  components: {
    FieldCheckBox,
    BaseDialog,
    FieldInteger,
    FieldComboBox,
  },
  setup() {
    const state = reactive({
      selectedName: [1, 5],
      listOptions: names,
      tagPosition: ComboBoxTagPositions.Above,
      filterSelections: false,
      multiSelect: true,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
