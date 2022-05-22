/**
 * @typedef CollectionFilter
 * @property {String} property
 * @property {*} value
 * @property {Boolean} or
 * If this is set, then the previous filtered data will act as an OR instead of an AND, so it'll use
 * the same records that were used by the previous filter.
 */
/**
 * @typedef CollectionSorter
 * If this is passed in as a function, then none of these properties are used, as it's then up to the dev
 * to modify the function.
 * @property {String} property
 * @property {Number} direction
 * This can be 1 or -1... 1 is DESC and -1 is ASC
 */
import {
  isArray,
  isEmpty,
  isObject,
  commonSort,
  makeArray,
} from "@incutonez/shared/src/utilities.js";
import { Model } from "@incutonez/shared/src/Model.js";

export const GroupKey = "groupKey";
export const GroupDisplay = "groupDisplay";
const SelectedCls = "list-item-selected";

export class Collection extends Array {
  isCollection = true;
  _idField = "id";
  _displayField = "value";
  _records = [];
  _groups = null;
  /**
   * @type {CollectionFilter[]}
   */
  _filters = [];
  /**
   * @type {CollectionSorter[]}
   */
  _sorters = [];
  parent = null;
  [GroupKey] = null;
  [GroupDisplay] = null;

  constructor(args, model = Model) {
    super();
    args ??= {};
    // We need this set, so our Object.assign doesn't kick off multiple inits when each property is set
    this.suspend(true);
    this.model = args.model || model;
    delete args.model;
    // We always need a reference to the raw source, as that's how we'll be able to build the records
    if (isArray(args)) {
      this.records = args;
    }
    else {
      Object.assign(this, args);
    }
    this.suspend();
    // No inits should have fired, and we're done with setting all values, so let's properly init now
    this.init();
  }

  clear() {
    this.length = 0;
  }

  /**
   * @param {Object|Object[]|Model|Model[]} data
   * @param {Object} options
   * @param {Boolean} options.clear
   * @param {Boolean} options.suppress
   */
  add(data, { clear = false, suppress = false } = {}) {
    if (isEmpty(data)) {
      return;
    }
    data = makeArray(data);
    this.suspend(suppress);
    this.records = clear ? data : this.records.concat(data);
    this.suspend();
  }

  clearFilters() {
    this.filters = [];
  }

  sum(field) {
    return this.records.reduce((value, currentValue) => value + currentValue[field]);
  }

  addFilters(filters, { suppress = false } = {}) {
    if (isEmpty(filters)) {
      return;
    }
    filters = makeArray(filters);
    this.suspend(suppress);
    this.filters = this.filters.concat(filters);
    this.suspend();
  }

  /**
   * @param {String[]} filters
   * This is an array of filter IDs to remove... if an ID was not set when creating the filter, then
   * the index is used.
   * @param {Boolean} suppress
   * This value is to signify whether you want the re-initialization of the collection to take place, which
   * will update the filtering... if this is false, it's most likely a scenario where we want to remove
   * filters and add some new ones on in succession, so we don't want to do multiple inits.
   */
  removeFilters(filters, suppress) {
    if (isEmpty(filters)) {
      return;
    }
    filters = makeArray(filters);
    for (const filter of filters) {
      this.filters.remove(({ id }) => id === filter);
    }
    this.suspend(suppress);
    this.init();
    this.suspend();
  }

  /**
   * This will set a variable to indicate whether the init method should actually run the next time it's
   * called... this is useful for our custom setter methods because they call init, and it's possible
   * we're calling multiple setters in sequence, but we don't want each one to run the init
   * @param {Boolean} [value]
   */
  suspend(value) {
    this._suspended = value;
  }

  addSorters(sorters, { suppress = false } = {}) {
    if (isEmpty(sorters)) {
      return;
    }
    sorters = makeArray(sorters);
    this.suspend(suppress);
    this.sorters = this.sorters.concat(sorters);
    this.suspend();
  }

  /**
   * @param {String[]} sorters
   * This is an array of filter IDs to remove... if an ID was not set when creating the filter, then
   * the index is used.
   * @param {Boolean} suppress
   * This value is to signify whether you want the re-initialization of the collection to take place, which
   * will update the filtering... if this is false, it's most likely a scenario where we want to remove
   * filters and add some new ones on in succession, so we don't want to do multiple inits.
   */
  removeSorters(sorters, { suppress = false } = {}) {
    if (isEmpty(sorters)) {
      return;
    }
    sorters = makeArray(sorters);
    for (const sorter of sorters) {
      this.sorters.remove(({ id }) => id === sorter);
    }
    this.suspend(suppress);
    this.init();
    this.suspend();
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
    this.sort({
      property: GroupDisplay,
    }, false);
  }

  /**
   * This will find in the overall record set... it ignores filtering
   * @param {Function} fn
   * @returns {Model}
   */
  find(fn) {
    return this.records.find(fn);
  }

  sort(sorters = this.sorters, recordSort = true) {
    if (!sorters) {
      return;
    }
    sorters = makeArray(sorters);
    sorters.forEach((sorter) => {
      if (isObject(sorter)) {
        const { property, direction = -1 } = sorter;
        sorter = (lhs, rhs) => commonSort(lhs[property], rhs[property], direction);
      }
      // Either we're wanting to sort the raw data source
      if (recordSort) {
        this.records.sort(sorter);
      }
      // Or we're most likely wanting to sort the groups
      else {
        super.sort(sorter);
      }
    });
  }

  // TODOJEF: When this is called, we shouldn't re-group if the groups didn't change... instead, we should
  // be looking at each group?
  init() {
    if (this._suspended) {
      return;
    }
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
      this.sort();
    }
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option) {
    if (option) {
      return isArray(option) ? option[GroupDisplay] : option[this.idField];
    }
  }

  getOptionDisplay(option) {
    if (option) {
      // If the option is an array, it's assumed it's a collection, and we're accessing the group name
      return isArray(option) ? option[GroupDisplay] : option[this.displayField];
    }
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

  clone(options) {
    const { groups, idField, displayField, sorters, filters, model } = this;
    return new this.constructor({
      idField,
      displayField,
      groups,
      sorters,
      filters,
      model,
      records: this.getData(options),
    });
  }

  getData(options) {
    const data = [];
    this._visited = true;
    this.forEach((record) => {
      /* It's possible that the result that returns is an array because the record could potentially be
       * a collection, like if a grouping is applied, so let's turn the result into an array */
      const result = makeArray(record.getData(options));
      data.push(...result);
    });
    delete this._visited;
    return data;
  }

  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
  }

  set sorters(sorters) {
    sorters?.map((sorter, index) => {
      if (!sorter.id) {
        sorter.id = index;
      }
      return sorter;
    });
    this._sorters = sorters;
    this.sort();
  }

  get sorters() {
    return this._sorters;
  }

  set filters(filters) {
    filters?.map((filter, index) => {
      if (!filter.id) {
        filter.id = index;
      }
      return filter;
    });
    this._filters = filters;
    this.init();
  }

  get filters() {
    return this._filters;
  }

  set records(value) {
    const records = [];
    value.forEach((item) => {
      if (item.isModel) {
        records.push(item);
      }
      else {
        records.push(new this.model(item));
      }
    });
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

  /**
   * When using the native methods of an array that return a new array, like slice, map, filter, etc.,
   * we don't want to try and instantiate a new Collection, as we have a different constructor
   * signature, so we defer to using Array.  This is basically saying use any native methods that
   * return a new array AT YOUR OWN RISK.
   * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species#using_species
   */
  static get [Symbol.species]() {
    return Array;
  }
}
