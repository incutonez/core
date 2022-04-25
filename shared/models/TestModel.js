import {
  FieldType,
  Model,
} from "@incutonez/shared";
import { ChildModel } from "@incutonez/shared/models/ChildModel.js";
import { ChildCollection } from "@incutonez/shared/collections/ChildCollection.js";

export class TestModel extends Model {
  get fields() {
    return [{
      name: "name",
    }, {
      name: "date",
      type: FieldType.Date,
    }, {
      name: "bool",
      type: FieldType.Boolean,
    }, {
      name: "int",
      type: FieldType.Integer,
    }, {
      name: "decimal",
      type: FieldType.Decimal,
    }, {
      name: "array",
      type: FieldType.Array,
    }, {
      name: "collection",
      type: FieldType.Collection,
      model: ChildModel,
    }, {
      name: "collection2",
      type: FieldType.Collection,
      collection: ChildCollection,
    }, {
      name: "model",
      type: FieldType.Model,
      model: ChildModel,
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
