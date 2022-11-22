import {
  isEmpty,
  isFunction,
  makeArray,
} from "@incutonez/shared/src/utilities";

const proto = Array.prototype;

/**
 * Simplified method for removing an item from an array
 * @param {Function|Object|Object[]|*} items
 */
proto.remove = function(items) {
  if (isEmpty(items)) {
    return;
  }
  items = makeArray(items);
  for (const item of items) {
    let fn = item;
    if (!isFunction(fn)) {
      fn = (record: any) => record === item;
    }
    const found = this.findIndex(fn);
    if (found === -1) {
      continue;
    }
    this.splice(found, 1);
  }
};

/**
 * This will add a new item to the array at the specified index... if no index, then it's added at the end
 * @param {*} item
 * @param {Number} index
 * @returns {*}
 */
proto.insert = function(item, index: number) {
  this.splice(index, 0, item ?? this.length);
  return item;
};

/**
 * This will add a new item to the array, but it will only add a unique value
 * @param item
 * @param index
 * @returns {*}
 */
proto.addUnique = function(item, index) {
  const found = this.find((record) => record === item);
  if (found) {
    return found;
  }
  this.insert(item, index);
  return item;
};
