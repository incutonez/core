import {
  isArray,
  isEmpty,
  isObject,
  commonSort,
  makeArray,
} from "@incutonez/shared/src/utilities";
import { Model } from "@incutonez/shared/src/Model.js";
import type {
  ICollectionFilter,
  ICollectionSorter,
  IModelGetData,
  ICollectionGroup,
  IModel,
  ICollectionAdd,
} from "@incutonez/shared/src/interfaces";
import { ClassField } from "ui/Enums";

// TODOJEF: Move to ModelField enum
export const GroupKey = "groupKey";
export const GroupDisplay = "groupDisplay";
export const ModelKey = "model";
const SelectedCls = "list-item-selected";

export class Collection extends Array {
  [ClassField.IsCollection] = true;
  _idField = "id";
  _displayField = "value";
  _records: any[] = [];
  _groups?: any[];
  /**
   * @type {CollectionFilter[]}
   */
  _filters: ICollectionFilter[] = [];
  /**
   * @type {CollectionSorter[]}
   */
  _sorters: (ICollectionSorter | Function)[] = [];
  _suspended = false;
  _visited = false;
  [ClassField.Parent]?: Collection;
  [GroupKey] = null;
  [GroupDisplay] = null;
  _model?: any;

  // TODO: Type out args
  constructor(args: any, model = Model) {
    super();
    args ??= {};
    // We need this set, so our Object.assign doesn't kick off multiple inits when each property is set
    this.suspend(true);
    if (!this[ModelKey]) {
      this[ModelKey] = args[ModelKey] || model;
    }
    delete args[ModelKey];
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
  add(data: any, { clear = false, suppress = false }: ICollectionAdd = {}) {
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

  sum(field: string) {
    return this.records.reduce((value, currentValue) => value + currentValue[field]);
  }

  addFilters(filters: ICollectionFilter[], { suppress = false } = {}) {
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
  removeFilters(filters: string[] | string, suppress = false) {
    if (isEmpty(filters)) {
      return;
    }
    filters = makeArray(filters);
    for (const filter of filters) {
      this.filters.remove(({ id }: ICollectionFilter) => id === filter);
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
  suspend(value = false) {
    this._suspended = value;
  }

  addSorters(sorters: ICollectionSorter[], { suppress = false } = {}) {
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
  removeSorters(sorters: string[], { suppress = false } = {}) {
    if (isEmpty(sorters)) {
      return;
    }
    sorters = makeArray(sorters);
    for (const sorter of sorters) {
      this.sorters.remove(({ id }: ICollectionSorter) => id === sorter);
    }
    this.suspend(suppress);
    this.init();
    this.suspend();
  }

  // TODOJEF: I think this might need to return the records instead of setting them?
  // This is so we can use the else portion of init and just push them on... maybe?
  group({ key, display }: {key: string, display: Function}, records = this.records) {
    /* We clear because the previous values for this collection could erroneously be the actual data records,
     * but we don't want to be dealing with those at this point, which is why we use the raw records loop */
    this.clear();
    const groups: {[key: string]: ICollectionGroup} = {};
    records.forEach((record) => {
      const groupKey = record[key];
      const group = groups[groupKey as keyof typeof groups];
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
      Reflect.set(this, GroupKey, key);
      this.push(group);
    }
    this.sort([{
      property: GroupDisplay,
    }], false);
  }

  /**
   * This will find in the overall record set... it ignores filtering
   * @param {Function} fn
   * @returns {Model}
   */
  find(fn: any) {
    return this.records.find(fn);
  }

  // @ts-ignore
  sort(sorters = this.sorters, recordSort = true) {
    if (!sorters || this._suspended) {
      return;
    }
    sorters = makeArray(sorters);
    sorters.forEach((sorter) => {
      if (typeof sorter !== "function") {
        const { property, direction = -1 } = sorter;
        sorter = (lhs: IModel, rhs: IModel) => commonSort(lhs[property], rhs[property], direction);
      }
      // Either we're wanting to sort the raw data source
      if (recordSort) {
        this.records.sort(sorter as any);
      }
      // Or we're most likely wanting to sort the groups
      else {
        super.sort(sorter as any);
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
      let data: Model[] = [];
      filters.forEach((filter, index) => {
        // If we have multiple filters, we have to make some swaps if the filter is not an OR
        if (!(index === 0 || filter.or)) {
          records = data;
          data = [];
        }
        let { fn } = filter;
        if (!fn) {
          let { value } = filter;
          const { property, exact = false } = filter;
          if (!exact) {
            value = new RegExp(value, "i");
          }
          fn = (record: Model) => {
            const recordValue = Reflect.get(record, property);
            return exact ? recordValue === value : value.test(recordValue);
          };
        }
        records.forEach((record) => {
          // For some reason, it thinks fn can be undefined here, but it is definitely defined above if it doesn't exist
          // @ts-ignore
          if (fn(record)) {
            data.push(record);
          }
        });
      });
      records = data;
    }
    if (groups) {
      let source: Collection = this;
      for (let i = 0; i < groups.length; i++) {
        // Create the initial groups
        if (i === 0) {
          this.group(groups[i], records);
        }
        else {
          let nextSource: any;
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

  get [ModelKey](): any {
    return this._model;
  }

  set [ModelKey](value) {
    this._model = value;
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option: Model) {
    if (option) {
      return Reflect.get(option, isArray(option) ? GroupDisplay : this.idField);
    }
  }

  getOptionDisplay(option: Model) {
    if (option) {
      // If the option is an array, it's assumed it's a collection, and we're accessing the group name
      return Reflect.get(option, isArray(option) ? GroupDisplay : this.displayField);
    }
  }

  getOptionCls(option: Model, selections: Model[]) {
    if (this.isGrouped) {
      return "group-wrapper";
    }
    const cls = ["list-item"];
    const { idField } = this;
    const value = Reflect.get(option, idField);
    for (const selection of selections) {
      if (value === Reflect.get(selection, idField)) {
        cls.push(SelectedCls);
        break;
      }
    }
    return cls;
  }

  clone(options: IModelGetData) {
    const { groups, idField, displayField, sorters, filters, model } = this;
    // @ts-ignore
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

  getData(options: IModelGetData) {
    const data: any[] = [];
    this._visited = true;
    this.forEach((record) => {
      /* It's possible that the result that returns is an array because the record could potentially be
       * a collection, like if a grouping is applied, so let's turn the result into an array */
      const result = makeArray(record.getData(options));
      data.push(...result);
    });
    this._visited = false;
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
      if (!(typeof sorter === "function" || sorter.id)) {
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

  set filters(filters: ICollectionFilter[]) {
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
    const records: any[] = [];
    const model = this[ModelKey];
    value.forEach((item) => {
      if (item[ClassField.IsModel]) {
        records.push(item);
      }
      else if (model) {
        const record = new model(item);
        record[ClassField.Parent] = this;
        records.push(record);
      }
    });
    this._records = records;
    this.init();
  }

  get records() {
    return this._records;
  }

  set groups(groups: any) {
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

  get idField(): string {
    return this[ClassField.Parent]?.idField || this._idField;
  }

  set idField(value) {
    this._idField = value;
  }

  get displayField(): string {
    return this[ClassField.Parent]?.displayField || this._displayField;
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
