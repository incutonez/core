import {
  FieldType,
  Model,
} from "shared/Model.js";
import { ChildModel } from "shared/models/ChildModel.js";
import { ChildCollection } from "shared/collections/ChildCollection.js";

export class TestModel extends Model {
  get fields() {
    return [
      {
        name: "name",
      }, {
        name: "date",
        type: FieldType.DATE,
      }, {
        name: "bool",
        type: FieldType.BOOLEAN,
      }, {
        name: "int",
        type: FieldType.INTEGER,
      }, {
        name: "decimal",
        type: FieldType.DECIMAL,
      }, {
        name: "array",
        type: FieldType.ARRAY,
      }, {
        name: "collection",
        type: FieldType.COLLECTION,
        model: ChildModel,
      }, {
        name: "collection2",
        type: FieldType.COLLECTION,
        collection: ChildCollection,
      }, {
        name: "model",
        type: FieldType.MODEL,
        model: ChildModel,
      },
    ];
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
