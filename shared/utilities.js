export function inDateRange({ date, start, end }) {
  return date <= end && date >= start;
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNull(value) {
  return value === null;
}

export function isDefined(value) {
  return value != null;
}

export function isEmpty(value) {
  return isUndefined(value) ||
    isNull(value) ||
    isNumber(value) && isNaN(value) ||
    value === "" ||
    isArray(value) && value.length === 0 ||
    isObject(value) && Object.values(value).length === 0;
}

export function isString(value) {
  return typeof value === "string";
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isBoolean(value) {
  return typeof value === "boolean";
}

export function isDate(value) {
  return value instanceof Date;
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return value?.constructor === Object;
}

export function isFunction(value) {
  return typeof value === "function";
}

export function parseNumber(value, precision = 2) {
  if (isDefined(value)) {
    value = isNumber(value) ? value : parseFloat(value);
    return +(value.toFixed(precision));
  }
  return undefined;
}

export function parseInteger(value) {
  return parseNumber(value, 0);
}

export function parseBoolean(value) {
  console.log("parsing", value);
  if (isBoolean(value)) {
    return value;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return !!value;
}

export function parseDate(value) {
  if (isDate(value)) {
    return value;
  }
  value = new Date(value);
  return isNaN(value) ? undefined : value;
}

export function parseRaw(value) {
  try {
    return JSON.parse(value);
  }
  catch {
    console.error(`value could not be parse ${value}`);
    return undefined;
  }
}

export function parseArray(value) {
  if (isDefined(value)) {
    return isArray(value) ? value : parseRaw(value);
  }
  return undefined;
}

export function parseObject(value) {
  if (isDefined(value)) {
    return isObject(value) ? value : parseRaw(value);
  }
  return undefined;
}

export function parseString(value) {
  if (isDefined(value)) {
    return isString(value) ? value : String(value);
  }
  return undefined;
}

export function cloneDeep(value) {
  return parseRaw(JSON.stringify(value));
}
