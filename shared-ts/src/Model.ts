import type { RecursiveObject } from "@/types";
import {
	instanceToInstance,
	plainToInstance,
	type ClassTransformOptions,
} from "class-transformer";
import { validate, ValidationError, type ValidatorOptions } from "class-validator";
import isEmpty from "just-is-empty";

export const IsModel = Symbol("IsModel");
export const Errors = Symbol("Errors");

export class Model {
	[IsModel] = true;
	[Errors]: ValidationError[] = [];

	static create<T>(this: new () => T, data?: RecursiveObject<T>, options?: ClassTransformOptions) {
		return plainToInstance(this, data ?? {}, options);
	}

	async isValid(options?: ValidatorOptions) {
		await this.validate(options);
		return isEmpty(this[Errors]);
	}

	async validate(options?: ValidatorOptions) {
		for (const key in this) {
			const value = this[key] as Model | Model[];
			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item?.[IsModel]) {
						item.validate(options);
					}
				});
			}
			else if (value?.[IsModel]) {
				await value.validate(options);
			}
		}
		return this[Errors] = await validate(this, options);
	}

	setData(data: Partial<RecursiveObject<typeof this>>) {
		const record: typeof this = plainToInstance(this.constructor as any, data);
		for (const key in data) {
			Reflect.set(this, key, record[key as keyof typeof record]);
		}
	}

	clone(options?: ClassTransformOptions) {
		return instanceToInstance(this, options);
	}
}
