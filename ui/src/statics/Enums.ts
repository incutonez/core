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
import { Enum } from "ui/classes/Enum";

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

  constructor() {
    super();
    this.init();
  }
}

export class Weekday extends Enum {
  Sunday = 0;
  Monday = 1;
  Tuesday = 2;
  Wednesday = 3;
  Thursday = 4;
  Friday = 5;
  Saturday = 6;

  constructor() {
    super();
    this.init();
  }
}

export class LabelAlign extends Enum {
  Left = "left";
  Right = "right";
  Top = "top";
  Down = "down";

  constructor() {
    super();
    this.init();
  }
}

export class TooltipPosition extends Enum {
  RightMiddle = "right-middle";
  RightTop = "right-top";
  RightBottom = "right-bottom";
  Middle = "middle";
  MiddleTop = "middle-top";
  MiddleBottom = "middle-bottom";
  LeftMiddle = "left-middle";
  LeftTop = "left-top";
  LeftBottom = "left-bottom";

  constructor() {
    super();
    this.init();
  }
}

export class TagPosition extends Enum {
  Above = "tags-above";
  Below = "tags-below";
  Inline = "tags-inline";

  constructor() {
    super();
    this.init();
  }
}

export class WizardStep extends Enum {
  Disabled = 0;
  Enabled = 1;
  Active = 2;
  Invalid = 3;
  InvalidActive = 4;
  Completed = 5;

  constructor() {
    super();
    this.init();
  }
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
const Model = Symbol("model");
const Groups = Symbol("groups");
const Sorters = Symbol("sorters");
const Data = Symbol("data");
const ModelInternal = Symbol("_model");
const FieldsInternal = Symbol("_fields");
const Fields = Symbol("fields");
const IdField = Symbol("idField");
const DisplayField = Symbol("displayField");
const GroupKey = Symbol("groupKey");
const GroupDisplay = Symbol("groupDisplay");
const DefaultValue = Symbol("default");
const Custom = Symbol("custom");
const Name = Symbol("name");

export const EnumProp = {
  IsModel,
  IsCollection,
  Snapshot,
  Track,
  Visited,
  Parent,
  Model,
  Groups,
  Sorters,
  ModelInternal,
  FieldsInternal,
  Fields,
  Nullable,
  GroupKey,
  GroupDisplay,
  Data,
  IdField,
  DisplayField,
  DefaultValue,
  Custom,
  Name,
} as const;

export const EnumMonth = new Month();
export const EnumWeekday = new Weekday();
export const EnumLabelAlign = new LabelAlign();
export const EnumTooltipPosition = new TooltipPosition();
export const EnumTagPosition = new TagPosition();
export const EnumWizardStep = new WizardStep();
