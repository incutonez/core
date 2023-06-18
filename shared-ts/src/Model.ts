import type { RecursiveObject } from "@/types";
import {
	instanceToInstance,
	plainToInstance,
	type ClassTransformOptions, instanceToPlain,
} from "class-transformer";
import { validate, ValidationError, type ValidatorOptions } from "class-validator";
import isEmpty from "just-is-empty";
import compare from "just-compare";
import "reflect-metadata";

export const IsModel = Symbol("IsModel");
export const Errors = Symbol("Errors");
export const IsDirty = Symbol("IsDirty");
export const Loaded = Symbol("Loaded");
export const Snapshot = Symbol("Snapshot");

export class Model {
	[IsModel] = true;
	[Loaded] = false;
	[Errors]: ValidationError[] = [];
	[Snapshot]: any;

	static create<T>(this: new () => T, data?: RecursiveObject<T>, options: ClassTransformOptions & {[Loaded]?: boolean} = {}) {
		const record = plainToInstance(this, data ?? {}, options) as Model;
		record[Snapshot] = record.getData();
		record[Loaded] = options[Loaded] ?? false;
		return record as T;
	}

	get [IsDirty]() {
		return compare(this.getData(), this[Snapshot]);
	}

	async isValid(options?: ValidatorOptions) {
		await this.validate(options);
		return isEmpty(this[Errors]);
	}

	async validate(options?: ValidatorOptions) {
		for (const key in this) {
			const value = this[key] as Model | Model[];
			if (Array.isArray(value)) {
				await Promise.allSettled(value.map((item) => {
					if (item?.[IsModel]) {
						return item.validate(options);
					}
				}));
			}
			else if (value?.[IsModel]) {
				await value.validate(options);
			}
		}
		this[Errors] = await validate(this, options);
	}

	setData(data: Partial<RecursiveObject<typeof this>>) {
		const record: typeof this = plainToInstance(this.constructor as any, data);
		for (const key in data) {
			Reflect.set(this, key, record[key as keyof typeof record]);
		}
	}

	getData(options?: ClassTransformOptions) {
		return instanceToPlain(this, options);
	}

	clone(options?: ClassTransformOptions) {
		return instanceToInstance(this, options);
	}
}
