/**
 * @typedef CollectionFilter
 * @property {String} property
 * @property {*} value
 * @property {Boolean} or
 * If this is set, then the previous filtered data will act as an OR instead of an AND, so it'll use
 * the same records that were used by the previous filter.
 */
import {
  isArray,
  isEmpty,
  isObject,
} from "@incutonez/shared/src/utilities.js";

const GroupKey = "key";
const GroupDisplay = "display";
const SelectedCls = "list-item-selected";
const UpdateFields = ["groups", "records", "filters"];

export class Collection extends Array {
  groups = null;
  records = [];
  idField = "";
  displayField = "";
  isCollection = true;
  isGrouped = false;
  /**
   * @type {CollectionFilter[]}
   */
  filters = [];

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
      set(target, prop, value, receiver) {
        if (prop === "groups" && value && isObject(value)) {
          value = [value];
        }
        target[prop] = value;
        if (UpdateFields.indexOf(prop) !== -1) {
          // We have to use receiver for some reason
          receiver.init();
        }
        return true;
      },
    });
  }

  clear() {
    this.length = 0;
  }

  add(data, clear = false) {
    if (isEmpty(data)) {
      return;
    }
    data = isArray(data) ? data : [data];
    this.records = clear ? data : this.records.concat(data);
  }

  clearFilters() {
    this.filters = [];
  }

  addFilters(filters) {
    if (isEmpty(filters)) {
      return;
    }
    filters = isArray(filters) ? filters : [filters];
    this.filters = this.filters.concat(filters);
  }

  init() {
    const { groups, filters } = this;
    let { records } = this;
    this.clear();
    if (!isEmpty(filters)) {
      let data = [];
      filters.forEach((filter, index) => {
        // If we have multiple filters, we have to make some swaps if the filter is not an OR
        if (!(index === 0 || filter.or)) {
          records = data;
          data = [];
        }
        let filterFn = filter.fn;
        if (!filterFn) {
          let { value } = filter;
          const { property, exact = false } = filter;
          if (!exact) {
            value = new RegExp(value, "i");
          }
          filterFn = (record) => {
            const recordValue = record[property];
            return exact ? recordValue === value : value.test(recordValue);
          };
        }
        records.forEach((record) => {
          if (filterFn(record)) {
            data.push(record);
          }
        });
      });
      records = data;
    }
    this.isGrouped = !!groups;
    if (groups) {
      for (let i = 0; i < groups.length; i++) {
        const { [GroupKey]: key, display } = groups[i];
        if (i === 0) {
          records.forEach((record) => {
            const groupKey = record[key];
            const foundGroup = this.find((groupRecord) => groupRecord[GroupKey] === groupKey);
            if (foundGroup) {
              foundGroup.records.push(record);
            }
            else {
              const groupedRecord = new Collection({
                [GroupKey]: groupKey,
                records: [record],
                display() {
                  return display ? display(groupedRecord) : groupKey;
                },
              });
              this.push(groupedRecord);
            }
          });
        }
        else {
          // TODOJEF: This works for 2 levels right now... make it work for n level groups
          this.forEach((group) => {
            const theGroups = [];
            group.records.forEach((record) => {
              const groupKey = record[key];
              const foundGroup = theGroups.find((groupRecord) => groupRecord[GroupKey] === groupKey);
              if (foundGroup) {
                foundGroup.add(record);
              }
              else {
                const groupedRecord = new Collection({
                  [GroupKey]: groupKey,
                  records: [record],
                  display() {
                    return display ? display(groupedRecord) : groupKey;
                  },
                });
                theGroups.push(groupedRecord);
              }
            });
            group.records = theGroups;
          });
        }
      }
    }
    else {
      records.forEach((record) => this.push(record));
    }
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option) {
    return this.isGrouped ? option[GroupKey] : option[this.idField];
  }

  getOptionDisplay(option) {
    return this.isGrouped ? option[GroupDisplay] : option[this.displayField];
  }

  getOptionCls(option, selections) {
    if (this.isGrouped) {
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
}
