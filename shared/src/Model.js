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
  Enum,
  Collection,
} from "@incutonez/shared";

/**
 * @property {Number} String
 * @property {String} String_DISPLAY
 * @property {Number} Integer
 * @property {String} Integer_DISPLAY
 * @property {Number} Decimal
 * @property {String} Decimal_DISPLAY
 * @property {Number} Boolean
 * @property {String} Boolean_DISPLAY
 * @property {Number} Date
 * @property {String} Date_DISPLAY
 * @property {Number} Model
 * @property {String} Model_DISPLAY
 * @property {Number} Collection
 * @property {String} Collection_DISPLAY
 * @property {Number} Array
 * @property {String} Array_DISPLAY
 * @property {Number} Object
 * @property {String} Object_DISPLAY
 */
export const FieldType = new Enum(["String", "Integer", "Decimal", "Boolean", "Date", "Model", "Collection", "Array", "Object"]);

/**
 * @param {*} value
 * @param {Field} field
 */
function parseValue(value, field) {
  switch (field.type) {
    case FieldType.Integer:
      value = getValue(parseInteger(value), field, 0);
      break;
    case FieldType.Decimal:
      value = getValue(parseNumber(value, field.precision), field, 0);
      break;
    case FieldType.Boolean:
      value = getValue(parseBoolean(value), field, false);
      break;
    case FieldType.Date:
      value = getValue(parseDate(value), field, null);
      break;
    case FieldType.Collection:
      value = field.collection ? new field.collection(value) : new Collection(value, field.model);
      break;
    case FieldType.Model:
      value = new field.model(value);
      break;
    case FieldType.Array:
      value = parseArray(value);
      break;
    case FieldType.Object:
      value = getValue(parseObject(value), field, {});
      break;
    case FieldType.String:
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
