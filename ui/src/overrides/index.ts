import "ui/overrides/String";
import "ui/overrides/Date";
import "ui/overrides/Array";
import type { IDateConfig } from "ui/interfaces";

declare global {
  interface String {
    capitalize(): string;
    equals(value: string): boolean;
  }

  interface Array<T> {
    remove(items: T | Function): void;
    insert(item: T, index: number): T;
    addUnique(item: T, index: number): T;
  }

  interface Date {
    getWeekStart(config?: IDateConfig): Date;
    getMonthStart(config?: IDateConfig): Date;
    getMonthEnd(config?: IDateConfig): Date;
    getYearStart(config?: IDateConfig): Date;
    getYearEnd(config?: IDateConfig): Date;
    getQuarterStart(config?: IDateConfig): Date;
    getQuarterEnd(config?: IDateConfig): Date;
    toMMDDYYYY(): string;
  }
}
