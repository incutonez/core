import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import {
  Model,
} from "shared/Model.js";

export class Collection extends Array {
  isCollection = true;
  filters = [];
  _dataSource = null;

  constructor(data, model = Model) {
    super();
    if (!this.model) {
      this.model = model;
    }
    this.add(data);
  }

  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
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
    if (!isArray(data)) {
      data = [data];
    }
    data.map((item) => {
      if (item.isModel) {
        this.push(item);
      }
      else {
        this.push(new this.model(item));
      }
    });
  }

  getData(options) {
    const data = [];
    this.forEach((record) => data.push(record.getData(options)));
    return data;
  }

  clone() {
    return new this.constructor(this.getData(), this.model);
  }

  clearFilters() {
    this.filters = [];
    this.add(this._dataSource, true);
  }

  /**
   * @param {String|String[]} names
   */
  removeFilters(names) {
    if (!names) {
      return;
    }
    const filters = this.filters;
    names = isArray(names) ? names : [names];
    names.forEach((name) => {
      const found = filters.findIndex((filter) => filter.name === name);
      if (found !== -1) {
        filters.splice(found, 1);
      }
    });
    this.clearFilters();
    this.addFilters(filters);
  }

  /**
   * @typedef CollectionFilter
   * @property {String} name
   * @property {String} property
   * @property {*} value
   * @property {Boolean} [exact=false]
   * This is for checking to see if the value is contained in the search instead of exact match.
   * By default, it's not an exact match.
   * @property {Boolean} [insensitive=true]
   * This is for case sensitivity.
   * By default, it's a case insensitive search.
   * @property {Function} fn
   */
  /**
   * @param {CollectionFilter|CollectionFilter[]} filters
   */
  addFilters(filters) {
    if (isEmpty(filters)) {
      return;
    }
    // We're adding filters for the very first time, so let's set up a pointer to our base data
    if (isEmpty(this.filters)) {
      this._dataSource = this.slice();
    }
    if (!isArray(filters)) {
      filters = [filters];
    }
    this.filters = this.filters.concat(filters);
    let data = [];
    let source = this;
    filters.forEach((filter, index) => {
      // If we have multiple filters, we have to make some swaps
      if (index !== 0) {
        source = data;
        data = [];
      }
      let filterFn = filter.fn;
      if (!filterFn) {
        const { property, value, exact = false, insensitive = true } = filter;
        filterFn = (record) => {
          let recordValue = record[property];
          if (insensitive) {
            recordValue = recordValue?.toLowerCase();
          }
          return exact ? recordValue === value : recordValue?.includes(value);
        };
      }
      source.forEach((record) => {
        if (filterFn(record)) {
          data.push(record);
        }
      });
    });
    this.add(data, true);
  }
}
