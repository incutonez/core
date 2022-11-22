import { Model } from "@incutonez/shared/src/ModelV2";

class TestModel extends Model {
  Blah = 1;

  constructor(data?: any) {
    super();
    this.init(data);
  }
}

describe("Model Creation", () => {
  test("Creating Instance with Default Value", () => {
    const instance = new TestModel();
    expect(instance.Blah).toEqual(1);
  });
  test("Creating Instance with Different Value", () => {
    const instance = new TestModel({
      Blah: 22,
    });
    expect(instance.Blah).toEqual(22);
  });
});
