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
          display-field="name"
          :class="tagPosition"
          :filter-selections="filterSelections"
          :multi-select="multiSelect"
          :groups="groups"
          :group-field="groupField"
        />
        <FieldComboBox
          v-model="groupField"
          :options="groupFields"
          label="Group By"
        />
        <FieldCheckBox
          v-model="multiSelect"
          label="Multi Select"
        />
        <FieldCheckBox
          v-model="filterSelections"
          label="Filter Selections"
        />
        <FieldComboBox
          v-model="tagPosition"
          :options="ComboBoxTagPosition.options"
          label="Tag Position"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script>
import {
  FieldComboBox,
  ComboBoxTagPosition,
  BaseDialog,
  FieldCheckBox,
} from "ui/index.js";
import {
  computed,
  reactive,
  toRefs,
} from "vue";
import { names } from "@incutonez/shared/data/names.js";

export default {
  name: "FieldComboBoxView",
  components: {
    FieldCheckBox,
    BaseDialog,
    FieldComboBox,
  },
  setup() {
    const groups = computed(() => {
      const groupKey = state.groupField;
      return names.reduce((current, value) => {
        const id = value[groupKey];
        const group = current.find((item) => item.id === id);
        if (!group) {
          current.push({
            id,
          });
        }
        return current;
      }, []);
    });
    const groupFields = Object.keys(names[0]).map((name) => {
      return {
        id: name,
        value: name,
      };
    });
    const state = reactive({
      ComboBoxTagPosition,
      groups,
      groupFields,
      selectedName: [1, 5],
      listOptions: names,
      tagPosition: ComboBoxTagPosition.Above,
      filterSelections: false,
      multiSelect: true,
      groupField: "color",
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
