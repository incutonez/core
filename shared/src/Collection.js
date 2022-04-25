import {
  isArray,
  isEmpty,
  Model,
} from "@incutonez/shared";

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
    data = isArray(data) ? data : [data];
    data.forEach((item) => {
      if (item.isModel) {
        this.push(item);
      }
      else {
        this.push(new this.model(item));
      }
    });
  }

  remove(records) {
    if (isEmpty(records)) {
      return;
    }
    records = isArray(records) ? records : [records];
    records.forEach((record) => {
      const foundIndex = this.indexOf(record);
      if (foundIndex !== -1) {
        this.splice(foundIndex, 1);
      }
    });
  }

  getData(options) {
    const data = [];
    this.forEach((record) => data.push(record.getData(options)));
    return data;
  }

  sum(field) {
    return this.reduce((value, currentValue) => value + currentValue[field]);
  }

  clone() {
    return new this.constructor(this.getData(), this.model);
  }

  clearFilters() {
    this.filters = [];
    this.add(this._dataSource, true);
    this._dataSource = null;
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
    filters = isArray(filters) ? filters : [filters];
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
      source.forEach((record) => {
        if (filterFn(record)) {
          data.push(record);
        }
      });
    });
    this.add(data, true);
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
