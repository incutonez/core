import { EnumProp } from "ui/statics/Enums";
import type {
  ICollection,
  ICollectionFull,
  IModel,
  IModelField,
  IModelFull,
  IModelGetData,
} from "ui/interfaces";
import { cloneDeep, isArray, isConstructor, isObject } from "ui/utilities";
import type { Collection } from "ui/classes/Collection";

export class Model {
  [EnumProp.IsModel] = true;
  [EnumProp.Track] = false;
  [EnumProp.Snapshot]?: any;
  [EnumProp.Visited] = false;
  [EnumProp.FieldsInternal]: any[] = [];
  // TODO: Need to figure out how to implement... get a circular dep if I do try to set it
  [EnumProp.Parent]?: any;
  [EnumProp.Fields]: IModelField[] = [];

  init(data = {}) {
    const { fields } = this;
    for (const field of fields) {
      const { name } = field;
      if (name in data) {
        continue;
      }
      let { defaultValue } = field;
      if (field[EnumProp.Nullable]) {
        defaultValue = undefined;
      }
      // Let's make sure we flesh out any values that aren't initially passed in, so they get a default value
      Reflect.set(data, name, defaultValue);
    }
    this.set(data);
  }

  set(data: any, reset = false) {
    if (reset) {
      this.reset();
    }
    const { fields } = this;
    for (const key in data) {
      const found = fields.find(({ name }) => name === key);
      // If we have a field that was found, let's use the proper way
      if (found) {
        const value = data[key];
        if (found[EnumProp.IsCollection]) {
          const collection = Reflect.get(this, key) as ICollectionFull;
          collection.add(value);
        }
        else if (found[EnumProp.IsModel] && value) {
          const model = Reflect.get(this, key) as IModelFull;
          if (model) {
            model.set(value);
          }
          /* Otherwise, it appears we need to create a new model instance, so let's see if a definition
           * exists in our types configuration */
          else {
            const foundType = this[EnumProp.Fields].find((item) => item.name === key);
            if (foundType) {
              const { defaultValue } = foundType;
              if (defaultValue) {
                Reflect.set(this, key, isConstructor(defaultValue) ? new defaultValue(value) : defaultValue(value));
              }
            }
          }
        }
        else {
          Reflect.set(this, found.name, value);
        }
      }
      // Otherwise, it appears we either have some custom setter or just a property that isn't part of the fields
      else {
        this[EnumProp.FieldsInternal].push({
          name: key,
          custom: true,
        });
        Reflect.set(this, key, data[key]);
      }
    }
  }

  /**
   * This will reset the model to the values that were last committed to the record.  When the model
   * is initially created, it's all of the default values + any values set in the constructor.
   */
  reset() {
    const snapshot = this[EnumProp.Snapshot];
    if (snapshot) {
      this.set(snapshot);
    }
  }

  /**
   * This will mark any changes as the new original data, so when reset is called, this snapshot is used
   * instead of the previous snapshot.
   */
  commit() {
    if (this.TrackChanges) {
      this[EnumProp.Snapshot] = this.getData();
    }
    else {
      delete this[EnumProp.Snapshot];
    }
  }

  clone(options: IModelGetData) {
    // @ts-ignore
    return new this.constructor(this.getData(options));
  }

  set fields(value) {
    this[EnumProp.FieldsInternal] = value;
  }

  get fields() {
    const fields: IModelField[] = this[EnumProp.FieldsInternal];
    if (fields.length === 0) {
      Object.keys(this).forEach((key) => {
        let field: IModelField = {
          name: key,
        };
        const config = Reflect.get(this, key);
        if ((config as Collection)?.[EnumProp.IsCollection]) {
          field.defaultValue = [];
          field[EnumProp.IsCollection] = true;
        }
        else if ((config as Model)?.[EnumProp.IsModel]) {
          field.defaultValue = {};
          field[EnumProp.IsModel] = true;
        }
        else if (config?.constructor === Object) {
          field = {
            ...field,
            ...config,
          };
        }
        else {
          field.defaultValue = config;
          field[EnumProp.Nullable] = config == null;
        }
        fields.push(field);
      });
      this[EnumProp.Fields].forEach((item) => {
        const { name } = item;
        const found = fields.find((field) => field.name === name);
        if (found) {
          Object.assign(found, item);
        }
        else {
          fields.push(item);
        }
      });
    }
    return fields;
  }

  get TrackChanges() {
    return this[EnumProp.Track];
  }

  set TrackChanges(value) {
    this[EnumProp.Track] = value;
    this.commit();
  }

  /**
   * @param {String[]} include
   * @param {String[]} exclude
   * @returns {Object} data
   */
  getData({ include, exclude }: IModelGetData = {}) {
    const data = {};
    // Let's copy the fields because we're potentially modifying them with the include
    const fields = [...this.fields];
    if (include) {
      include.forEach((field) => fields.push({
        name: field,
      }));
    }
    // Used internally
    this[EnumProp.Visited] = true;
    for (const field of fields) {
      const { name } = field;
      if (exclude && exclude.indexOf(name) !== -1) {
        continue;
      }
      const value = Reflect.get(this, name) as IModelFull | ICollectionFull;
      if ((value as IModel)?.[EnumProp.IsModel] || (value as ICollection)?.[EnumProp.IsCollection]) {
        if (!value[EnumProp.Visited]) {
          Reflect.set(data, name, value.getData({
            include,
            exclude,
          }));
        }
      }
      else if (isArray(value) || isObject(value)) {
        Reflect.set(data, name, cloneDeep(value));
      }
      else {
        Reflect.set(data, name, value);
      }
    }
    this[EnumProp.Visited] = false;
    return data;
  }
}
