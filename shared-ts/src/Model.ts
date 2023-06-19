import type { ModelCreateOptions, RecursiveObject } from "@/types";
import {
	instanceToInstance,
	plainToInstance,
	type ClassTransformOptions, instanceToPlain,
} from "class-transformer";
import {
	getMetadataStorage,
	validate,
	ValidationError,
	type ValidatorOptions,
} from "class-validator";
import isEmpty from "just-is-empty";
import compare from "just-compare";
import "reflect-metadata";

export const IsModel = Symbol("IsModel");
export const Errors = Symbol("Errors");
export const IsDirty = Symbol("IsDirty");
export const Loaded = Symbol("Loaded");
export const Snapshot = Symbol("Snapshot");

/**
 * This basically mimics the whitelist function in ValidationExecutor
 * Source: https://github.com/typestack/class-validator/blob/develop/src/validation/ValidationExecutor.ts#L119
 */
function sanitize(data: any) {
	const storage = getMetadataStorage();
	const targetMetadatas = storage.getTargetValidationMetadatas(data.constructor, "", false, false, []);
	const groupedMetadatas = storage.groupByPropertyName(targetMetadatas);
	Object.keys(data).forEach((propertyName) => {
		const groupedMetadata = groupedMetadatas[propertyName];
		// does this property have no metadata?
		if (!groupedMetadata || groupedMetadata.length === 0) {
			delete data[propertyName as keyof typeof data];
		}
		else if (data[propertyName]?.constructor === Object) {
			sanitize(data[propertyName]);
		}
		else if (Array.isArray(data[propertyName])) {
			data[propertyName].forEach((item: any) => sanitize(item));
		}
	});
}

export class Model {
	[IsModel] = true;
	[Loaded] = false;
	[Errors]: ValidationError[] = [];
	[Snapshot]: any;

	static create<T>(this: new () => T, data?: RecursiveObject<T>, options: ModelCreateOptions = {}) {
		const record = plainToInstance(this, data ?? {}, options) as Model;
		if (options.sanitize) {
			sanitize(record);
		}
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
