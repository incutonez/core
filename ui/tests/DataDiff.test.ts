import { describe } from "vitest";

const Data = [[{
  field: "Blah",
  value: [{
    field: "Yo",
    value: 1,
    previous: 2,
    verb: 2,
  }, {
    field: "Hi",
    value: [{
      field: "Yes",
      value: 2,
      verb: 1,
    }, {
      field: "Nested",
      value: [{
        field: "Hi",
        value: 1,
        verb: 1,
      }],
    }],
  }],
}]];
describe("DataDiff", () => {
  it("Flattens", () => {

  });
});
