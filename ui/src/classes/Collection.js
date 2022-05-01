/**
 * @typedef CollectionFilter
 * @property {String} property
 * @property {*} value
 * @property {Boolean} or
 * If this is set, then the previous filtered data will act as an OR instead of an AND, so it'll use
 * the same records that were used by the previous filter.
 */
import { isArray, isEmpty } from "@incutonez/shared/src/utilities.js";

const GroupId = "id";
const GroupDisplay = "display";
const SelectedCls = "list-item-selected";
const UpdateFields = ["grouper", "records", "filters"];
export class Collection extends Array {
  grouper = null;
  records = [];
  idField = "";
  displayField = "";
  isCollection = true;
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
    if (clear) {
      this.clear();
    }
    if (isEmpty(data)) {
      return;
    }
    data = isArray(data) ? data : [data];
    data.forEach((item) => this.push(item));
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
    const { grouper, idField, displayField, filters } = this;
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
        this.add(group);
      }
    }
    else {
      this.add(records);
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
