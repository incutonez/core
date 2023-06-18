import { describe, it, expect } from "vitest";
import { UserModel } from "@/models/UserModel";
import { faker } from "@faker-js/faker";
import { Errors } from "@/Model";

describe("UserModel", () => {
	const id = faker.string.uuid();
	const username = faker.internet.userName();
	const name = faker.person.fullName();
	const line1 = faker.location.streetAddress();
	const city = faker.location.city();
	const state = faker.location.state();
	const zip = faker.location.zipCode();

	it("Should start valid", async () => {
		const record = UserModel.create({
			id,
			username,
			name,
			address: {
				line1,
				city,
				state,
				zip,
			},
		});
		const isValid = await record.isValid();
		expect(isValid).toStrictEqual(true);
		expect(record[Errors]).empty;
	});

	it("Should start invalid", async () => {
		const record = UserModel.create({
			id,
			username,
			name,
			address: {
				line1: "",
				city,
				state,
				zip,
			},
		});
		const isValid = await record.isValid();
		expect(isValid).toStrictEqual(false);
		expect(record[Errors]).not.empty;
		expect(record.address[Errors].length).toStrictEqual(1);
	});

	it("Should change to valid", async () => {
		const record = UserModel.create({
			id,
			username,
			name,
			address: {
				line1: "",
				city,
				state,
				zip,
			},
		});
		let isValid = await record.isValid();
		expect(isValid).toStrictEqual(false);
		expect(record[Errors]).not.empty;
		expect(record.address[Errors].length).toStrictEqual(1);
		record.address.line1 = line1;
		isValid = await record.isValid();
		expect(isValid).toStrictEqual(true);
		expect(record[Errors]).empty;
		expect(record.address[Errors]).empty;
	});
});
