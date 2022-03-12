<template>
  <div class="flex flex-col justify-items-stretch space-y-4 max-w-xs h-full">
    <div class="bg-blue-100">
      Hi {{ record.fullName }}!
    </div>
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
    <FieldText
      v-model="record.name"
      label="Name"
      :required="isRequired"
      :min-length="minLength"
      :max-length="maxLength"
      @change:validity="onChangeValidity"
      @change:dirty="onChangeDirty"
    />
    <FieldInteger
      v-model="record.int"
      label="Integer"
      :required="isRequired"
      :min-value="minValue"
    />
    <FieldNumber
      v-model="record.decimal"
      label="Decimal"
      :min-value="minValue"
    />
    <FieldCurrency
      v-model="record.decimal"
      label="Currency"
    />
    <FieldPercent
      v-model="record.decimal"
      label="Percent"
      input-width="w-14"
    />
  </div>
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";
import {
  FieldCurrency,
  FieldInteger,
  FieldNumber,
  FieldPercent,
  FieldText,
} from "ui/index.js";
import FieldComboBox, { ComboBoxTagPositions } from "ui/FieldComboBox.vue";
import { names } from "shared/data/names.js";

export default {
  name: "App",
  components: {
    FieldComboBox,
    FieldPercent,
    FieldCurrency,
    FieldInteger,
    FieldNumber,
    FieldText,
  },
  data() {
    return {
      isRequired: true,
      record: new TestModel({
        name: "John",
        date: new Date(),
      }),
      minLength: 4,
      maxLength: 50,
      minValue: 2,
      expand: true,
      listOptions: names,
      selectedName: [1, 5],
      tagPosition: ComboBoxTagPositions.Above,
      filterSelections: false,
    };
  },
  methods: {
    onChangeValidity() {
      console.log("onChangeValidity");
    },
    onChangeDirty() {
      console.log("onChangeDirty");
    },
  },
};
</script>

<style>
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
