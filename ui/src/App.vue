<template>
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
  <FieldText
    v-model="record.int"
    label="Name"
    class="w-36"
    :required="isRequired"
    :min-length="minLength"
    :max-length="maxLength"
    :tooltip-position="tooltipPosition"
    @change:validity="onChangeValidity"
    @change:dirty="onChangeDirty"
  />
  <FieldInteger
    v-model="record.int"
    label="Integer"
    :min-value="minValue"
  />
  <FieldNumber
    v-model="record.decimal"
    label="Decimal"
    :min-value="minValue"
  />
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";
import FieldText from "ui/FieldText.vue";
import FieldNumber from "ui/FieldNumber.vue";
import FieldInteger from "ui/FieldInteger.vue";
import { TooltipPositions } from "ui/TooltipBase.vue";

export default {
  name: "App",
  components: {
    FieldInteger,
    FieldNumber,
    FieldText,
  },
  data() {
    return {
      isRequired: false,
      tooltipPosition: TooltipPositions.MIDDLE,
      record: new TestModel({
        name: "middle",
        date: new Date(),
      }),
      minLength: 4,
      maxLength: 50,
      minValue: 2,
      TooltipPositions,
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
