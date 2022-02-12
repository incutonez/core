import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import { Model } from "shared/Model.js";

export class Collection extends Array {
  isCollection = true;

  constructor(data, model = Model) {
    super();
    if (!this.model) {
      this.model = model;
    }
    this.add(data);
  }

  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
  }

  clear() {
    this.length = 0;
  }

  add(data, clear = false) {
    if (isEmpty(data)) {
      return;
    }
    if (clear) {
      this.clear();
    }
    if (!isArray(data)) {
      data = [data];
    }
    data.map((item) => this.push(new this.model(item)));
  }

  getData(options) {
    const data = [];
    this.forEach((record) => data.push(record.getData(options)));
    return data;
  }

  clone() {
    return new this.constructor(this.getData(), this.model);
  }
}
