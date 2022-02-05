const proto = String.prototype;

proto.capitalize = function() {
  return `${this[0].toUpperCase()}${this.substring(1)}`;
};