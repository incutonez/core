import { Model } from "@/Model";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { describe, it, expect } from "vitest";
import "reflect-metadata";

class Child extends Model {
	@IsOptional()
	@IsString()
	@IsNotEmpty({
		groups: ["create"],
	})
	name?: string;
}

class Parent extends Model {
	@IsString()
	name = "";

	@IsOptional()
	@IsArray()
	@ValidateNested()
	@Type(() => Child)
	children?: Child[];

	@IsOptional()
	@ValidateNested()
	@Type(() => Child)
	child? = Child.create();
}

const name = "John";
const DefaultValidation = {
	strictGroups: true,
	validationError: {
		target: false,
		value: false,
	},
};

describe("Model", () => {
	describe("Create Method", () => {
		it("Should create", () => {
			const record = Parent.create({
				name,
				children: [{
					name,
				}],
			});

			expect(record.name).toEqual(name);
		});

		it("Should be valid", async () => {
			const record = Parent.create({
				name,
			});

			expect(record.name).toEqual(name);
			let isValid = await record.isValid(DefaultValidation);
			expect(isValid).toStrictEqual(true);
			// @ts-ignore We're expecting this to be invalid
			record.name = 1;
			isValid = await record.isValid(DefaultValidation);
			expect(isValid).toStrictEqual(false);
		});

		it("Should validate create group", async () => {
			const record = Parent.create({
				// @ts-ignore This is expected to be wrong
				name: undefined,
				children: [{
					// @ts-ignore This is expected to be wrong
					name: 1,
				}],
			});

			expect(record.name).toEqual(undefined);
			let isValid = await record.isValid({
				groups: ["create"],
				always: true,
			});
			expect(isValid).toStrictEqual(false);
			record.name = name;
			record.children![0].name = name;
			isValid = await record.isValid({
				groups: ["create"],
				always: true,
			});
			expect(isValid).toStrictEqual(true);
		});

		it("Should validate edit", async () => {
			const record = Parent.create({
				// @ts-ignore expected to be wrong
				name: undefined,
			});
			expect(record.name).toEqual(undefined);
			let isValid = await record.isValid({
				strictGroups: true,
			});
			expect(isValid).toStrictEqual(false);
			// @ts-ignore We're expecting this to be invalid
			record.name = name;
			isValid = await record.isValid();
			expect(isValid).toStrictEqual(true);
		});

		it("Should strip invalid properties", async () => {
			const record = Parent.create({
				name,
				// @ts-ignore We're testing to see that this property won't be in the final record
				blah: name,
				children: [{
					name,
					// @ts-ignore We're testing to see that this property won't be in the final record
					blah: name,
				}],
			}, {
				sanitize: true,
			});
			// @ts-ignore
			expect(record.blah).toStrictEqual(undefined);
			expect(record.name).toStrictEqual(name);
			// @ts-ignore
			expect(record.children![0].blah).toStrictEqual(undefined);
			expect(record.children![0].name).toStrictEqual(name);
		});

		it("Should getData", () => {
			const record = Parent.create({
				name,
				children: [{
					name,
				}, {
					name,
				}],
			});
			let data = record.getData({
				exclude: ["children"],
			});
			expect(Object.keys(data)).not.include("children");
			expect(Object.keys(data)).include("child");
			data = record.getData({
				/* We remove all name properties from the children objects, which then makes children an empty
				 * array, which gets pruned and won't be in the final object */
				exclude: ["children.name"],
			});
			expect(Object.keys(data)).not.include("children");
			expect(Object.keys(data)).include("child");
			data = record.getData({
				/* We remove all name properties from the children objects, which then makes children an empty
				 * array, which gets pruned and won't be in the final object */
				exclude: ["child.name"],
			});
			expect(Object.keys(data)).not.include("child");
			expect(Object.keys(data)).include("children");
			data = record.getData({
				/* We remove all name properties from the children objects, which then makes children an empty
				 * array, which gets pruned and won't be in the final object */
				exclude: ["child.name", "children.name"],
			});
			expect(Object.keys(data)).not.include("child");
			expect(Object.keys(data)).not.include("children");
		});
	});
});
