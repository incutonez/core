import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import { Model } from "shared/Model.js";

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
   * @typedef CollectionFilter
   * @property {String} name
   * @property {String} property
   * @property {*} value
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
    const data = [];
    this.filters = this.filters.concat(filters);
    filters.forEach((filter) => {
      if (filter.fn) {
        this.forEach((record) => {
          if (filter.fn(record)) {
            data.push(record);
          }
        });
      }
      else {
        const { property, value } = filter;
        this.forEach((record) => {
          if (record[property] === value) {
            data.push(record);
          }
        });
      }
    });
    this.add(data, true);
  }
}
