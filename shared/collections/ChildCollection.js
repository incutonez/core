import { Collection } from "@incutonez/shared";
import { ChildModel } from "@incutonez/shared/models/ChildModel.js";

export class ChildCollection extends Collection {
  get model() {
    return ChildModel;
  }
}
