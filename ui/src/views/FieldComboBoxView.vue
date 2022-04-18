<template>
  <BaseDialog>
    <template #body>
      <section class="flex-1">
        <FieldComboBox
          v-model="selectedName"
          multi-select
          label="Combo"
          :options="listOptions"
          value-field="name"
          :tags-position="tagPosition"
          :filter-selections="filterSelections"
        />
        <input
          v-model="filterSelections"
          type="checkbox"
        >
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
} from "ui/index.js";
import {
  reactive,
  toRefs,
} from "vue";
import { names } from "shared/data/names.js";

export default {
  name: "FieldComboBoxView",
  components: {
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
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
