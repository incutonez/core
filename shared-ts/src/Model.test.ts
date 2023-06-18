import { Model } from "@/Model";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { describe, it, expect } from "vitest";
import "reflect-metadata";

class Child extends Model {
	@IsString({
		groups: ["create"],
	})
	@IsNotEmpty({
		groups: ["create"],
	})
	name?: string;
}

class Parent extends Model {
	@IsString()
	name?: string;

	@IsArray()
	@Type(() => Child)
	children?: Child[];
}

const name = "John";

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
				children: [{
					name,
				}],
			});

			expect(record.name).toEqual(name);
			let isValid = await record.isValid();
			expect(isValid).toStrictEqual(true);
			// @ts-ignore We're expecting this to be invalid
			record.name = 1;
			isValid = await record.isValid();
			expect(isValid).toStrictEqual(false);
		});

		it("Should validate create", async () => {
			const record = Parent.create({
				children: [{
					name: undefined,
				}],
			});

			expect(record.name).toEqual(undefined);
			let isValid = await record.isValid({
				groups: ["create"],
			});
			expect(isValid).toStrictEqual(false);
			// @ts-ignore We're expecting this to be invalid
			record.name = name;
			isValid = await record.isValid();
			expect(isValid).toStrictEqual(true);
		});

		it("Should validate edit", async () => {
			const record = Parent.create({
				children: [{
					name: undefined,
				}],
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
	});
});
