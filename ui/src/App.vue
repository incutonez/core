<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex overflow-scroll flex-col flex-1 justify-items-stretch space-y-4 max-w-xs">
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
    <footer>
      <BaseButtonMenu
        text="Start"
        class="rounded default lg"
        list-cls="h-64 overflow-auto"
        :menu-options="componentOptions"
        menu-value-field="name"
      />
    </footer>
  </div>
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";
import { names } from "shared/data/names.js";
import {
  FieldComboBox,
  FieldCurrency,
  FieldInteger,
  FieldNumber,
  FieldPercent,
  FieldText,
  ComboBoxTagPositions,
  BaseButtonMenu,
} from "ui/index.js";
import {
  reactive,
  toRefs,
} from "vue";

const ComponentList = ["Button", "Menu", "Icon", "Items", "Label", "List", "Overlay", "Tooltip", "FieldComboBox", "FieldCurrency", "FieldInteger", "FieldNumber", "FieldPercent", "FieldText", "FieldYear"];
export default {
  name: "App",
  components: {
    BaseButtonMenu,
    FieldPercent,
    FieldCurrency,
    FieldNumber,
    FieldText,
    FieldInteger,
    FieldComboBox,
  },
  setup() {
    const state = reactive({
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
      componentOptions: ComponentList.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      }),
    });
    function onChangeValidity() {
      console.log("onChangeValidity");
    }
    function onChangeDirty() {
      console.log("onChangeDirty");
    }

    return {
      ...toRefs(state),
      onChangeValidity,
      onChangeDirty,
    };
  },
};
</script>
