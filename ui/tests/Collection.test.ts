import "ui/overrides";
import { names, data } from "./data/names";
import { Collection } from "ui/classes/Collection";
import { Model } from "ui/classes/Model";
import { EnumProp } from "ui/statics/Enums";

class GroupModel extends Model {
  id = 0;
  name = "";
  email = "";
  gender = "";
  color = "";
  groupId = 0;

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

class TestModel extends Model {
  name = "";
  data = "";

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

describe("Collection Filter", () => {
  test("Adding Single Filter", () => {
    const collection = new Collection({
      [EnumProp.Data]: data.collection,
      [EnumProp.Model]: TestModel,
    });
    collection.addFilters({
      name: "A",
      fn(record) {
        return record.name.toLowerCase().includes("a");
      },
    });
    expect(collection.length).toEqual(9);
  });
  test("Adding Multiple Filters", () => {
    const collection = new Collection({
      [EnumProp.Data]: data.collection,
      [EnumProp.Model]: TestModel,
    });
    collection.addFilters([{
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
    expect(collection.length).toEqual(4);
  });
  test("Removing Filters 1x1", () => {
    const collection = new Collection({
      [EnumProp.Data]: data.collection,
      [EnumProp.Model]: TestModel,
    });
    collection.addFilters([{
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
    expect(collection.length).toEqual(0);
    collection.removeFilters("S");
    expect(collection.length).toEqual(9);
    collection.removeFilters("A");
    expect(collection.length).toEqual(15);
  });
  test("Removing Filters Bulk", () => {
    const collection = new Collection({
      [EnumProp.Data]: data.collection,
      [EnumProp.Model]: TestModel,
    });
    collection.addFilters([{
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
    expect(collection.length).toEqual(0);
    collection.removeFilters(["S", "A"]);
    expect(collection.length).toEqual(15);
  });
});

describe("Adding/Removing Records", () => {
  const collection = new Collection({
    [EnumProp.Model]: TestModel,
  });
  test("Adding", () => {
    collection.add({
      name: "Blah",
    });
    expect(collection.length).toEqual(1);
    collection.add([{
      name: "Blah",
    }, {
      name: "Blah",
    }]);
    expect(collection.length).toEqual(3);
  });
  test("Removing", () => {
    collection.remove(collection.last);
    expect(collection.length).toEqual(2);
    collection.remove([collection.last, collection.first]);
    expect(collection.length).toEqual(0);
  });
});

describe("Collection Groups", () => {
  function checkGroup(group, keys, index) {
    const ids = keys[index];
    // Finally hit the actual records
    if (!ids) {
      return;
    }
    expect(ids.indexOf(group[EnumProp.GroupDisplay])).not.toEqual(-1);
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
      [EnumProp.Model]: GroupModel,
      [EnumProp.Groups]: groups,
      [EnumProp.Data]: names,
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
