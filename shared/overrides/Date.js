import { MONTHS } from "../Enums.js";

const proto = Date.prototype;
const totalMonths = MONTHS.DECEMBER + 1;
proto.getMonthStart = function(config = {}) {
  let {
    year = this.getFullYear(),
    yearOffset = 0,
    month = this.getMonth(),
    monthOffset = 0,
    day = 1,
    isEnd = false,
  } = config;
  if (isEnd) {
    day = 0;
    monthOffset += 1;
  }
  return new Date(year + yearOffset, month + monthOffset, day);
};

proto.getMonthEnd = function(config = {}) {
  config.isEnd = true;
  return this.getMonthStart(config);
};

proto.getYearStart = function(config = {}) {
  config.month = MONTHS.JANUARY;
  return this.getMonthStart(config);
};

proto.getYearEnd = function(config = {}) {
  config.isEnd = true;
  config.month = MONTHS.DECEMBER;
  return this.getMonthStart(config);
};

proto.getQuarterStart = function(config = {}) {
  let { month = this.getMonth(), isEnd = false } = config;
  month = month + (config.monthOffset || 0);
  /* Check to see if we're no longer in this year, and if so, we need to determine the
   * yearOffset, as well as what the translated month should be */
  if (month < 0 || month > MONTHS.DECEMBER) {
    const identity = month < 0 ? -1 : 1;
    const inner = Math.abs(month) / totalMonths;
    const years = identity === -1 ? Math.ceil(inner) : Math.floor(inner);
    month -= years * totalMonths * identity;
    config.yearOffset = (config.yearOffset || 0) + years * identity;
  }
  if (month < MONTHS.APRIL) {
    month = isEnd ? MONTHS.MARCH : MONTHS.JANUARY;
  }
  else if (month < MONTHS.JULY) {
    month = isEnd ? MONTHS.JUNE : MONTHS.APRIL;
  }
  else if (month < MONTHS.OCTOBER) {
    month = isEnd ? MONTHS.SEPTEMBER : MONTHS.JULY;
  }
  else {
    month = isEnd ? MONTHS.DECEMBER : MONTHS.OCTOBER;
  }
  config.month = month;
  // This config value doesn't make sense, so let's always 0 it out
  config.monthOffset = 0;
  return this.getMonthStart(config);
};

proto.getQuarterEnd = function(config = {}) {
  config.isEnd = true;
  return this.getQuarterStart(config);
};