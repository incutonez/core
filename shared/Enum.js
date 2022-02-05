import "./overrides/String.js";

const DISPLAY_INDEX = "_DISPLAY";

export class Enum {
  constructor(values) {
    if (Array.isArray(values)) {
      values.forEach((value, index) => {
        const key = this.valueToKey(value);
        this[key] = index;
        this[`${key}${DISPLAY_INDEX}`] = value;
      });
    }
  }

  valueToKey(value) {
    return String(value).split(/(?=[A-Z])|-/).map((item) => item.toUpperCase()).join("_");
  }

  get keys() {
    return Object.keys(this).filter((key) => !key.includes(DISPLAY_INDEX)).map((key) => this[key]);
  }

  get values() {
    return Object.keys(this).filter((key) => key.includes(DISPLAY_INDEX)).map((key) => this[key]);
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