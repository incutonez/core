<template>
  <div class="bg-blue-100">
    Hi {{ record.fullName }}!
  </div>
</template>

<script>
import { TestModel } from "shared/models/TestModel.js";

export default {
  name: "App",
  data() {
    return {
      record: new TestModel(),
    };
  },
  mounted() {
    this.record.set({
      name: "Jef",
      date: "01/02/2022",
      bool: "false",
      int: "20.5",
      decimal: "20.556",
      array: [1, 2, 3],
      collection: [
        {
          name: "Child 1",
          date: "02/29/2022",
        },
      ],
      collection2: [
        {
          name: "Child 2",
          date: "02/20/2022",
        },
      ],
      model: {
        name: "Child 3",
        date: "02/29/2020",
      },
    });
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
