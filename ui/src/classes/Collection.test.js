import {
  Collection,
  GroupKey,
} from "ui/classes/Collection.js";
import { names } from "shared/data/names.js";

describe("Collection Groups", () => {
  function checkGroup(group, keys, index) {
    const ids = keys[index];
    // Finally hit the actual records
    if (!ids) {
      return;
    }
    expect(ids.indexOf(group[GroupKey])).not.toEqual(-1);
    // expect(group.isGrouped).toEqual(true);
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
