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
  [EnumProp.Model]?: any;
  [EnumProp.Groups]?: any;
  [EnumProp.Sorters]?: ICollectionSorter[];
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
export interface ICollectionFilter {
  id?: string | number;
  property?: string;
  value?: any;
  or?: boolean;
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

export type TFieldValue = string | number | boolean | undefined;

// TODOJEF: Make components interface file?
/* Right now we're duping this in BaseIcon and here because of a Vue bug
 * Source: https://github.com/vuejs/core/issues/4294 */
export interface IPropsBaseIcon {
  icon: Object | string;
}

/* Right now we're duping this in BaseField and here because of a Vue bug
 * Source: https://github.com/vuejs/core/issues/4294 */
export interface IPropsBaseField {
  label?: string;
  labelWidth?: string;
  modelValue?: TFieldValue;
  inputType?: string;
  inputCls?: string | CSSStyleDeclaration;
  inputWidth?: string;
  labelAlign?: string;
  required?: boolean;
  allowEmptyWhitespace?: boolean;
  minLength?: number;
  maxLength?: number;
  /**
   * Only used in number and date like fields.  We have to have it in here, so we can consume it
   * in the configuration methods that are called.  If we didn't have it, the value would always
   * be undefined.
   */
  minValue?: number;
  /**
   * Only used in number and date like fields.  We have to have it in here, so we can consume it
   * in the configuration methods that are called.  If we didn't have it, the value would always
   * be undefined.
   */
  maxValue?: number;
  /**
   * Only used in number like fields.  We have to have it in here, so we can consume it in the
   * configuration methods that are called.  If we didn't have it, the value would always be
   * undefined.
   */
  step?: number;
  validateOnInit?: boolean;
  inputAttrsCfg?: (props: IPropsBaseField) => {};
  rulesCfg?: (props: IPropsBaseField) => {};
  parseValue?: (value: any) => TFieldValue;
  id?: string;
}

export interface IActiveDialog {
  fullPath: string;
  name: string;
  isActive?: boolean;
  activeCls?: string;
}
