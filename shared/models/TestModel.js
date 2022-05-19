import {
  FieldType,
  Model,
} from "@incutonez/shared";
import { ChildModel } from "@incutonez/shared/models/ChildModel.js";
import { ChildCollection } from "@incutonez/shared/collections/ChildCollection.js";

export class TestModel extends Model {
  getDefaultFields() {
    return [{
      name: "name",
      type: String,
    }, {
      name: "date",
      type: Date,
    }, {
      name: "bool",
      type: Boolean,
    }, {
      name: "int",
      type: Number,
    }, {
      name: "decimal",
      type: Number,
    }, {
      name: "array",
      type: Array,
    }, {
      name: "collection",
      type: FieldType.Collection,
      model: ChildModel,
    }, {
      name: "collection2",
      type: ChildCollection,
    }, {
      name: "model",
      type: ChildModel,
    }];
  }

  set date(value) {
    this._date = value;
  }

  get date() {
    return this._date?.getQuarterEnd().toMMDDYYYY();
  }

  get fullName() {
    return `${this.name} ${this.date}`;
  }
}
