import {
  isArray,
  isEmpty,
  isObject,
  commonSort,
  makeArray,
} from "ui/utilities";
import type {
  ICollectionFilter,
  ICollectionSorter,
  IModelGetData,
  ICollectionGroup,
  IModel,
  ICollectionAdd, ICollection,
} from "ui/interfaces";
import { EnumProp } from "ui/statics/Enums";
import { Model } from "ui/classes/Model";

const SelectedCls = "list-item-selected";
const IdFieldInternal = "_idField";
const DisplayFieldInternal = "_displayField";
const RecordsInternal = "_records";
const GroupsInternal = "_groups";
const FiltersInternal = "_filters";
const SortersInternal = "_sorters";
const SuspendedInternal = "_suspended";

export class Collection extends Array {
  [EnumProp.IsCollection] = true;
  [IdFieldInternal] = "id";
  [DisplayFieldInternal] = "value";
  [RecordsInternal]: any[] = [];
  [GroupsInternal]?: any[];
  /**
   * @type {CollectionFilter[]}
   */
  [FiltersInternal]: ICollectionFilter[] = [];
  /**
   * @type {CollectionSorter[]}
   */
  [SortersInternal]?: (ICollectionSorter | Function)[];
  [SuspendedInternal] = false;
  [EnumProp.Visited] = false;
  [EnumProp.Parent]?: ICollection;
  [EnumProp.GroupKey] = null;
  [EnumProp.GroupDisplay] = null;
  [EnumProp.ModelInternal]: any = Model;

  constructor(config: ICollection) {
    super();
    let { [EnumProp.Data]: data } = config;
    const { [EnumProp.Model]: model } = config;
    data ??= [];
    // We need this set, so our Object.assign doesn't kick off multiple inits when each property is set
    this.suspend(true);
    if (model) {
      this[EnumProp.Model] = model;
    }
    this[EnumProp.Parent] = config[EnumProp.Parent];
    this[EnumProp.Groups] = config[EnumProp.Groups];
    this[EnumProp.Sorters] = config[EnumProp.Sorters];
    this[EnumProp.DisplayField] = config[EnumProp.DisplayField] || "value";
    // We always need a reference to the raw source, as that's how we'll be able to build the records
    this.records = data;
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
    this[SuspendedInternal] = value;
  }

