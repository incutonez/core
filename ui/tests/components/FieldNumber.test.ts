import { describe, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { mount } from "@vue/test-utils";
import FieldNumber from "../../src/components/FieldNumber.vue";
import BaseField from "../../src/components/BaseField.vue";
import "../../src/rules";
import { parseNumber } from "../../src/utilities";

describe("FieldNumber", () => {
  describe("modelValue", () => {
    it("has initial value", () => {
      const expected = faker.datatype.number();
      const wrapper = mount(FieldNumber, {
        props: {
          modelValue: expected,
          "onUpdate:modelValue": (modelValue) => wrapper.setProps({
            modelValue,
          }),
        },
      });

      /* We have to get the component because FieldNumber is essentially a pass-through and
       * doesn't have modelValue on its props */
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });

    it("updates value", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.number();
      const wrapper = mount(FieldNumber, {
        props: {
          modelValue: expectedInitial,
          "onUpdate:modelValue": (modelValue) => wrapper.setProps({
            modelValue,
          }),
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expectedInitial);
      await wrapper.find("input").setValue(expected);
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });

    it("updates value from prop", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.number();
      const wrapper = mount(FieldNumber, {
        props: {
          modelValue: expectedInitial,
          "onUpdate:modelValue": (modelValue) => wrapper.setProps({
            modelValue,
          }),
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expectedInitial);
      await wrapper.setProps({
        modelValue: expected,
      });
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });
  });

  describe("v-model", () => {
    it("has initial value", () => {
      const expected = faker.datatype.number();
      const wrapper = mount({
        template: "<FieldNumber v-model=\"value\" />",
        components: {
          FieldNumber,
        },
        data() {
          return {
            value: expected,
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });

    it("updates value", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.number();
      const wrapper = mount({
        template: "<FieldNumber v-model=\"value\" />",
        components: {
          FieldNumber,
        },
        data() {
          return {
            value: expectedInitial,
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expectedInitial);
      await wrapper.find("input").setValue(expected);
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });

    it("updates value from ref", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.number();
      const wrapper = mount({
        template: "<FieldNumber v-model=\"value\" />",
        components: {
          FieldNumber,
        },
        data() {
          return {
            value: expectedInitial,
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expectedInitial);
      await wrapper.setData({
        value: expected,
      });
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      // Inputs always return a string value, even if the type is number, so let's convert
      expect(wrapper.find("input").element.value).toStrictEqual(expected.toString());
    });
  });

  describe("validation", () => {
    it("changes precision on blur", async() => {
      const expected = faker.datatype.number({
        precision: 0.00001,
      });
      const wrapper = mount({
        template: "<FieldNumber validate-on-init v-model=\"value\" />",
        components: {
          FieldNumber,
        },
        data() {
          return {
            value: expected,
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      await wrapper.find("input").trigger("blur");
      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(parseNumber(expected));
    });
  });
});
