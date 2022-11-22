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

const IsModel = Symbol("isModel");
const IsCollection = Symbol("isCollection");
const Snapshot = Symbol("_snapshot");
const Track = Symbol("_trackChanges");
const Visited = Symbol("_visited");
const Parent = Symbol("_parent");
const Fields = Symbol("_fields");
const Types = Symbol("_types");

export const ClassField = {
  IsModel,
  IsCollection,
  Snapshot,
  Track,
  Visited,
  Parent,
  Fields,
  Types,
} as const;

export enum ModelField {
  IsModel = "isModel",
  Snapshot = "_snapshot",
  Track = "_trackChanges",
  Visited = "_visited",
  Parent = "_parent",
  Fields = "_fields",
  Types = "_types",
}

export const EnumMonth = new Month();
export const EnumWeekday = new Weekday();
export const EnumFieldType = new FieldType();
