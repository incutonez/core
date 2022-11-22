import { Collection } from "@incutonez/shared";
import { ChildModel } from "@incutonez/shared/models/ChildModel";
import { ModelKey } from "ui/Collection";

export class ChildCollection extends Collection {
  get [ModelKey]() {
    return ChildModel;
  }
}
