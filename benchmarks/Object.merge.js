// Which is faster... const obj = Object.assign({}, mergeObj) or const object = {...mergeObj}
import Benchmark from "benchmark";

const data = {
  one: 1,
  two: 2,
  three: 3,
};
const suite = new Benchmark.Suite("Object.merge");
suite.add("Spread", () => {
  return {
    ...data,
  };
});
suite.add("Object.assign", () => {
  return Object.assign({}, data);
});
suite.add("for in", () => {
  const clone = {};
  for (const key in data) {
    clone[key] = data[key];
  }
  return clone;
});
suite.on("complete", function() {
  console.log(this.filter("fastest").map("name"));
});
suite.run({
  async: true,
});
