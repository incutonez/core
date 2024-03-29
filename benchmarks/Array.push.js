﻿import Benchmark from "benchmark";

const data = [1, 2, 3, 4];
const suite = new Benchmark.Suite("Array.push");
suite.add("Push Apply", () => {
  const arr = [];
  arr.push.apply(arr, data);
});
suite.add("In Place", () => {
  const arr = [];
  data.forEach((item) => arr.push(item));
});
suite.add("Spread", () => {
  const arr = [];
  arr.push(...data);
});
suite.add("Concat", () => {
  let arr = [];
  arr = arr.concat(data);
});
suite.on("complete", function() {
  console.log(this.filter("fastest").map("name"));
});
suite.run({
  async: true,
});
