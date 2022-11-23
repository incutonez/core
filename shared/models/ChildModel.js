import { Model } from "@incutonez/shared";

export class ChildModel extends Model {
  getDefaultFields() {
    return [{
      name: "name",
      type: String,
    }, {
      name: "date",
      type: Date,
    }];
  }
}
