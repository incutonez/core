import { Model } from "ui/classes/Model";
import { faker } from "@faker-js/faker";
import { EnumProp } from "ui/statics/Enums";
import { Collection } from "ui/classes/Collection";

const PropNumber = "PropNumber";
const PropBoolean = "PropBoolean";
const PropString = "PropString";
const PropChild = "PropChild";
const PropChildNullable = "PropChildNullable";
const PropCollection = "PropCollection";
const PropNumberInitial = faker.datatype.number();
const PropBooleanInitial = true;
const PropStringInitial = faker.datatype.string();
const PropChildNumberInitial = faker.datatype.number();
const PropChildBooleanInitial = false;
const PropChildStringInitial = faker.datatype.string();

class Child extends Model {
  [PropNumber] = PropChildNumberInitial;
  [PropBoolean] = PropChildBooleanInitial;
  [PropString] = PropChildStringInitial;

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

class TestModel extends Model {
  [PropNumber] = PropNumberInitial;
  [PropBoolean] = PropBooleanInitial;
  [PropString] = PropStringInitial;
  [PropChild] = new Child();
  [PropChildNullable]?: Child;
  [PropCollection] = new Collection({
    [EnumProp.Model]: Child,
  });

  [EnumProp.Fields] = [{
    name: PropChildNullable,
    defaultValue: Child,
    [EnumProp.IsModel]: true,
  }];

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

describe("Model Creation", () => {
  test("Default Values", () => {
    const instance = new TestModel();
    const child = instance[PropChild];
    const collection = instance[PropCollection];
    expect(instance[PropNumber]).toEqual(PropNumberInitial);
    expect(instance[PropBoolean]).toEqual(PropBooleanInitial);
    expect(instance[PropString]).toEqual(PropStringInitial);
    expect(child[EnumProp.IsModel]).toEqual(true);
    expect(child[PropNumber]).toEqual(PropChildNumberInitial);
    expect(child[PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(child[PropString]).toEqual(PropChildStringInitial);
    expect(instance[PropChildNullable]).toEqual(undefined);
    expect(collection[EnumProp.IsCollection]).toEqual(true);
    expect(collection.length).toEqual(0);
  });
  test("Instance Values", () => {
    const PropNumberValue = faker.datatype.number();
    const PropBooleanValue = false;
    const PropStringValue = faker.datatype.string();
    const PropChildNumberValue = faker.datatype.number();
    const PropChildNullableStringValue = faker.datatype.string();
    const PropCollectionNumberValue = faker.datatype.number();
    const PropCollectionBooleanValue = false;
    const PropCollectionStringValue = faker.datatype.string();
    const PropCollectionValue = [{
      [PropNumber]: PropNumberValue,
      [PropBoolean]: PropBooleanValue,
      [PropString]: PropStringValue,
    }, {
      [PropNumber]: PropCollectionNumberValue,
      [PropBoolean]: PropCollectionBooleanValue,
      [PropString]: PropCollectionStringValue,
    }];
    const instance = new TestModel({
      [PropNumber]: PropNumberValue,
      [PropBoolean]: PropBooleanValue,
      [PropString]: PropStringValue,
      [PropChild]: {
        [PropNumber]: PropChildNumberValue,
      },
      [PropChildNullable]: {
        [PropString]: PropChildNullableStringValue,
      },
      [PropCollection]: PropCollectionValue,
    });
    const child = instance[PropChild];
    const childNullable = instance[PropChildNullable];
    const collection = instance[PropCollection];
    const { first, last } = collection;
    expect(instance[PropNumber]).toEqual(PropNumberValue);
    expect(instance[PropBoolean]).toEqual(PropBooleanValue);
    expect(instance[PropString]).toEqual(PropStringValue);
    // Child
    expect(child[EnumProp.IsModel]).toEqual(true);
    expect(child[PropNumber]).toEqual(PropChildNumberValue);
    expect(child[PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(child[PropString]).toEqual(PropChildStringInitial);
    // Child Nullable
    expect(childNullable![EnumProp.IsModel]).toEqual(true);
    expect(childNullable![PropNumber]).toEqual(PropChildNumberInitial);
    expect(childNullable![PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(childNullable![PropString]).toEqual(PropChildNullableStringValue);
    // Collection
    expect(collection[EnumProp.IsCollection]).toEqual(true);
    expect(collection.length).toEqual(PropCollectionValue.length);
    expect(first[EnumProp.IsModel]).toEqual(true);
    expect(first[PropNumber]).toEqual(PropNumberValue);
    expect(first[PropBoolean]).toEqual(PropBooleanValue);
    expect(first[PropString]).toEqual(PropStringValue);
    expect(last[EnumProp.IsModel]).toEqual(true);
    expect(last[PropNumber]).toEqual(PropCollectionNumberValue);
    expect(last[PropBoolean]).toEqual(PropCollectionBooleanValue);
    expect(last[PropString]).toEqual(PropCollectionStringValue);
  });
});
