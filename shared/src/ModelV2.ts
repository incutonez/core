import { ClassField } from "@incutonez/shared/src/Enums";
import type { ICollection, IModel, IModelField, IModelGetData } from "@incutonez/shared/src/interfaces";
import { cloneDeep, isArray, isConstructor, isObject } from "@incutonez/shared/src/utilities";
import type { Collection } from "@incutonez/shared/src/Collection";

// TODOJEF: Move everything in shared to ui, and revert what was here originally, so we can have the JS version of it too
export class Model {
  [ClassField.IsModel] = true;
  [ClassField.Track] = false;
  [ClassField.Snapshot]?: any;
  [ClassField.Visited] = false;
  [ClassField.FieldsInternal]: any[] = [];
  // TODO: Need to figure out how to implement... get a circular dep if I do try to set it
  [ClassField.Parent]?: any;
  [ClassField.Fields]: IModelField[] = [];

  init(data = {}) {
    const { fields } = this;
    for (const field of fields) {
      const { name } = field;
      if (name in data) {
        continue;
      }
      let { defaultValue } = field;
      if (field[ClassField.Nullable]) {
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
        if (found[ClassField.IsCollection]) {
          const collection = Reflect.get(this, key) as ICollection;
          collection.add(value);
        }
        else if (found[ClassField.IsModel] && value) {
          const model = Reflect.get(this, key) as IModel;
          if (model) {
            model.set(value);
          }
          /* Otherwise, it appears we need to create a new model instance, so let's see if a definition
           * exists in our types configuration */
          else {
            const foundType = this[ClassField.Fields].find((item) => item.name === key);
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
        this[ClassField.FieldsInternal].push({
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
    const snapshot = this[ClassField.Snapshot];
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
      this[ClassField.Snapshot] = this.getData();
    }
    else {
      delete this[ClassField.Snapshot];
    }
  }

  clone(options: IModelGetData) {
    // @ts-ignore
    return new this.constructor(this.getData(options));
  }

  set fields(value) {
    this[ClassField.FieldsInternal] = value;
  }

  get fields() {
    const fields: IModelField[] = this[ClassField.FieldsInternal];
    if (fields.length === 0) {
      console.log("here", Object.keys(this));
      Object.keys(this).forEach((key) => {
        let field: IModelField = {
          name: key,
        };
        const config = Reflect.get(this, key);
        if ((config as Collection)?.[ClassField.IsCollection]) {
          field.defaultValue = [];
          field[ClassField.IsCollection] = true;
        }
        else if ((config as Model)?.[ClassField.IsModel]) {
          field.defaultValue = {};
          field[ClassField.IsModel] = true;
        }
        else if (config?.constructor === Object) {
          field = {
            ...field,
            ...config,
          };
        }
        else {
          field.defaultValue = config;
          field[ClassField.Nullable] = config == null;
        }
        fields.push(field);
      });
      this[ClassField.Fields].forEach((item) => {
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
    return this[ClassField.Track];
  }

  set TrackChanges(value) {
    this[ClassField.Track] = value;
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
    this[ClassField.Visited] = true;
    for (const field of fields) {
      const { name } = field;
      if (exclude && exclude.indexOf(name) !== -1) {
        continue;
      }
      const value = Reflect.get(this, name) as IModel | ICollection;
      if ((value as IModel)?.[ClassField.IsModel] || (value as ICollection)?.[ClassField.IsCollection]) {
        if (!value[ClassField.Visited]) {
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
    this[ClassField.Visited] = false;
    return data;
  }
}
