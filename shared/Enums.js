import { Enum } from "shared/Enum.js";

/**
 * @property {Number} JANUARY
 * @property {String} JANUARY_DISPLAY
 * @property {Number} FEBRUARY
 * @property {String} FEBRUARY_DISPLAY
 * @property {Number} MARCH
 * @property {String} MARCH_DISPLAY
 * @property {Number} APRIL
 * @property {String} APRIL_DISPLAY
 * @property {Number} MAY
 * @property {String} MAY_DISPLAY
 * @property {Number} JUNE
 * @property {String} JUNE_DISPLAY
 * @property {Number} JULY
 * @property {String} JULY_DISPLAY
 * @property {Number} AUGUST
 * @property {String} AUGUST_DISPLAY
 * @property {Number} SEPTEMBER
 * @property {String} SEPTEMBER_DISPLAY
 * @property {Number} OCTOBER
 * @property {String} OCTOBER_DISPLAY
 * @property {Number} NOVEMBER
 * @property {String} NOVEMBER_DISPLAY
 * @property {Number} DECEMBER
 * @property {String} DECEMBER_DISPLAY
 */
export const MONTHS = new Enum([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

/**
 * @property {Number} SUNDAY
 * @property {String} SUNDAY_DISPLAY
 * @property {Number} MONDAY
 * @property {String} MONDAY_DISPLAY
 * @property {Number} TUESDAY
 * @property {String} TUESDAY_DISPLAY
 * @property {Number} WEDNESDAY
 * @property {String} WEDNESDAY_DISPLAY
 * @property {Number} THURSDAY
 * @property {String} THURSDAY_DISPLAY
 * @property {Number} FRIDAY
 * @property {String} FRIDAY_DISPLAY
 * @property {Number} SATURDAY
 * @property {String} SATURDAY_DISPLAY
 */
export const DAYS = new Enum([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);