import type { IEnum } from "ui/interfaces";

type T = number | string;

export class Enum extends Array {
  static init(keys: string[]) {
    const self = new Enum();
    self.init(keys);
    return self;
  }

  init(keys = this.keys) {
    if (!Array.isArray(keys)) {
      Object.assign(keys);
      keys = Object.keys(keys);
    }
    keys.forEach((key, index) => {
      let item: any = Reflect.get(this, key);
      // If our key is a primitive, let's construct the signature
      if (typeof item === "string" || typeof item === "number") {
        item = {
          key,
          value: Reflect.get(this, key),
        } as IEnum<T>;
      }
      item.value ??= index;
      item.key ??= key;
      Reflect.set(this, item.key, item.value);
      this.push(item);
    });
  }

  // @ts-ignore
  get keys() {
    return Object.keys(this);
  }

  // @ts-ignore
  get values() {
    return Object.values(this);
  }
}
