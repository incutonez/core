import { EnumProp } from "ui/statics/Enums";

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
  [EnumProp.Visited]?: boolean;
  [EnumProp.IsModel]?: boolean;
  [EnumProp.Track]?: boolean;
  [EnumProp.Snapshot]?: any;
}

export interface IModelFull extends IModel {
  set(data: any, reset?: boolean): void;
  getData(options: IModelGetData): any;
}

export interface IModelField {
  name: string;
  defaultValue?: any;
  custom?: boolean;
  [EnumProp.Nullable]?: boolean;
  [EnumProp.IsCollection]?: boolean;
  [EnumProp.IsModel]?: boolean;
}

export interface ICollectionAdd {
  clear?: boolean;
  suppress?: boolean;
}

export interface ICollection {
  [EnumProp.Model]: any;
  [EnumProp.Groups]?: any;
  [EnumProp.Data]?: IModel[];
  [EnumProp.IdField]?: string;
  [EnumProp.DisplayField]?: string;
  [EnumProp.Parent]?: ICollection;
  [EnumProp.IsCollection]?: boolean;
  [EnumProp.Visited]?: boolean;
}

export interface ICollectionFull extends ICollection {
  add(data: any, config?: ICollectionAdd): void;
  getData(options: IModelGetData): any[];
}

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
  property: string | Symbol;
  direction?: number;
}

export interface ICollectionGroup {
  [EnumProp.GroupKey]: string;
  records: IModel[];
}
