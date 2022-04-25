import { isFunction } from "@incutonez/shared/src/utilities.js";

const proto = Array.prototype;

/**
 * Simplified method for removing an item from an array
 * @param {Function|*} item
 */
proto.remove = function(item) {
  let fn = item;
  if (!isFunction(fn)) {
    fn = (record) => record === item;
  }
  const found = this.findIndex(fn);
  if (found === -1) {
    return;
  }
  this.splice(found, 1);
};

/**
 * This will add a new item to the array at the specified index... if no index, then it's added at the end
 * @param {*} item
 * @param {Number} index
 * @returns {*}
 */
proto.add = function(item, index = this.length) {
  this.splice(index, 0, item);
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
  this.add(item, index);
  return item;
};
