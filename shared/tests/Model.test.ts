import { Model } from "@incutonez/shared/src/ModelV2";
import { faker } from "@faker-js/faker";
import { ClassField } from "@incutonez/shared/src/Enums";
import type { IModelField } from "@incutonez/shared/src/interfaces";

const PropNumber = "PropNumber";
const PropBoolean = "PropBoolean";
const PropString = "PropString";
const PropChild = "PropChild";
const PropChildNullable = "PropChildNullable";
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

  [ClassField.Fields] = [{
    name: PropChildNullable,
    defaultValue: Child,
    [ClassField.IsModel]: true,
  }] as IModelField[];

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

describe("Model Creation", () => {
  test("Default Values", () => {
    const instance = new TestModel();
    const child = instance[PropChild];
    expect(instance[PropNumber]).toEqual(PropNumberInitial);
    expect(instance[PropBoolean]).toEqual(PropBooleanInitial);
    expect(instance[PropString]).toEqual(PropStringInitial);
    expect(child[PropNumber]).toEqual(PropChildNumberInitial);
    expect(child[PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(child[PropString]).toEqual(PropChildStringInitial);
    expect(instance[PropChildNullable]).toEqual(undefined);
  });
  test("Instance Values", () => {
    const PropNumberValue = faker.datatype.number();
    const PropBooleanValue = false;
    const PropStringValue = faker.datatype.string();
    const PropChildNumberValue = faker.datatype.number();
    const PropChildNullableStringValue = faker.datatype.string();
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
    });
    const child = instance[PropChild];
    const childNullable = instance[PropChildNullable];
    expect(instance[PropNumber]).toEqual(PropNumberValue);
    expect(instance[PropBoolean]).toEqual(PropBooleanValue);
    expect(instance[PropString]).toEqual(PropStringValue);
    expect(child[PropNumber]).toEqual(PropChildNumberValue);
    expect(child[PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(child[PropString]).toEqual(PropChildStringInitial);
    expect(childNullable![PropNumber]).toEqual(PropChildNumberInitial);
    expect(childNullable![PropBoolean]).toEqual(PropChildBooleanInitial);
    expect(childNullable![PropString]).toEqual(PropChildNullableStringValue);
  });
});
