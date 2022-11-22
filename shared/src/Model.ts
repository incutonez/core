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
import {
  cloneDeep,
  isArray,
  isEmpty,
  parseArray,
  parseBoolean,
  parseDate,
  parseInteger,
  parseNumber,
  parseObject,
  parseString,
  Collection,
  isObject,
  isDefined,
} from "@incutonez/shared";
import { ICollection, IModel, IModelField, IModelGetData, TModelValue } from "./interfaces";
import { EnumFieldType } from "./Enums";

/**
 * @param {*} value
 * @param {Field} field
 */
function parseValue(value: any, field: IModelField) {
  const { type } = field;
  if (isDefined(type)) {
    // TODO: Potentially remove old FieldTypes that I was using here... use native classes instead
    switch (type) {
      case EnumFieldType.Integer:
        value = getValue(parseInteger(value), field, 0);
        break;
      case Number:
      case EnumFieldType.Decimal:
        value = getValue(parseNumber(value, field.precision), field, 0);
        break;
      case Boolean:
      case EnumFieldType.Boolean:
        value = getValue(parseBoolean(value), field, false);
        break;
      case Date:
      case EnumFieldType.Date:
        value = getValue(parseDate(value), field, null);
        break;
      case EnumFieldType.Collection:
        value = field.collection ? new field.collection(value) : new Collection(value, field.model);
        break;
      case EnumFieldType.Model:
        value = new field.model(value);
        break;
      case Array:
      case EnumFieldType.Array:
        value = parseArray(value);
        break;
      case Object:
      case EnumFieldType.Object:
        value = getValue(parseObject(value), field, {});
        break;
      case String:
      case EnumFieldType.String:
        value = getValue(parseString(value), field, "");
        break;
        /**
     * Experimental... use at your own discretion.  The reason why this is experimental is because it
     * can cause recursion if you've got a defaultValue on a model that references itself as the model...
     * it will continually try to create the defaultValue and just keep digging deeper.
     */
      default:
        value ??= field.defaultValue;
        if (isDefined(value) && !(value instanceof (type as any))) {
          // @ts-ignore
          value = new type(value);
        }
        break;
    }
  }
  return value;
}

function getValue(value: TModelValue | undefined, field: IModelField, defaultValue: any) {
  if (isEmpty(value)) {
    value = "defaultValue" in field ? field.defaultValue : defaultValue;
  }
  return value;
}

export class Model {
  isModel = true;
  _snapshot?: IModel;
  _fields?: IModelField[];
  _trackChanges = false;
  _visited = false;

  constructor(data?: IModel) {
    data ??= {};
    for (const { name } of this.fields) {
      if (name in data) {
        continue;
      }
      // Let's make sure we flesh out any values that aren't initially passed in, so they get a default value
      data[name] = null;
    }
    this.set(data);
  }

  get TrackChanges() {
    return this._trackChanges;
  }

  set TrackChanges(value) {
    this._trackChanges = value;
    this.commit();
  }

  getDefaultFields() {
    return [] as IModelField[];
  }

  /**
   * I like the fields as a getter because then you can call super and get the extending fields
   * @returns {Field[]}
   */
  get fields() {
    let fields = this._fields;
    if (!fields) {
      this.fields = fields = this.getDefaultFields();
    }
    return fields;
  }

  set fields(value) {
    this._fields = value;
  }

  /**
   * This will reset the model to the values that were last committed to the record.  When the model
   * is initially created, it's all of the default values + any values set in the constructor.
   */
  reset() {
    if (this._snapshot) {
      this.set(this._snapshot);
    }
  }

  /**
   * This will mark any changes as the new original data, so when reset is called, this snapshot is used
   * instead of the previous snapshot.
   */
  commit() {
    if (this.TrackChanges) {
      this._snapshot = this.getData();
    }
    else {
      delete this._snapshot;
    }
  }

  set(data: IModel, reset = false) {
    if (reset) {
      this.reset();
    }
    for (const key in data) {
      const found = this.fields.find((field) => field.name === key);
      // If we have a field that was found, let's use the proper way
      if (found) {
        Reflect.set(this, found.name, parseValue(data[found.name], found));
      }
      // Otherwise, it appears we either have some custom setter or just a property that isn't part of the fields
      else {
        this.fields.push({
          name: key,
          custom: true,
        });
        Reflect.set(this, key, data[key]);
      }
    }
  }

  clone(options: IModelGetData) {
    // @ts-ignore
    return new this.constructor(this.getData(options));
  }

  /**
   * @param {String[]} include
   * @param {String[]} exclude
   * @returns {Object} data
   */
  getData({ include, exclude }: IModelGetData = {}) {
    const data = {};
    // Let's copy the fields because we're potentially modifying them with the include
    const fields = [...this.fields];
    if (include) {
      include.forEach((field) => fields.push({
        name: field,
      }));
    }
    // Used internally
    this._visited = true;
    for (const field of fields) {
      const { name } = field;
      if (exclude && exclude.indexOf(name) !== -1) {
        continue;
      }
      const value = Reflect.get(this, name) as IModel | ICollection;
      if (value?.isModel || value?.isCollection) {
        if (!value._visited) {
          Reflect.set(data, name, value.getData({
            include,
            exclude,
          }));
        }
      }
      else if (isArray(value) || isObject(value)) {
        Reflect.set(data, name, cloneDeep(value));
      }
      else {
        Reflect.set(data, name, value);
      }
    }
    this._visited = false;
    return data;
  }
}
