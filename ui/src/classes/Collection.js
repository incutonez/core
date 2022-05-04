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
  commonSort,
} from "@incutonez/shared/src/utilities.js";

export const GroupKey = "groupKey";
export const GroupDisplay = "groupDisplay";
const SelectedCls = "list-item-selected";

export class Collection extends Array {
  isCollection = true;
  _idField = "";
  _displayField = "";
  _records = [];
  _groups = null;
  /**
   * @type {CollectionFilter[]}
   */
  _filters = [];
  parent = null;
  [GroupKey] = null;
  [GroupDisplay] = null;

  constructor(args) {
    super();
    // We always need a reference to the raw source, as that's how we'll be able to build the records
    if (isArray(args)) {
      this.records = args;
    }
    else {
      Object.assign(this, args);
    }
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
    this.init();
  }

  set filters(filters) {
    this._filters = filters;
    this.init();
  }

  get filters() {
    return this._filters;
  }

  set records(records) {
    this._records = records;
    this.init();
  }

  get records() {
    return this._records;
  }

  set groups(groups) {
    if (isEmpty(groups)) {
      this[GroupKey] = null;
    }
    else if (isObject(groups)) {
      groups = [groups];
    }
    this._groups = groups;
    this.init();
  }

  get groups() {
    return this._groups;
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

  // TODOJEF: I think this might need to return the records instead of setting them?
  // This is so we can use the else portion of init and just push them on... maybe?
  group({ key, display }, records = this.records) {
    /* We clear because the previous values for this collection could erroneously be the actual data records,
     * but we don't want to be dealing with those at this point, which is why we use the raw records loop */
    this.clear();
    const groups = {};
    records.forEach((record) => {
      const groupKey = record[key];
      const group = groups[groupKey];
      if (group) {
        group.records.push(record);
      }
      else {
        groups[groupKey] = {
          [GroupKey]: groupKey,
          records: [record],
        };
      }
    });
    for (const { [GroupKey]: groupKey, records } of Object.values(groups)) {
      const group = new Collection({
        records,
        parent: this,
      });
      group[GroupDisplay] = display ? display(group) : groupKey;
      this[GroupKey] = key;
      this.push(group);
    }
    this.sort((lhs, rhs) => commonSort(lhs[GroupKey], rhs[GroupKey]));
  }

  // TODOJEF: When this is called, we shouldn't re-group if the groups didn't change... instead, we should
  // be looking at each group?
  init() {
    const { groups, filters } = this;
    let { records } = this;
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
    if (groups) {
      let source = this;
      for (let i = 0; i < groups.length; i++) {
        // Create the initial groups
        if (i === 0) {
          this.group(groups[i], records);
        }
        else {
          let nextSource = [];
          source.forEach((collection) => {
            collection.group(groups[i]);
            nextSource = nextSource.concat(collection);
          });
          source = nextSource;
        }
      }
    }
    else {
      this.clear();
      records.forEach((record) => this.push(record));
    }
  }

  get idField() {
    return this.parent?.idField || this._idField;
  }

  set idField(value) {
    this._idField = value;
  }

  get displayField() {
    return this.parent?.displayField || this._displayField;
  }

  set displayField(value) {
    this._displayField = value;
  }

  get isGrouped() {
    return !isEmpty(this[GroupKey]);
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option) {
    return isArray(option) ? option[GroupDisplay] : option[this.idField];
  }

  getOptionDisplay(option) {
    // If the option is an array, it's assumed it's a collection, and we're accessing the group name
    return isArray(option) ? option[GroupDisplay] : option[this.displayField];
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
