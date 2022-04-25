import json from "@incutonez/shared/data.js";
import { TestModel } from "@incutonez/shared/models/TestModel.js";

describe("Collection Filter", () => {
  test("Adding Single Filter", () => {
    const record = new TestModel(json);
    record.collection.addFilters({
      name: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    });
    expect(record.collection.length).toEqual(9);
  });
  test("Adding Multiple Filters", () => {
    const record = new TestModel(json);
    record.collection.addFilters([{
      name: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      name: "S",
      property: "name",
      value: "s",
    }]);
    expect(record.collection.length).toEqual(4);
  });
  test("Removing Filters 1x1", () => {
    const record = new TestModel(json);
    record.collection.addFilters([{
      name: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      name: "S",
      property: "name",
      value: "s",
      exact: true,
    }]);
    expect(record.collection.length).toEqual(0);
    record.collection.removeFilters("S");
    expect(record.collection.length).toEqual(9);
    record.collection.removeFilters("A");
    expect(record.collection.length).toEqual(15);
  });
  test("Removing Filters Bulk", () => {
    const record = new TestModel(json);
    record.collection.addFilters([{
      name: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      name: "S",
      property: "name",
      value: "s",
      exact: true,
    }]);
    expect(record.collection.length).toEqual(0);
    record.collection.removeFilters(["S", "A"]);
    expect(record.collection.length).toEqual(15);
  });
});

describe("Adding/Removing Records", () => {
  const record = new TestModel();
  test("Adding", () => {
    record.collection.add({
      name: "Blah",
    });
    expect(record.collection.length).toEqual(1);
    record.collection.add([{
      name: "Blah",
    }, {
      name: "Blah",
    }]);
    expect(record.collection.length).toEqual(3);
  });
  test("Removing", () => {
    record.collection.remove(record.collection.last);
    expect(record.collection.length).toEqual(2);
    record.collection.remove([record.collection.last, record.collection.first]);
    expect(record.collection.length).toEqual(0);
  });
});