  addSorters(sorters: ICollectionSorter[], { suppress = false } = {}) {
    if (isEmpty(sorters)) {
      return;
    }
    sorters = makeArray(sorters);
    this.suspend(suppress);
    this[EnumProp.Sorters] = this[EnumProp.Sorters]?.concat(sorters) || sorters;
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
      this[EnumProp.Sorters]?.remove(({ id }: ICollectionSorter) => id === sorter);
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
          [EnumProp.GroupKey]: groupKey,
          records: [record],
        };
      }
    });
    for (const { [EnumProp.GroupKey]: groupKey, records } of Object.values(groups)) {
      const group = new Collection({
        [EnumProp.Model]: this[EnumProp.ModelInternal],
        [EnumProp.Data]: records,
        [EnumProp.Parent]: this as ICollection,
      });
      group[EnumProp.GroupDisplay] = display ? display(group) : groupKey;
      Reflect.set(this, EnumProp.GroupKey, key);
      this.push(group);
    }
    this.sort([{
      property: EnumProp.GroupDisplay,
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
  sort(sorters = this[EnumProp.Sorters], recordSort = true) {
    if (!sorters || this[SuspendedInternal]) {
      return;
    }
    sorters = makeArray(sorters);
    sorters.forEach((sorter) => {
      if (typeof sorter !== "function") {
        const { property, direction = -1 } = sorter;
        sorter = (lhs: IModel, rhs: IModel) => commonSort(lhs[property as any], rhs[property as any], direction);
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
    if (this[SuspendedInternal]) {
      return;
    }
    const { [EnumProp.Groups]: groups, filters } = this;
    let { records } = this;
    if (!isEmpty(filters)) {
      let data: IModel[] = [];
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
          fn = (record: IModel) => {
            const recordValue = Reflect.get(record, property as string);
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
          let nextSource = [] as any;
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

  get [EnumProp.Model](): any {
    return this[EnumProp.ModelInternal];
  }

  set [EnumProp.Model](value) {
    this[EnumProp.ModelInternal] = value;
  }

  // TODO: There's a warning that gets thrown when we choose a key that's the same for each option
  getOptionId(option?: IModel) {
    if (option) {
      return Reflect.get(option, isArray(option) ? EnumProp.GroupDisplay : this.idField);
    }
  }

  getOptionDisplay(option: IModel) {
    if (option) {
      // If the option is an array, it's assumed it's a collection, and we're accessing the group name
      return Reflect.get(option, isArray(option) ? EnumProp.GroupDisplay : this[EnumProp.DisplayField]);
    }
  }

  getOptionCls(option: IModel, selections: IModel[]) {
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

  clone(options?: IModelGetData) {
    const { idField, filters } = this;
    // @ts-ignore
    return new this.constructor({
      idField,
      [EnumProp.DisplayField]: this[EnumProp.DisplayField],
      [EnumProp.Groups]: this[EnumProp.Groups],
      [EnumProp.Sorters]: this[EnumProp.Sorters],
      filters,
      [EnumProp.Model]: this[EnumProp.Model],
      records: this.getData(options),
    });
  }

  getData(options?: IModelGetData) {
    const data: any[] = [];
    this[EnumProp.Visited] = true;
    this.forEach((record) => {
      /* It's possible that the result that returns is an array because the record could potentially be
       * a collection, like if a grouping is applied, so let's turn the result into an array */
      const result = makeArray(record.getData(options));
      data.push(...result);
    });
    this[EnumProp.Visited] = false;
    return data;
  }

  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
  }

  set [EnumProp.Sorters](sorters) {
    sorters?.map((sorter, index) => {
      if (!(typeof sorter === "function" || sorter.id)) {
        sorter.id = index;
      }
      return sorter;
    });
    this[SortersInternal] = sorters;
    this.sort();
  }

  get [EnumProp.Sorters]() {
    return this[SortersInternal];
  }

  set filters(filters: ICollectionFilter[]) {
    filters?.map((filter, index) => {
      if (!filter.id) {
        filter.id = index;
      }
      return filter;
    });
    this[FiltersInternal] = filters;
    this.init();
  }

  get filters() {
    return this[FiltersInternal];
  }

  set records(value) {
    const records: any[] = [];
    const model = this[EnumProp.Model];
    value.forEach((item) => {
      if (item[EnumProp.IsModel]) {
        records.push(item);
      }
      else if (model) {
        const record = new model(item);
        record[EnumProp.Parent] = this;
        records.push(record);
      }
    });
    this[RecordsInternal] = records;
    this.init();
  }

  get records() {
    return this[RecordsInternal];
  }

  set [EnumProp.Groups](groups: any) {
    if (isEmpty(groups)) {
      this[EnumProp.GroupKey] = null;
    }
    else if (isObject(groups)) {
      groups = [groups];
    }
    this[GroupsInternal] = groups;
    this.init();
  }

  get [EnumProp.Groups]() {
    return this[GroupsInternal];
  }

  get idField(): string {
    return this[EnumProp.Parent]?.[EnumProp.IdField] || this[IdFieldInternal];
  }

  set idField(value) {
    this[IdFieldInternal] = value;
  }

  set [EnumProp.DisplayField](value) {
    this[DisplayFieldInternal] = value;
  }

  get [EnumProp.DisplayField]() {
    return this[EnumProp.Parent]?.[EnumProp.DisplayField] || this[DisplayFieldInternal];
  }

  get isGrouped() {
    return !isEmpty(this[EnumProp.GroupKey]);
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
