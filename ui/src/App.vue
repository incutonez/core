<template>
  <div class="bg-blue-100">
    Hi {{ record.fullName }}!
  </div>
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";
import json from "shared/data.js";

export default {
  name: "App",
  data() {
    return {
      record: new TestModel(),
    };
  },
  mounted() {
    this.record.set(json);
    console.log(this.record);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
