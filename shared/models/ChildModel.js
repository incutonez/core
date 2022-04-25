import {
  FieldType,
  Model,
} from "@incutonez/shared";

export class ChildModel extends Model {
  get fields() {
    return [{
      name: "name",
    }, {
      name: "date",
      type: FieldType.Date,
    }];
  }
}
