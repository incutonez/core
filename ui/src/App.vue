<template>
  <div class="bg-blue-100">
    Hi {{ record.fullName }}!
  </div>
  <FieldText
    v-model="record.name"
    label="Name"
    class="w-36"
    :required="isRequired"
    :min-length="minLength"
    :max-length="maxLength"
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
      record: new TestModel({
        name: "Jef",
        date: new Date(),
      }),
      minLength: 4,
      maxLength: 5,
      minValue: 2,
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
};
</script>

<style>
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
