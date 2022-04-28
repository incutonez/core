import { isArray, isEmpty } from "@incutonez/shared/src/utilities.js";

const GroupId = "id";
const GroupDisplay = "display";
const SelectedCls = "list-item-selected";
export class Collection extends Array {
  grouper = null;
  records = [];
  idField = "";
  displayField = "";
  isCollection = true;

  constructor(args) {
    super();
    // We always need a reference to the raw source, as that's how we'll be able to build the records
    if (isArray(args)) {
      this.records = args;
    }
    else {
      Object.assign(this, args);
    }
    this.init();
    return new Proxy(this, {
      set: (target, prop, receiver) => {
        this[prop] = receiver;
        if (prop === "grouper" || prop === "records") {
          this.init();
        }
      },
    });
  }

  clear() {
    this.length = 0;
  }

  init() {
    const { grouper, records, idField, displayField } = this;
    this.clear();
    console.log("calling init");
    if (this.grouped) {
      const { groups, groupKey } = grouper;
      for (let group of groups) {
        group = {
          ...group,
        };
        const { [GroupId]: id } = group;
        const groupRecords = records.filter((record) => record[groupKey] === id);
        if (isEmpty(groupRecords)) {
          continue;
        }
        // If the display value wasn't specified, set it to the ID, so we have something
        group[GroupDisplay] ??= id;
        group.isGroup = true;
        group.records = new Collection({
          records: records.filter((record) => record[groupKey] === id),
          idField,
          displayField,
        });
        this.push(group);
      }
    }
    else {
      records.forEach((record) => {
        this.push(record);
      });
    }
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option) {
    return this.grouped ? option[GroupId] : option[this.idField];
  }

  getOptionDisplay(option) {
    return this.grouped ? option[GroupDisplay] : option[this.displayField];
  }

  getOptionCls(option, selections) {
    if (this.grouped) {
      return "group-wrapper";
    }
    const cls = ["list-item"];
    const { idField } = this;
    const value = option[idField];
    for (const selection of selections) {
      if (value === selection[idField]) {
        cls.push(SelectedCls);
        break;
      }
    }
    return cls;
  }

  get grouped() {
    return !isEmpty(this.grouper?.groups);
  }
}
