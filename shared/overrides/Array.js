const proto = Array.prototype;

/**
 * Simplified method for removing an item from an array
 * @param item
 */
proto.remove = function(item) {
  const found = this.findIndex((record) => record === item);
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
