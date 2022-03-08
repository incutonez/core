import { Enum } from "shared/Enum.js";

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
export const Month = new Enum(["January",
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
  "December"]);

/**
 * @property {Number} Sunday
 * @property {Number} Monday
 * @property {Number} Tuesday
 * @property {Number} Wednesday
 * @property {Number} Thursday
 * @property {Number} Friday
 * @property {Number} Saturday
 */
export const Weekday = new Enum(["Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"]);
