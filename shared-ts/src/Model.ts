import type { RecursivePartial } from "@/types";
import {
	instanceToInstance,
	plainToInstance,
	type ClassTransformOptions,
	plainToClassFromExist,
} from "class-transformer";

export class Model {
	static create<T>(this: new () => T, data?: RecursivePartial<T>): T {
		return plainToInstance(this, data);
	}

	setData(data: any) {
		console.log(plainToClassFromExist(this, data));
	}

	clone(options?: ClassTransformOptions) {
		return instanceToInstance(this, options);
	}
}
