<template>
  <BaseDialog
    title="Field ComboBox"
    class="header-blue"
  >
    <template #body>
      <section class="base-dialog-body space-y-2">
        <FieldComboBox
          v-model="selectedName"
          label="Combo"
          :options="listOptions"
          :display-field="displayField"
          :class="tagPosition"
          :filter-selections="filterSelections"
          :multi-select="multiSelect"
          :groups="groups"
          list-height="16rem"
        >
          <template #listAfter>
            <div class="sticky bottom-0 flex border-t border-gray-300 bg-white p-2">
              <span>Content after</span>
              <BaseField />
            </div>
          </template>
        </FieldComboBox>
        <FieldComboBox
          v-model="displayField"
          label="Display Field"
          :options="displayFields"
        />
        <FieldComboBox
          v-model="groupField"
          :options="displayFields"
          label="Group By"
          list-height="auto"
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
          list-height="auto"
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
  BaseField,
} from "ui/index";
import {
  computed,
  reactive,
  ref,
  toRefs,
} from "vue";
import { names } from "ui/data/names.js";
import { Collection } from "ui/Collection.js";

export default {
  name: "FieldComboBoxView",
  components: {
    BaseField,
    FieldCheckBox,
    BaseDialog,
    FieldComboBox,
  },
  setup() {
    const groupField = ref("color");
    const groups = computed(() => {
      const key = groupField.value;
      return key ? [{
        key,
      }] : null;
    });
    const displayFields = Object.keys(names[0]).map((name) => {
      return {
        id: name,
        value: name,
      };
    });
    const displayField = ref("name");
    const state = reactive({
      ComboBoxTagPosition,
      groups,
      displayFields,
      groupField,
      selectedName: [1, 5],
      listOptions: new Collection({
        records: names,
        displayField,
        sorters: [{
          property: displayField.value,
        }],
      }),
      tagPosition: ComboBoxTagPosition.Above,
      filterSelections: false,
      multiSelect: true,
    });

    return {
      ...toRefs(state),
      displayField,
    };
  },
};
</script>
