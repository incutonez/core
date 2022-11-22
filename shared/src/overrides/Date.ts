import { EnumWeekday, EnumMonth } from "@incutonez/shared/src/Enums";

const proto = Date.prototype;
const TotalMonths = EnumMonth.length;
const TotalDays = EnumWeekday.length;

proto.getWeekStart = function(config = {}) {
  const { year = this.getFullYear(),
    yearOffset = 0,
    month = this.getMonth(),
    dateOffset = 0,
    // This is for the end of the month
    isEnd = false,
    startingDay = EnumWeekday.Monday,
    isWeek = true } = config;
  let { monthOffset = 0,
    date = this.getDate() } = config;
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
      weekDate.setDate(weekDate.getDate() - (day + (TotalDays - startingDay)));
    }
    if (isEnd) {
      weekDate.setDate(weekDate.getDate() + EnumWeekday.Saturday);
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
  config.month = EnumMonth.January;
  return this.getMonthStart(config);
};

proto.getYearEnd = function(config = {}) {
  config.isEnd = true;
  config.month = EnumMonth.December;
  return this.getMonthStart(config);
};

proto.getQuarterStart = function(config = {}) {
  const { isEnd = false } = config;
  let { month = this.getMonth() } = config;
  month = month + (config.monthOffset || 0);
  /* Check to see if we're no longer in this year, and if so, we need to determine the
   * yearOffset, as well as what the translated month should be */
  if (month < 0 || month > EnumMonth.December) {
    const identity = month < 0 ? -1 : 1;
    const inner = Math.abs(month) / TotalMonths;
    const years = identity === -1 ? Math.ceil(inner) : Math.floor(inner);
    month -= years * TotalMonths * identity;
    config.yearOffset = (config.yearOffset || 0) + years * identity;
  }
  if (month < EnumMonth.April) {
    month = isEnd ? EnumMonth.March : EnumMonth.January;
  }
  else if (month < EnumMonth.July) {
    month = isEnd ? EnumMonth.June : EnumMonth.April;
  }
  else if (month < EnumMonth.October) {
    month = isEnd ? EnumMonth.September : EnumMonth.July;
  }
  else {
    month = isEnd ? EnumMonth.December : EnumMonth.October;
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
  return Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(this);
};
