import { Model } from "@/Model";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { describe, it, expect } from "vitest";
import "reflect-metadata";

class Child extends Model {
	name?: string;
}

class Parent extends Model {
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
	});
});
