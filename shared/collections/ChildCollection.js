import { Collection } from "shared/Collection.js";
import { ChildModel } from "shared/models/ChildModel.js";

export class ChildCollection extends Collection {
  get model() {
    return ChildModel;
  }
}
