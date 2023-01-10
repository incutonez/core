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
          :options="EnumTagPosition.options"
          label="Tag Position"
          list-height="auto"
        />
      </section>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import {
  FieldComboBox,
  BaseDialog,
  FieldCheckBox,
  BaseField,
} from "ui/index";
import {
  computed,
  reactive,
  ref,
} from "vue";
import { names } from "ui/statics/names";
import { Collection } from "ui/classes";
import { EnumProp, EnumTagPosition } from "ui/statics/Enums";

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
const selectedName = reactive([1, 5]);
const listOptions = reactive(new Collection({
  [EnumProp.Data]: names,
  [EnumProp.Sorters]: [{
    property: displayField.value,
  }],
}));
const tagPosition = ref(EnumTagPosition.Above);
const filterSelections = ref(false);
const multiSelect = ref(true);
</script>
