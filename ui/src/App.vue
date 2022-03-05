<template>
  <div class="flex flex-col justify-items-stretch space-y-4 max-w-xs h-full">
    <div class="bg-blue-100">
      Hi {{ record.fullName }}!
    </div>
    <select v-model="selectedTooltip">
      <option
        v-for="(position, index) in TooltipPositions.keys"
        :key="index"
      >
        {{ position }}
      </option>
    </select>
    <FieldComboBox
      label="Combo"
      :options="listOptions"
      value-field="name"
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
  TooltipPositions,
} from "ui/index.js";
import FieldComboBox from "ui/FieldComboBox.vue";
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
      tooltipPosition: TooltipPositions.MIDDLE,
      record: new TestModel({
        name: "John",
        date: new Date(),
      }),
      minLength: 4,
      maxLength: 50,
      minValue: 2,
      TooltipPositions,
      expand: true,
      listOptions: names,
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
  mounted() {
    console.log(this);
  },
  computed: {
    selectedTooltip: {
      get() {
        return this.tooltipPosition;
      },
      set(value) {
        console.log(value);
        this.tooltipPosition = value;
      },
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
