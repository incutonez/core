import json from "@incutonez/shared/data.js";
import { TestModel } from "@incutonez/shared/models/TestModel.js";
import { names } from "@incutonez/shared/data/names.js";
import {
  Collection,
  GroupDisplay,
} from "@incutonez/shared/src/Collection.js";

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
      id: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      id: "S",
      property: "name",
      value: "s",
    }]);
    expect(record.collection.length).toEqual(4);
  });
  test("Removing Filters 1x1", () => {
    const record = new TestModel(json);
    record.collection.addFilters([{
      id: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      id: "S",
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
      id: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    },
    {
      id: "S",
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

describe("Collection Groups", () => {
  function checkGroup(group, keys, index) {
    const ids = keys[index];
    // Finally hit the actual records
    if (!ids) {
      return;
    }
    expect(ids.indexOf(group[GroupDisplay])).not.toEqual(-1);
    expect(group.isGrouped).toEqual(keys.length - 1 !== index);
    group.forEach((record) => checkGroup(record, keys, index + 1));
  }

  test("Adding Single Group", () => {
    const groups = [{
      key: "gender",
    }, {
      key: "groupId",
    }, {
      key: "color",
    }];
    const collection = new Collection({
      groups,
      records: names,
    });
    const groupKeys = [];
    names.forEach((record) => {
      groups.forEach((group, index) => {
        let grouper = groupKeys[index];
        if (!grouper) {
          grouper = [];
          groupKeys.push(grouper);
        }
        if (grouper.indexOf(record[group.key]) === -1) {
          grouper.push(record[group.key]);
        }
      });
    });
    groupKeys.forEach((groupKey) => groupKey.sort());
    expect(groupKeys[0].length).toEqual(collection.length);
    collection.forEach((record) => checkGroup(record, groupKeys, 0));
  });
});
