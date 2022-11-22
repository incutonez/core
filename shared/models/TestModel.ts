import { Model } from "@incutonez/shared";
import { ChildModel } from "@incutonez/shared/models/ChildModel";
import { ChildCollection } from "@incutonez/shared/collections/ChildCollection";
import type { IModelField } from "ui/interfaces";
import { EnumFieldType } from "ui/Enums";
import { Collection } from "ui/Collection";

export class TestModel extends Model {
  name = "";
  _date?: Date;
  collection?: Collection;

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
      type: EnumFieldType.Collection,
      model: ChildModel,
    }, {
      name: "collection2",
      type: ChildCollection,
    }, {
      name: "model",
      type: ChildModel,
    }] as IModelField[];
  }

  set date(value: Date) {
    this._date = value;
  }

  get date(): any {
    return this._date?.getQuarterEnd().toMMDDYYYY();
  }

  get fullName() {
    return `${this.name} ${this.date}`;
  }
}
