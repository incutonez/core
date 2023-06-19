// Taken from https://stackoverflow.com/a/76433206/1253609
import { Loaded } from "@/Model";
import { ClassTransformOptions } from "class-transformer";

export type RecursiveKeys<T> = {
	[P in keyof T]: T[P] extends Function ? never : P extends symbol ? never : P;
}[keyof T];

export type RecursivePrimitive = undefined | null | boolean | string | number;

export type RecursiveFields<T> =
	T extends RecursivePrimitive ? T :
	T extends (infer U)[] ? RecursiveFields<U>[] :
	T extends Map<any, any> ? (T extends Map<infer K, infer V> ? Map<K, RecursiveFields<V>> : never) :
	T extends Set<infer V> ? Set<RecursiveFields<V>> : RecursiveObject<T>;

export type RecursiveObject<T> = {
	// need to keep optionality
	[K in keyof Pick<T, RecursiveKeys<T>>]: RecursiveFields<T[K]>
}

export interface ModelCreateOptions extends ClassTransformOptions {
	[Loaded]?: boolean;
	sanitize?: boolean;
}
