import {
  isArray,
  isEmpty,
} from "shared/utilities.js";
import { Model } from "shared/Model.js";

export class Collection extends Array {
  isCollection = true;

  get model() {
    return this._model || Model;
  }

  constructor(data, model) {
    super();
    if (model) {
      this._model = model;
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
    this.map((record) => data.push(record.getData(options)));
    return data;
  }
}
