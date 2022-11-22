export function inDateRange({ date, start, end }: {date: Date, start: Date, end: Date}) {
  return date <= end && date >= start;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isNull(value: any) {
  return value === null;
}

export function isDefined(value: any) {
  return value != null;
}

export function isEmpty(value: any) {
  return isUndefined(value) ||
    isNull(value) ||
    isNumber(value) && isNaN(value) ||
    value === "" ||
    isArray(value) && value.length === 0 ||
    isObject(value) && Object.values(value).length === 0;
}

export function isString(value: any) {
  return typeof value === "string";
}

export function isNumber(value: any) {
  return typeof value === "number";
}

export function isBoolean(value: any) {
  return typeof value === "boolean";
}

export function isDate(value: any) {
  return value instanceof Date;
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function makeArray(value: any) {
  return isArray(value) ? value : [value];
}

export function isObject(value: any) {
  return value?.constructor === Object;
}

export function isFunction(value: any) {
  return typeof value === "function";
}

export function hasTarget(element: HTMLElement, target: HTMLElement) {
  return element === target || element.contains(target);
}

export function parseNumber(value: any, precision = 2) {
  if (isDefined(value)) {
    value = isNumber(value) ? value : parseFloat(value);
    return +(value.toFixed(precision));
  }
  return undefined;
}

export function parseInteger(value: any) {
  return parseNumber(value, 0);
}

export function parseBoolean(value: any) {
  if (isBoolean(value)) {
    return value;
  }
  if (!isDefined(value)) {
    return value;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return !!value;
}

export function parseDate(value: any) {
  if (isDate(value)) {
    return value;
  }
  value = new Date(value);
  return isNaN(value) ? undefined : value;
}

export function parseRaw(value: any) {
  try {
    return JSON.parse(value);
  }
  catch {
    console.error(`value could not be parse ${value}`);
    return undefined;
  }
}

export function parseArray(value: any) {
  if (isDefined(value)) {
    return isArray(value) ? value : parseRaw(value);
  }
  return undefined;
}

export function parseObject(value: any) {
  if (isDefined(value)) {
    return isObject(value) ? value : parseRaw(value);
  }
  return undefined;
}

export function parseString(value: any) {
  if (isDefined(value)) {
    return isString(value) ? value : String(value);
  }
  return undefined;
}

export function cloneDeep(value: any) {
  return parseRaw(JSON.stringify(value));
}

export function collect(items: any[], keys: string[] | string) {
  const collection: any[] = [];
  if (Array.isArray(keys)) {
    items.forEach((item) => {
      const collect: any = {};
      keys.forEach((key) => collect[key] = item[key]);
      collection.push(collect);
    });
  }
  else {
    items.forEach((item) => collection.push(item[keys]));
  }
  return collection;
}

export function commonSort(lhs: string | number | Date, rhs: string | number | Date, identity = -1) {
  if (lhs === rhs) {
    return 0;
  }
  return lhs < rhs ? identity : -1 * identity;
}

// Taken from https://stackoverflow.com/a/46320004/1253609
export function isConstructor(obj: any) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}
