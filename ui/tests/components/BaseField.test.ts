import { describe, expect } from "vitest";
import BaseField from "../../src/components/BaseField.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { faker } from "@faker-js/faker";
import "../../src/rules";
import BaseLabel from "../../src/components/BaseLabel.vue";
import BaseIcon from "../../src/components/BaseIcon.vue";

describe("BaseField", () => {
  describe("modelValue", () => {
    it("has initial value", () => {
      const expected = faker.datatype.string();
      const wrapper = mount(BaseField, {
        props: {
          modelValue: expected,
          "onUpdate:modelValue": (modelValue) => wrapper.setProps({
            modelValue,
          }),
        },
      });

      expect(wrapper.props("modelValue")).toStrictEqual(expected);
      expect(wrapper.find("input").element.value).toStrictEqual(expected);
    });

    it("updates value", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.string();
      const wrapper = mount(BaseField, {
        props: {
          modelValue: expectedInitial,
          "onUpdate:modelValue": (modelValue) => wrapper.setProps({
            modelValue,
          }),
        },
      });

      expect(wrapper.props("modelValue")).toStrictEqual(expectedInitial);
      await wrapper.find("input").setValue(expected);
      expect(wrapper.props("modelValue")).toStrictEqual(expected);
      expect(wrapper.find("input").element.value).toStrictEqual(expected);
    });
  });

  describe("v-model", () => {
    it("has initial value", () => {
      const expected = faker.datatype.string();
      const wrapper = mount({
        template: "<BaseField v-model='value' />",
        components: {
          BaseField,
        },
        data() {
          return {
            value: expected,
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("modelValue")).toStrictEqual(expected);
      expect(wrapper.find("input").element.value).toStrictEqual(expected);
    });

    it("updates value", async() => {
      const expectedInitial = "";
      const expected = faker.datatype.string();
      const wrapper = mount({
        template: "<BaseField v-model='value' />",
        components: {
          BaseField,
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
      expect(wrapper.find("input").element.value).toStrictEqual(expected);
    });
  });

  describe("label", () => {
    it("has no label", () => {
      const wrapper = mount({
        template: "<BaseField />",
        components: {
          BaseField,
        },
      });

      expect(wrapper.findComponent(BaseLabel).exists()).toStrictEqual(false);
    });

    it("has label", () => {
      const expected = faker.datatype.string();
      const wrapper = mount({
        template: "<BaseField :label='expected' />",
        components: {
          BaseField,
        },
        data() {
          return {
            expected,
          };
        },
      });

      expect(wrapper.findComponent(BaseLabel).exists()).toStrictEqual(true);
      expect(wrapper.findComponent(BaseLabel).props("value")).toStrictEqual(expected);
    });
  });

  describe("errors", () => {
    it("has no errors", () => {
      const wrapper = mount({
        template: "<BaseField />",
        components: {
          BaseField,
        },
      });

      expect(wrapper.findComponent(BaseIcon).isVisible()).toStrictEqual(false);
    });

    it("has required error", async() => {
      const wrapper = mount({
        template: "<BaseField v-model='value' required validate-on-init />",
        components: {
          BaseField,
        },
        data() {
          return {
            value: "",
          };
        },
      });

      expect(wrapper.getComponent(BaseField).props("required")).toStrictEqual(true);
      await wrapper.find("input").trigger("blur");
      // Per the docs https://vee-validate.logaretm.com/v4/guide/testing#waiting-for-async-validation
      await flushPromises();
      expect(wrapper.getComponent(BaseField).emitted()).toHaveProperty("blur:field");
      expect(wrapper.findComponent(BaseIcon).isVisible()).toStrictEqual(true);
      expect(wrapper.getComponent(BaseField).vm.showErrors).toStrictEqual(1);
    });
  });
});
