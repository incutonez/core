export class Enum {
  constructor(values, useIndex = true) {
    if (Array.isArray(values)) {
      values.forEach((value, index) => {
        const key = this.valueToKey(value);
        if (useIndex) {
          this[key] = index;
        }
        else {
          this[key] = value;
        }
      });
    }
    else {
      Object.assign(this, values);
    }
  }

  valueToKey(value) {
    return String(value).split(/(?=[A-Z])|-/).map((item) => item.capitalize()).join("");
  }

  get count() {
    return this.keys.length;
  }

  get keys() {
    return Object.keys(this);
  }

  get values() {
    return Object.keys(this).map((key) => this[key]);
  }

  get options() {
    return Object.keys(this).map((key) => {
      return {
        id: this[key],
        value: key,
      };
    });
  }

  toString() {
    const props = [];
    const keys = Object.keys(this);
    keys.forEach((key) => {
      const type = typeof this[key];
      props.push(`* @property {${type.capitalize()}} ${key}`);
    });
    return "/**\n" + props.join("\n") + "\n */";
  }
}
