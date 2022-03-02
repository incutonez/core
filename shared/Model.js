/**
 * @typedef Field
 * @property {String} name
 * @property {String} [type=String]
 * @property {Number} [precision=2]
 * This is for type Decimal only... it will set the precision of the decimals to this value.
 * By default, this is 2.
 * @property {Collection} [collection]
 * @property {Model} [model]
 * @property {*} [defaultValue=""]
 */
import { Enum } from "shared/Enum.js";
import {
  cloneDeep,
  isArray,
  isEmpty,
  isUndefined,
  parseArray,
  parseBoolean,
  parseDate,
  parseInteger,
  parseNumber,
  parseObject,
  parseString,
} from "shared/utilities.js";
import { Collection } from "shared/Collection.js";

/**
 * @property {Number} STRING
 * @property {String} STRING_DISPLAY
 * @property {Number} INTEGER
 * @property {String} INTEGER_DISPLAY
 * @property {Number} DECIMAL
 * @property {String} DECIMAL_DISPLAY
 * @property {Number} BOOLEAN
 * @property {String} BOOLEAN_DISPLAY
 * @property {Number} DATE
 * @property {String} DATE_DISPLAY
 * @property {Number} MODEL
 * @property {String} MODEL_DISPLAY
 * @property {Number} COLLECTION
 * @property {String} COLLECTION_DISPLAY
 * @property {Number} ARRAY
 * @property {String} ARRAY_DISPLAY
 * @property {Number} OBJECT
 * @property {String} OBJECT_DISPLAY
 */
export const FieldType = new Enum(["String", "Integer", "Decimal", "Boolean", "Date", "Model", "Collection", "Array", "Object"]);

/**
 * @param {*} value
 * @param {Field} field
 */
function parseValue(value, field) {
  switch (field.type) {
    case FieldType.INTEGER:
      value = getValue(parseInteger(value), field, 0);
      break;
    case FieldType.DECIMAL:
      value = getValue(parseNumber(value, field.precision), field, 0);
      break;
    case FieldType.BOOLEAN:
      value = getValue(parseBoolean(value), field, false);
      break;
    case FieldType.DATE:
      value = getValue(parseDate(value), field, null);
      break;
    case FieldType.COLLECTION:
      value = field.collection ? new field.collection(value) : new Collection(value, field.model);
      break;
    case FieldType.MODEL:
      value = new field.model(value);
      break;
    case FieldType.ARRAY:
      value = parseArray(value);
      break;
    case FieldType.OBJECT:
      value = getValue(parseObject(value), field, {});
      break;
    case FieldType.STRING:
    default:
      value = getValue(parseString(value), field, "");
      break;
  }

  return value;
}

function getValue(value, field, defaultValue) {
  if (isEmpty(value)) {
    value = "defaultValue" in field ? field.defaultValue : defaultValue;
  }
  return value;
}

export class Model {
  isModel = true;

  constructor(data) {
    this.set(data, true);
  }

  /**
   * I like the fields as a getter because then you can call super and get the extending fields
   * @returns {Field[]}
   */
  get fields() {
    return [];
  }

  clear() {
    this.fields.forEach((field) => {
      this[field.name] = parseValue(undefined, field);
    });
  }

  set(data, clear = false) {
    if (clear) {
      this.clear();
    }
    if (!data) {
      return;
    }
    for (const key in data) {
      const found = this.fields.find((field) => field.name === key);
      if (found) {
        this[found.name] = parseValue(data[found.name], found);
      }
    }
  }

  clone() {
    return new this.constructor(this.getData());
  }

  getData(options = {}) {
    const data = {};
    this.fields.forEach((field) => {
      const { name } = field;
      const value = this[name];
      if (value?.isModel || value?.isCollection) {
        data[name] = value.getData(options);
      }
      else if (isArray(value)) {
        data[name] = cloneDeep(value);
      }
      else {
        data[name] = value;
      }
    });
    return data;
  }
}
