﻿import {
  MONTHS,
  DAYS,
} from "shared/Enums.js";

const proto = Date.prototype;
const totalMonths = MONTHS.DECEMBER + 1;
// Saturday is considered the last day in JavaScript, so we add 1 to it
const totalDays = DAYS.SATURDAY + 1;

proto.getWeekStart = function(config = {}) {
  let {
    year = this.getFullYear(),
    yearOffset = 0,
    month = this.getMonth(),
    monthOffset = 0,
    date = this.getDate(),
    dateOffset = 0,
    // This is for the end of the month
    isEnd = false,
    startingDay = DAYS.MONDAY,
    isWeek = true,
  } = config;
  // Weeks deal with getting their end date differently than months
  if (!isWeek && isEnd) {
    monthOffset = 1;
    date = 0;
  }
  const weekDate = new Date(year + yearOffset, month + monthOffset, date + dateOffset);
  if (isWeek) {
    const day = weekDate.getDay();
    // If startingDay is previously in the week, we can do simple subtraction
    if (startingDay < day) {
      weekDate.setDate(weekDate.getDate() - (day - startingDay));
    }
    /* If startingDay is later in the week, we need to subtract from the total number of days in a week
     * and add to our day */
    else if (startingDay > day) {
      weekDate.setDate(weekDate.getDate() - (day + (totalDays - startingDay)));
    }
    if (isEnd) {
      weekDate.setDate(weekDate.getDate() + DAYS.SATURDAY);
    }
  }
  return weekDate;
};

proto.getMonthStart = function(config = {}) {
  config.isWeek = config.isWeek || false;
  config.date = 1;
  return this.getWeekStart(config);
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

proto.toMMDDYYYY = function() {
  return Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(this);
};
