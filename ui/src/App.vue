<template>
  <div class="bg-blue-100">
    Hi {{ record.fullName }}!
  </div>
  <div
    v-for="child in record.collection"
    :key="child.name"
  >
    {{ child.name }}
  </div>
  <FieldText
    v-model="record.name"
    label="Name"
    class="w-36"
    required
    :min-length="5"
    @change:validity="onChangeValidity"
    @change:dirty="onChangeDirty"
  />
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";
import FieldText from "ui/FieldText.vue";

export default {
  name: "App",
  components: {
    FieldText,
  },
  data() {
    return {
      isRequired: false,
      record: new TestModel({
        name: "Jef",
        date: new Date(),
      }),
    };
  },
  mounted() {
    console.log(this);
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
