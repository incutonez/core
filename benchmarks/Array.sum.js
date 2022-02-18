import Benchmark from "benchmark";

const data = [1, 2, 3, 4];
const suite = new Benchmark.Suite("Array.sum");
suite.add("Array Reduce", () => {
  return data.reduce((total, item) => total + item);
});
suite.add("Array ForEach", () => {
  let total = 0;
  data.forEach((item) => total += item);
  return total;
});
suite.on("complete", function() {
  console.log(this.filter("fastest").map("name"));
});
suite.run({
  async: true,
});
