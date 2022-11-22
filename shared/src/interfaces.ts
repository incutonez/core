import { GroupKey } from "./Collection";
import { EnumFieldType } from "./Enums";

declare global {
  interface String {
    capitalize(): string;
    equals(value: string): boolean;
  }

  interface Array<T> {
    remove(items: T | Function): void;
    insert(item: T, index: number): T;
    addUnique(item: T, index: number): T;
  }

  interface Date {
    getWeekStart(config: IDateConfig): Date;
    getMonthStart(config: IDateConfig): Date;
    getMonthEnd(config: IDateConfig): Date;
    getYearStart(config: IDateConfig): Date;
    getYearEnd(config: IDateConfig): Date;
    getQuarterStart(config: IDateConfig): Date;
    getQuarterEnd(config: IDateConfig): Date;
    toMMDDYYYY(): string;
  }
}

export interface IDateConfig {
  year?: number;
  yearOffset?: number;
  month?: number;
  monthOffset?: number;
  date?: number;
  dateOffset?: number;
  isEnd?: boolean;
  startingDay?: number;
  isWeek?: boolean;
}

export interface IEnum<T> {
  key: string;
  value?: T;
  description?: string;
}

export interface IModel {
  [key: string]: any;
  _visited?: boolean;
  isModel?: boolean;
}

export interface ICollection {
  [key: string]: any;
  _visited?: boolean;
  isCollection?: boolean;
}

/**
 * @typedef Field
 * @property {String} name
 * @property {String} [type=String|*]
 * @property {Number} [precision=2]
 * This is for type Decimal only... it will set the precision of the decimals to this value.
 * By default, this is 2.
 * @property {Collection} [collection]
 * @property {Model} [model]
 * @property {*} [defaultValue=""]
 */
export interface IModelField {
  name: string;
  type?: keyof typeof EnumFieldType | NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor;
  precision?: number;
  collection?: any;
  model?: any;
  defaultValue?: any;
  custom?: boolean;
}

export type TModelValue = string | number | Date | Object;

export interface IModelGetData {
  include?: string[];
  exclude?: string[];
}

/**
 * @typedef CollectionFilter
 * @property {String} property
 * @property {*} value
 * @property {Boolean} or
 * If this is set, then the previous filtered data will act as an OR instead of an AND, so it'll use
 * the same records that were used by the previous filter.
 */
export interface ICollectionFilter extends Array<any> {
  id?: string | number;
  property: string;
  value: any;
  or: boolean;
  exact?: boolean;
  fn?: Function;
}

/**
 * @typedef CollectionSorter
 * If this is passed in as a function, then none of these properties are used, as it's then up to the dev
 * to modify the function.
 * @property {String} property
 * @property {Number} direction
 * This can be 1 or -1... 1 is DESC and -1 is ASC
 */
export interface ICollectionSorter {
  id?: string | number;
  property: string;
  direction?: number;
}

export interface ICollectionGroup {
  [GroupKey]: string;
  records: IModel[];
}
