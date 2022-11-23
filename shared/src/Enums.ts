/**
 * @property {Number} January
 * @property {Number} February
 * @property {Number} March
 * @property {Number} April
 * @property {Number} May
 * @property {Number} June
 * @property {Number} July
 * @property {Number} August
 * @property {Number} September
 * @property {Number} October
 * @property {Number} November
 * @property {Number} December
 */
import { Enum } from "@incutonez/shared/src/EnumV2";

export class Month extends Enum {
  January = 0;
  February = 1;
  March = 2;
  April = 3;
  May = 4;
  June = 5;
  July = 6;
  August = 7;
  September = 8;
  October = 9;
  November = 10;
  December = 11;
}

export class Weekday extends Enum {
  Sunday = 0;
  Monday = 1;
  Tuesday = 2;
  Wednesday = 3;
  Thursday = 4;
  Friday = 5;
  Saturday = 6;
}

export class FieldType extends Enum {
  String = 0;
  Integer = 1;
  Decimal = 2;
  Boolean = 3;
  Date = 4;
  Model = 5;
  Collection = 6;
  Array = 7;
  Object = 8;
}

/**
 * There's something goofy with TS and creating Symbols inline in an object, but we can circumvent this with declaring
 * the symbols on their own and then setting them in the object.
 * Source: https://www.reddit.com/r/typescript/comments/z1vjpw/using_a_symbol_to_define_a_class_property/
 */
const IsModel = Symbol("isModel");
const IsCollection = Symbol("isCollection");
const Nullable = Symbol("isNullable");
const Snapshot = Symbol("_snapshot");
const Track = Symbol("_trackChanges");
const Visited = Symbol("_visited");
const Parent = Symbol("_parent");
const FieldsInternal = Symbol("_fields");
const Fields = Symbol("fields");

export const ClassField = {
  IsModel,
  IsCollection,
  Snapshot,
  Track,
  Visited,
  Parent,
  FieldsInternal,
  Fields,
  Nullable,
} as const;

export const EnumMonth = new Month();
export const EnumWeekday = new Weekday();
export const EnumFieldType = new FieldType();
