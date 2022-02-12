import {
  FieldType,
  Model,
} from "shared/Model.js";

export class ChildModel extends Model {
  get fields() {
    return [
      {
        name: "name",
      }, {
        name: "date",
        type: FieldType.DATE,
      },
    ];
  }
}
