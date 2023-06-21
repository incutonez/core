import type { ModelGetDataOptions, ModelCreateOptions, RecursiveObject } from "@/types";
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
import get from "just-safe-get";
import _ from "lodash";

export const IsModel = Symbol("IsModel");
export const Errors = Symbol("Errors");
export const IsDirty = Symbol("IsDirty");
export const Loaded = Symbol("Loaded");
export const Snapshot = Symbol("Snapshot");

const LastKeyRegex = /\.(?=[^\.]+$)/;

/**
 * This basically mimics the whitelist function in ValidationExecutor
 * Source: https://github.com/typestack/class-validator/blob/develop/src/validation/ValidationExecutor.ts#L119
 */
function sanitize(data: any) {
	const storage = getMetadataStorage();
	const targetMetadatas = storage.getTargetValidationMetadatas(data.constructor, "", false, false, []);
	const groupedMetadatas = storage.groupByPropertyName(targetMetadatas);
	Object.keys(data).forEach((key) => {
		const value = data[key];
		const groupedMetadata = groupedMetadatas[key];
		// does this property have no metadata?
		if (!groupedMetadata || groupedMetadata.length === 0) {
			delete data[key as keyof typeof data];
		}
		else if (value?.[IsModel]) {
			sanitize(value);
		}
		else if (Array.isArray(value)) {
			value.forEach((item: any) => sanitize(item));
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

	getData(options: ModelGetDataOptions = {}) {
		const data = instanceToPlain(this, options);
		const { exclude = [] } = options;
		exclude.forEach((field) => {
			if (field.includes(".")) {
				const [parentKey, key] = field.split(LastKeyRegex);
				const value = get(data, parentKey);
				if (Array.isArray(value)) {
					for (let i = value.length - 1; i >= 0; i--) {
						const item = value[i];
						delete item[key];
						// If our object is now empty because that was the last property, let's just remove it from the array
						if (isEmpty(item)) {
							value.splice(i, 1);
						}
					}
				}
				// TODO: What about Set/Map?
				else if (value instanceof Object) {
					delete value[key];
				}
				// If our object is now empty because that was the last property, let's just remove it from the array
				if (isEmpty(value)) {
					// TODO: Figure out how to do this without lodash
					_.unset(data, parentKey);
				}
			}
			else {
				delete data[field];
			}
		});
		return data;
	}

	clone(options?: ClassTransformOptions) {
		return instanceToInstance(this, options);
	}
}
