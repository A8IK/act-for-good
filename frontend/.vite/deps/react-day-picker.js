import {
  require_react
} from "./chunk-6XQFKQ5H.js";
import {
  __export,
  __publicField,
  __toESM
} from "./chunk-DP4XHQAG.js";

// node_modules/react-day-picker/dist/esm/DayPicker.js
var import_react32 = __toESM(require_react(), 1);

// node_modules/react-day-picker/dist/esm/UI.js
var UI;
(function(UI2) {
  UI2["Root"] = "root";
  UI2["Chevron"] = "chevron";
  UI2["Day"] = "day";
  UI2["DayButton"] = "day_button";
  UI2["CaptionLabel"] = "caption_label";
  UI2["Dropdowns"] = "dropdowns";
  UI2["Dropdown"] = "dropdown";
  UI2["DropdownRoot"] = "dropdown_root";
  UI2["Footer"] = "footer";
  UI2["MonthGrid"] = "month_grid";
  UI2["MonthCaption"] = "month_caption";
  UI2["MonthsDropdown"] = "months_dropdown";
  UI2["Month"] = "month";
  UI2["Months"] = "months";
  UI2["Nav"] = "nav";
  UI2["NextMonthButton"] = "button_next";
  UI2["PreviousMonthButton"] = "button_previous";
  UI2["Week"] = "week";
  UI2["Weeks"] = "weeks";
  UI2["Weekday"] = "weekday";
  UI2["Weekdays"] = "weekdays";
  UI2["WeekNumber"] = "week_number";
  UI2["WeekNumberHeader"] = "week_number_header";
  UI2["YearsDropdown"] = "years_dropdown";
})(UI || (UI = {}));
var DayFlag;
(function(DayFlag2) {
  DayFlag2["disabled"] = "disabled";
  DayFlag2["hidden"] = "hidden";
  DayFlag2["outside"] = "outside";
  DayFlag2["focused"] = "focused";
  DayFlag2["today"] = "today";
})(DayFlag || (DayFlag = {}));
var SelectionState;
(function(SelectionState2) {
  SelectionState2["range_end"] = "range_end";
  SelectionState2["range_middle"] = "range_middle";
  SelectionState2["range_start"] = "range_start";
  SelectionState2["selected"] = "selected";
})(SelectionState || (SelectionState = {}));
var Animation;
(function(Animation2) {
  Animation2["weeks_before_enter"] = "weeks_before_enter";
  Animation2["weeks_before_exit"] = "weeks_before_exit";
  Animation2["weeks_after_enter"] = "weeks_after_enter";
  Animation2["weeks_after_exit"] = "weeks_after_exit";
  Animation2["caption_after_enter"] = "caption_after_enter";
  Animation2["caption_after_exit"] = "caption_after_exit";
  Animation2["caption_before_enter"] = "caption_before_enter";
  Animation2["caption_before_exit"] = "caption_before_exit";
})(Animation || (Animation = {}));

// node_modules/@date-fns/tz/constants/index.js
var constructFromSymbol = Symbol.for("constructDateFrom");

// node_modules/@date-fns/tz/tzOffset/index.js
var offsetFormatCache = {};
var offsetCache = {};
function tzOffset(timeZone, date) {
  try {
    const format2 = offsetFormatCache[timeZone] || (offsetFormatCache[timeZone] = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      timeZoneName: "longOffset"
    }).format);
    const offsetStr = format2(date).split("GMT")[1] || "";
    if (offsetStr in offsetCache) return offsetCache[offsetStr];
    return calcOffset(offsetStr, offsetStr.split(":"));
  } catch {
    if (timeZone in offsetCache) return offsetCache[timeZone];
    const captures = timeZone == null ? void 0 : timeZone.match(offsetRe);
    if (captures) return calcOffset(timeZone, captures.slice(1));
    return NaN;
  }
}
var offsetRe = /([+-]\d\d):?(\d\d)?/;
function calcOffset(cacheStr, values) {
  const hours = +values[0];
  const minutes = +(values[1] || 0);
  return offsetCache[cacheStr] = hours > 0 ? hours * 60 + minutes : hours * 60 - minutes;
}

// node_modules/@date-fns/tz/date/mini.js
var TZDateMini = class _TZDateMini extends Date {
  //#region static
  constructor(...args) {
    super();
    if (args.length > 1 && typeof args[args.length - 1] === "string") {
      this.timeZone = args.pop();
    }
    this.internal = /* @__PURE__ */ new Date();
    if (isNaN(tzOffset(this.timeZone, this))) {
      this.setTime(NaN);
    } else {
      if (!args.length) {
        this.setTime(Date.now());
      } else if (typeof args[0] === "number" && (args.length === 1 || args.length === 2 && typeof args[1] !== "number")) {
        this.setTime(args[0]);
      } else if (typeof args[0] === "string") {
        this.setTime(+new Date(args[0]));
      } else if (args[0] instanceof Date) {
        this.setTime(+args[0]);
      } else {
        this.setTime(+new Date(...args));
        adjustToSystemTZ(this, NaN);
        syncToInternal(this);
      }
    }
  }
  static tz(tz, ...args) {
    return args.length ? new _TZDateMini(...args, tz) : new _TZDateMini(Date.now(), tz);
  }
  //#endregion
  //#region time zone
  withTimeZone(timeZone) {
    return new _TZDateMini(+this, timeZone);
  }
  getTimezoneOffset() {
    return -tzOffset(this.timeZone, this);
  }
  //#endregion
  //#region time
  setTime(time) {
    Date.prototype.setTime.apply(this, arguments);
    syncToInternal(this);
    return +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](date) {
    return new _TZDateMini(+new Date(date), this.timeZone);
  }
  //#endregion
};
var re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (!re.test(method)) return;
  const utcMethod = method.replace(re, "$1UTC");
  if (!TZDateMini.prototype[utcMethod]) return;
  if (method.startsWith("get")) {
    TZDateMini.prototype[method] = function() {
      return this.internal[utcMethod]();
    };
  } else {
    TZDateMini.prototype[method] = function() {
      Date.prototype[utcMethod].apply(this.internal, arguments);
      syncFromInternal(this);
      return +this;
    };
    TZDateMini.prototype[utcMethod] = function() {
      Date.prototype[utcMethod].apply(this, arguments);
      syncToInternal(this);
      return +this;
    };
  }
});
function syncToInternal(date) {
  date.internal.setTime(+date);
  date.internal.setUTCMinutes(date.internal.getUTCMinutes() - date.getTimezoneOffset());
}
function syncFromInternal(date) {
  Date.prototype.setFullYear.call(date, date.internal.getUTCFullYear(), date.internal.getUTCMonth(), date.internal.getUTCDate());
  Date.prototype.setHours.call(date, date.internal.getUTCHours(), date.internal.getUTCMinutes(), date.internal.getUTCSeconds(), date.internal.getUTCMilliseconds());
  adjustToSystemTZ(date);
}
function adjustToSystemTZ(date) {
  const offset = tzOffset(date.timeZone, date);
  const prevHour = /* @__PURE__ */ new Date(+date);
  prevHour.setUTCHours(prevHour.getUTCHours() - 1);
  const systemOffset = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset();
  const prevHourSystemOffset = -(/* @__PURE__ */ new Date(+prevHour)).getTimezoneOffset();
  const systemDSTChange = systemOffset - prevHourSystemOffset;
  const dstShift = Date.prototype.getHours.apply(date) !== date.internal.getUTCHours();
  if (systemDSTChange && dstShift) date.internal.setUTCMinutes(date.internal.getUTCMinutes() + systemDSTChange);
  const offsetDiff = systemOffset - offset;
  if (offsetDiff) Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetDiff);
  const postOffset = tzOffset(date.timeZone, date);
  const postSystemOffset = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset();
  const postOffsetDiff = postSystemOffset - postOffset;
  const offsetChanged = postOffset !== offset;
  const postDiff = postOffsetDiff - offsetDiff;
  if (offsetChanged && postDiff) {
    Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + postDiff);
    const newOffset = tzOffset(date.timeZone, date);
    const offsetChange = postOffset - newOffset;
    if (offsetChange) {
      date.internal.setUTCMinutes(date.internal.getUTCMinutes() + offsetChange);
      Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetChange);
    }
  }
}

// node_modules/@date-fns/tz/date/index.js
var TZDate = class _TZDate extends TZDateMini {
  //#region static
  static tz(tz, ...args) {
    return args.length ? new _TZDate(...args, tz) : new _TZDate(Date.now(), tz);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [sign, hours, minutes] = this.tzComponents();
    const tz = `${sign}${hours}:${minutes}`;
    return this.internal.toISOString().slice(0, -1) + tz;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [day, date, month, year] = this.internal.toUTCString().split(" ");
    return `${day == null ? void 0 : day.slice(0, -1)} ${month} ${date} ${year}`;
  }
  toTimeString() {
    const time = this.internal.toUTCString().split(" ")[4];
    const [sign, hours, minutes] = this.tzComponents();
    return `${time} GMT${sign}${hours}${minutes} (${tzName(this.timeZone, this)})`;
  }
  toLocaleString(locales, options) {
    return Date.prototype.toLocaleString.call(this, locales, {
      ...options,
      timeZone: (options == null ? void 0 : options.timeZone) || this.timeZone
    });
  }
  toLocaleDateString(locales, options) {
    return Date.prototype.toLocaleDateString.call(this, locales, {
      ...options,
      timeZone: (options == null ? void 0 : options.timeZone) || this.timeZone
    });
  }
  toLocaleTimeString(locales, options) {
    return Date.prototype.toLocaleTimeString.call(this, locales, {
      ...options,
      timeZone: (options == null ? void 0 : options.timeZone) || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const offset = this.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
    return [sign, hours, minutes];
  }
  //#endregion
  withTimeZone(timeZone) {
    return new _TZDate(+this, timeZone);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](date) {
    return new _TZDate(+new Date(date), this.timeZone);
  }
  //#endregion
};
function tzName(tz, date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    timeZoneName: "long"
  }).format(date).slice(12);
}

// node_modules/date-fns/constants.js
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var minTime = -maxTime;
var millisecondsInWeek = 6048e5;
var millisecondsInDay = 864e5;
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;
var constructFromSymbol2 = Symbol.for("constructDateFrom");

// node_modules/date-fns/constructFrom.js
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol2 in date)
    return date[constructFromSymbol2](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}

// node_modules/date-fns/toDate.js
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}

// node_modules/date-fns/addDays.js
function addDays(date, amount, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  if (isNaN(amount)) return constructFrom((options == null ? void 0 : options.in) || date, NaN);
  if (!amount) return _date;
  _date.setDate(_date.getDate() + amount);
  return _date;
}

// node_modules/date-fns/addMonths.js
function addMonths(date, amount, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  if (isNaN(amount)) return constructFrom((options == null ? void 0 : options.in) || date, NaN);
  if (!amount) {
    return _date;
  }
  const dayOfMonth = _date.getDate();
  const endOfDesiredMonth = constructFrom((options == null ? void 0 : options.in) || date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    _date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth
    );
    return _date;
  }
}

// node_modules/date-fns/_lib/defaultOptions.js
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// node_modules/date-fns/startOfWeek.js
function startOfWeek(date, options) {
  var _a, _b, _c, _d;
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
  const _date = toDate(date, options == null ? void 0 : options.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns/startOfISOWeek.js
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}

// node_modules/date-fns/getISOWeekYear.js
function getISOWeekYear(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

// node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}

// node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns/differenceInCalendarDays.js
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}

// node_modules/date-fns/startOfISOWeekYear.js
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom((options == null ? void 0 : options.in) || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

// node_modules/date-fns/addWeeks.js
function addWeeks(date, amount, options) {
  return addDays(date, amount * 7, options);
}

// node_modules/date-fns/addYears.js
function addYears(date, amount, options) {
  return addMonths(date, amount * 12, options);
}

// node_modules/date-fns/max.js
function max(dates, options) {
  let result;
  let context = options == null ? void 0 : options.in;
  dates.forEach((date) => {
    if (!context && typeof date === "object")
      context = constructFrom.bind(null, date);
    const date_ = toDate(date, context);
    if (!result || result < date_ || isNaN(+date_)) result = date_;
  });
  return constructFrom(context, result || NaN);
}

// node_modules/date-fns/min.js
function min(dates, options) {
  let result;
  let context = options == null ? void 0 : options.in;
  dates.forEach((date) => {
    if (!context && typeof date === "object")
      context = constructFrom.bind(null, date);
    const date_ = toDate(date, context);
    if (!result || result > date_ || isNaN(+date_)) result = date_;
  });
  return constructFrom(context, result || NaN);
}

// node_modules/date-fns/isSameDay.js
function isSameDay(laterDate, earlierDate, options) {
  const [dateLeft_, dateRight_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  return +startOfDay(dateLeft_) === +startOfDay(dateRight_);
}

// node_modules/date-fns/isDate.js
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns/isValid.js
function isValid(date) {
  return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}

// node_modules/date-fns/differenceInCalendarMonths.js
function differenceInCalendarMonths(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
  const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
  return yearsDiff * 12 + monthsDiff;
}

// node_modules/date-fns/endOfMonth.js
function endOfMonth(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// node_modules/date-fns/_lib/normalizeInterval.js
function normalizeInterval(context, interval) {
  const [start, end] = normalizeDates(context, interval.start, interval.end);
  return { start, end };
}

// node_modules/date-fns/eachMonthOfInterval.js
function eachMonthOfInterval(interval, options) {
  const { start, end } = normalizeInterval(options == null ? void 0 : options.in, interval);
  let reversed = +start > +end;
  const endTime = reversed ? +start : +end;
  const date = reversed ? end : start;
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  let step = (options == null ? void 0 : options.step) ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }
  const dates = [];
  while (+date <= endTime) {
    dates.push(constructFrom(start, date));
    date.setMonth(date.getMonth() + step);
  }
  return reversed ? dates.reverse() : dates;
}

// node_modules/date-fns/startOfMonth.js
function startOfMonth(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  _date.setDate(1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns/endOfYear.js
function endOfYear(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// node_modules/date-fns/startOfYear.js
function startOfYear(date, options) {
  const date_ = toDate(date, options == null ? void 0 : options.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}

// node_modules/date-fns/endOfWeek.js
function endOfWeek(date, options) {
  var _a, _b, _c, _d;
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
  const _date = toDate(date, options == null ? void 0 : options.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  _date.setDate(_date.getDate() + diff);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// node_modules/date-fns/endOfISOWeek.js
function endOfISOWeek(date, options) {
  return endOfWeek(date, { ...options, weekStartsOn: 1 });
}

// node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options == null ? void 0 : options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};

// node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}

// node_modules/date-fns/locale/en-US/_lib/formatLong.js
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-US/_lib/formatRelative.js
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];

// node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// node_modules/date-fns/locale/en-US/_lib/localize.js
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
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
    "December"
  ]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// node_modules/date-fns/locale/en-US/_lib/match.js
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/en-US.js
var enUS = {
  code: "en-US",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

// node_modules/date-fns/getDayOfYear.js
function getDayOfYear(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

// node_modules/date-fns/getISOWeek.js
function getISOWeek(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// node_modules/date-fns/getWeekYear.js
function getWeekYear(date, options) {
  var _a, _b, _c, _d;
  const _date = toDate(date, options == null ? void 0 : options.in);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
  const firstWeekOfNextYear = constructFrom((options == null ? void 0 : options.in) || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom((options == null ? void 0 : options.in) || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/startOfWeekYear.js
function startOfWeekYear(date, options) {
  var _a, _b, _c, _d;
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom((options == null ? void 0 : options.in) || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

// node_modules/date-fns/getWeek.js
function getWeek(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

// node_modules/date-fns/_lib/format/lightFormatters.js
var lightFormatters = {
  // Year
  y(date, token) {
    const signedYear = date.getFullYear();
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },
  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },
  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },
  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },
  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

// node_modules/date-fns/_lib/format/formatters.js
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters = {
  // Era
  G: function(date, token, localize86) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize86.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize86.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize86.era(era, { width: "wide" });
    }
  },
  // Year
  y: function(date, token, localize86) {
    if (token === "yo") {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize86.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize86, options) {
    const signedWeekYear = getWeekYear(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize86.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    const isoWeekYear = getISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize86) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize86.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize86.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize86.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize86.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize86) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize86.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize86.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize86.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize86.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize86) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize86.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize86.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize86.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize86.month(month, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(date, token, localize86) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize86.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize86.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize86.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize86.month(month, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(date, token, localize86, options) {
    const week2 = getWeek(date, options);
    if (token === "wo") {
      return localize86.ordinalNumber(week2, { unit: "week" });
    }
    return addLeadingZeros(week2, token.length);
  },
  // ISO week of year
  I: function(date, token, localize86) {
    const isoWeek = getISOWeek(date);
    if (token === "Io") {
      return localize86.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize86) {
    if (token === "do") {
      return localize86.ordinalNumber(date.getDate(), { unit: "date" });
    }
    return lightFormatters.d(date, token);
  },
  // Day of year
  D: function(date, token, localize86) {
    const dayOfYear = getDayOfYear(date);
    if (token === "Do") {
      return localize86.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize86) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize86.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize86.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize86.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize86.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize86, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize86.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize86.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize86.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize86.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize86.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize86, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize86.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize86.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize86.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize86.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize86.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize86) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize86.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize86.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize86.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize86.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize86.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize86) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize86) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize86) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize86.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize86) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize86.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize86) {
    if (token === "Ho") {
      return localize86.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize86) {
    const hours = date.getHours() % 12;
    if (token === "Ko") {
      return localize86.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize86) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize86.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function(date, token, localize86) {
    if (token === "mo") {
      return localize86.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters.m(date, token);
  },
  // Second
  s: function(date, token, localize86) {
    if (token === "so") {
      return localize86.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize) {
    const timestamp = Math.trunc(+date / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize) {
    return addLeadingZeros(+date, token.length);
  }
};
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

// node_modules/date-fns/_lib/format/longFormatters.js
var dateLongFormatter = (pattern, formatLong94) => {
  switch (pattern) {
    case "P":
      return formatLong94.date({ width: "short" });
    case "PP":
      return formatLong94.date({ width: "medium" });
    case "PPP":
      return formatLong94.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong94.date({ width: "full" });
  }
};
var timeLongFormatter = (pattern, formatLong94) => {
  switch (pattern) {
    case "p":
      return formatLong94.time({ width: "short" });
    case "pp":
      return formatLong94.time({ width: "medium" });
    case "ppp":
      return formatLong94.time({ width: "long" });
    case "pppp":
    default:
      return formatLong94.time({ width: "full" });
  }
};
var dateTimeLongFormatter = (pattern, formatLong94) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong94);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong94.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong94.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong94.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong94.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong94)).replace("{{time}}", timeLongFormatter(timePattern, formatLong94));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

// node_modules/date-fns/_lib/protectedTokens.js
var dayOfYearTokenRE = /^D+$/;
var weekYearTokenRE = /^Y+$/;
var throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format2, input) {
  const _message = message(token, format2, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format2, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// node_modules/date-fns/format.js
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(date, formatStr, options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const defaultOptions2 = getDefaultOptions();
  const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
  const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_f = (_e = options == null ? void 0 : options.locale) == null ? void 0 : _e.options) == null ? void 0 : _f.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_h = (_g = defaultOptions2.locale) == null ? void 0 : _g.options) == null ? void 0 : _h.weekStartsOn) ?? 0;
  const originalDate = toDate(date, options == null ? void 0 : options.in);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!(options == null ? void 0 : options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token) || !(options == null ? void 0 : options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

// node_modules/date-fns/getDaysInMonth.js
function getDaysInMonth(date, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const year = _date.getFullYear();
  const monthIndex = _date.getMonth();
  const lastDayOfMonth2 = constructFrom(_date, 0);
  lastDayOfMonth2.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth2.setHours(0, 0, 0, 0);
  return lastDayOfMonth2.getDate();
}

// node_modules/date-fns/getISODay.js
function getISODay(date, options) {
  const day = toDate(date, options == null ? void 0 : options.in).getDay();
  return day === 0 ? 7 : day;
}

// node_modules/date-fns/getMonth.js
function getMonth(date, options) {
  return toDate(date, options == null ? void 0 : options.in).getMonth();
}

// node_modules/date-fns/getYear.js
function getYear(date, options) {
  return toDate(date, options == null ? void 0 : options.in).getFullYear();
}

// node_modules/date-fns/isAfter.js
function isAfter(date, dateToCompare) {
  return +toDate(date) > +toDate(dateToCompare);
}

// node_modules/date-fns/isBefore.js
function isBefore(date, dateToCompare) {
  return +toDate(date) < +toDate(dateToCompare);
}

// node_modules/date-fns/parse/_lib/Setter.js
var Setter = class {
  constructor() {
    __publicField(this, "subPriority", 0);
  }
  validate(_utcDate, _options) {
    return true;
  }
};
var ValueSetter = class extends Setter {
  constructor(value, validateValue, setValue, priority, subPriority) {
    super();
    this.value = value;
    this.validateValue = validateValue;
    this.setValue = setValue;
    this.priority = priority;
    if (subPriority) {
      this.subPriority = subPriority;
    }
  }
  validate(date, options) {
    return this.validateValue(date, this.value, options);
  }
  set(date, flags, options) {
    return this.setValue(date, flags, this.value, options);
  }
};

// node_modules/date-fns/parse/_lib/Parser.js
var Parser = class {
  run(dateString, token, match85, options) {
    const result = this.parse(dateString, token, match85, options);
    if (!result) {
      return null;
    }
    return {
      setter: new ValueSetter(
        result.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority
      ),
      rest: result.rest
    };
  }
  validate(_utcDate, _value, _options) {
    return true;
  }
};

// node_modules/date-fns/parse/_lib/parsers/EraParser.js
var EraParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 140);
    __publicField(this, "incompatibleTokens", ["R", "u", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return match85.era(dateString, { width: "abbreviated" }) || match85.era(dateString, { width: "narrow" });
      // A, B
      case "GGGGG":
        return match85.era(dateString, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return match85.era(dateString, { width: "wide" }) || match85.era(dateString, { width: "abbreviated" }) || match85.era(dateString, { width: "narrow" });
    }
  }
  set(date, flags, value) {
    flags.era = value;
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/constants.js
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};

// node_modules/date-fns/parse/_lib/utils.js
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  const sign = matchResult[1] === "+" ? 1 : -1;
  const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  const isCommonEra = currentYear > 0;
  const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  let result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    const rangeEnd = absCurrentYear + 50;
    const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
    const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

// node_modules/date-fns/parse/_lib/parsers/YearParser.js
var YearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token, match85) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "yy"
    });
    switch (token) {
      case "y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "yo":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value) {
    const currentYear = date.getFullYear();
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(normalizedTwoDigitYear, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/LocalWeekYearParser.js
var LocalWeekYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "YY"
    });
    switch (token) {
      case "Y":
        return mapValue(parseNDigits(4, dateString), valueCallback);
      case "Yo":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "year"
          }),
          valueCallback
        );
      default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
  }
  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }
  set(date, flags, value, options) {
    const currentYear = getWeekYear(date, options);
    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = normalizeTwoDigitYear(
        value.year,
        currentYear
      );
      date.setFullYear(
        normalizedTwoDigitYear,
        0,
        options.firstWeekContainsDate
      );
      date.setHours(0, 0, 0, 0);
      return startOfWeek(date, options);
    }
    const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, options.firstWeekContainsDate);
    date.setHours(0, 0, 0, 0);
    return startOfWeek(date, options);
  }
};

// node_modules/date-fns/parse/_lib/parsers/ISOWeekYearParser.js
var ISOWeekYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", [
      "G",
      "y",
      "Y",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token) {
    if (token === "R") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    const firstWeekOfYear = constructFrom(date, 0);
    firstWeekOfYear.setFullYear(value, 0, 4);
    firstWeekOfYear.setHours(0, 0, 0, 0);
    return startOfISOWeek(firstWeekOfYear);
  }
};

// node_modules/date-fns/parse/_lib/parsers/ExtendedYearParser.js
var ExtendedYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 130);
    __publicField(this, "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token) {
    if (token === "u") {
      return parseNDigitsSigned(4, dateString);
    }
    return parseNDigitsSigned(token.length, dateString);
  }
  set(date, _flags, value) {
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/QuarterParser.js
var QuarterParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 120);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
      case "QQ":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return match85.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return match85.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return match85.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return match85.quarter(dateString, {
          width: "wide",
          context: "formatting"
        }) || match85.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/StandAloneQuarterParser.js
var StandAloneQuarterParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 120);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      // 1, 2, 3, 4
      case "q":
      case "qq":
        return parseNDigits(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return match85.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return match85.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return match85.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return match85.quarter(dateString, {
          width: "wide",
          context: "standalone"
        }) || match85.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 4;
  }
  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/MonthParser.js
var MonthParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "L",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
    __publicField(this, "priority", 110);
  }
  parse(dateString, token, match85) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "M":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "MM":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "MMM":
        return match85.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.month(dateString, { width: "narrow", context: "formatting" });
      // J, F, ..., D
      case "MMMMM":
        return match85.month(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return match85.month(dateString, { width: "wide", context: "formatting" }) || match85.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.month(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/StandAloneMonthParser.js
var StandAloneMonthParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 110);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    const valueCallback = (value) => value - 1;
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return mapValue(
          parseNumericPattern(numericPatterns.month, dateString),
          valueCallback
        );
      // 01, 02, ..., 12
      case "LL":
        return mapValue(parseNDigits(2, dateString), valueCallback);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "month"
          }),
          valueCallback
        );
      // Jan, Feb, ..., Dec
      case "LLL":
        return match85.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.month(dateString, { width: "narrow", context: "standalone" });
      // J, F, ..., D
      case "LLLLL":
        return match85.month(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return match85.month(dateString, { width: "wide", context: "standalone" }) || match85.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.month(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/setWeek.js
function setWeek(date, week2, options) {
  const date_ = toDate(date, options == null ? void 0 : options.in);
  const diff = getWeek(date_, options) - week2;
  date_.setDate(date_.getDate() - diff * 7);
  return toDate(date_, options == null ? void 0 : options.in);
}

// node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.js
var LocalWeekParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 100);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "w":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "wo":
        return match85.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value, options) {
    return startOfWeek(setWeek(date, value, options), options);
  }
};

// node_modules/date-fns/setISOWeek.js
function setISOWeek(date, week2, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const diff = getISOWeek(_date, options) - week2;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}

// node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.js
var ISOWeekParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 100);
    __publicField(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "I":
        return parseNumericPattern(numericPatterns.week, dateString);
      case "Io":
        return match85.ordinalNumber(dateString, { unit: "week" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 53;
  }
  set(date, _flags, value) {
    return startOfISOWeek(setISOWeek(date, value));
  }
};

// node_modules/date-fns/parse/_lib/parsers/DateParser.js
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [
  31,
  29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];
var DateParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "subPriority", 1);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "d":
        return parseNumericPattern(numericPatterns.date, dateString);
      case "do":
        return match85.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear2 = isLeapYearIndex(year);
    const month = date.getMonth();
    if (isLeapYear2) {
      return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
    } else {
      return value >= 1 && value <= DAYS_IN_MONTH[month];
    }
  }
  set(date, _flags, value) {
    date.setDate(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/DayOfYearParser.js
var DayOfYearParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "subpriority", 1);
    __publicField(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "E",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "D":
      case "DD":
        return parseNumericPattern(numericPatterns.dayOfYear, dateString);
      case "Do":
        return match85.ordinalNumber(dateString, { unit: "date" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear2 = isLeapYearIndex(year);
    if (isLeapYear2) {
      return value >= 1 && value <= 366;
    } else {
      return value >= 1 && value <= 365;
    }
  }
  set(date, _flags, value) {
    date.setMonth(0, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/setDay.js
function setDay(date, day, options) {
  var _a, _b, _c, _d;
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
  const date_ = toDate(date, options == null ? void 0 : options.in);
  const currentDay = date_.getDay();
  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;
  const delta = 7 - weekStartsOn;
  const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
  return addDays(date_, diff, options);
}

// node_modules/date-fns/parse/_lib/parsers/DayParser.js
var DayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return match85.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "EEEEE":
        return match85.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "EEEE":
      default:
        return match85.day(dateString, { width: "wide", context: "formatting" }) || match85.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/LocalDayParser.js
var LocalDayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "e":
      case "ee":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "eo":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "eee":
        return match85.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
      // T
      case "eeeee":
        return match85.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
      // Tuesday
      case "eeee":
      default:
        return match85.day(dateString, { width: "wide", context: "formatting" }) || match85.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.day(dateString, { width: "short", context: "formatting" }) || match85.day(dateString, { width: "narrow", context: "formatting" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/StandAloneLocalDayParser.js
var StandAloneLocalDayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "e",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85, options) {
    const valueCallback = (value) => {
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
    };
    switch (token) {
      // 3
      case "c":
      case "cc":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      // 3rd
      case "co":
        return mapValue(
          match85.ordinalNumber(dateString, {
            unit: "day"
          }),
          valueCallback
        );
      // Tue
      case "ccc":
        return match85.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.day(dateString, { width: "short", context: "standalone" }) || match85.day(dateString, { width: "narrow", context: "standalone" });
      // T
      case "ccccc":
        return match85.day(dateString, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return match85.day(dateString, { width: "short", context: "standalone" }) || match85.day(dateString, { width: "narrow", context: "standalone" });
      // Tuesday
      case "cccc":
      default:
        return match85.day(dateString, { width: "wide", context: "standalone" }) || match85.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match85.day(dateString, { width: "short", context: "standalone" }) || match85.day(dateString, { width: "narrow", context: "standalone" });
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 6;
  }
  set(date, _flags, value, options) {
    date = setDay(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/setISODay.js
function setISODay(date, day, options) {
  const date_ = toDate(date, options == null ? void 0 : options.in);
  const currentDay = getISODay(date_, options);
  const diff = day - currentDay;
  return addDays(date_, diff, options);
}

// node_modules/date-fns/parse/_lib/parsers/ISODayParser.js
var ISODayParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 90);
    __publicField(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "E",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(dateString, token, match85) {
    const valueCallback = (value) => {
      if (value === 0) {
        return 7;
      }
      return value;
    };
    switch (token) {
      // 2
      case "i":
      case "ii":
        return parseNDigits(token.length, dateString);
      // 2nd
      case "io":
        return match85.ordinalNumber(dateString, { unit: "day" });
      // Tue
      case "iii":
        return mapValue(
          match85.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // T
      case "iiiii":
        return mapValue(
          match85.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tu
      case "iiiiii":
        return mapValue(
          match85.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
      // Tuesday
      case "iiii":
      default:
        return mapValue(
          match85.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match85.day(dateString, {
            width: "narrow",
            context: "formatting"
          }),
          valueCallback
        );
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 7;
  }
  set(date, _flags, value) {
    date = setISODay(date, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/AMPMParser.js
var AMPMParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "a":
      case "aa":
      case "aaa":
        return match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaaa":
        return match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return match85.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/AMPMMidnightParser.js
var AMPMMidnightParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "b":
      case "bb":
      case "bbb":
        return match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbbb":
        return match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return match85.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/DayPeriodParser.js
var DayPeriodParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 80);
    __publicField(this, "incompatibleTokens", ["a", "b", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBBB":
        return match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return match85.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match85.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(date, _flags, value) {
    date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/Hour1to12Parser.js
var Hour1to12Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["H", "K", "k", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "h":
        return parseNumericPattern(numericPatterns.hour12h, dateString);
      case "ho":
        return match85.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 12;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else if (!isPM && value === 12) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/Hour0to23Parser.js
var Hour0to23Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "H":
        return parseNumericPattern(numericPatterns.hour23h, dateString);
      case "Ho":
        return match85.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 23;
  }
  set(date, _flags, value) {
    date.setHours(value, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/Hour0To11Parser.js
var Hour0To11Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["h", "H", "k", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "K":
        return parseNumericPattern(numericPatterns.hour11h, dateString);
      case "Ko":
        return match85.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 11;
  }
  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/Hour1To24Parser.js
var Hour1To24Parser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 70);
    __publicField(this, "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "k":
        return parseNumericPattern(numericPatterns.hour24h, dateString);
      case "ko":
        return match85.ordinalNumber(dateString, { unit: "hour" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 1 && value <= 24;
  }
  set(date, _flags, value) {
    const hours = value <= 24 ? value % 24 : value;
    date.setHours(hours, 0, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/MinuteParser.js
var MinuteParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 60);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "m":
        return parseNumericPattern(numericPatterns.minute, dateString);
      case "mo":
        return match85.ordinalNumber(dateString, { unit: "minute" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setMinutes(value, 0, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/SecondParser.js
var SecondParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 50);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token, match85) {
    switch (token) {
      case "s":
        return parseNumericPattern(numericPatterns.second, dateString);
      case "so":
        return match85.ordinalNumber(dateString, { unit: "second" });
      default:
        return parseNDigits(token.length, dateString);
    }
  }
  validate(_date, value) {
    return value >= 0 && value <= 59;
  }
  set(date, _flags, value) {
    date.setSeconds(value, 0);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/FractionOfSecondParser.js
var FractionOfSecondParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 30);
    __publicField(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(dateString, token) {
    const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
    return mapValue(parseNDigits(token.length, dateString), valueCallback);
  }
  set(date, _flags, value) {
    date.setMilliseconds(value);
    return date;
  }
};

// node_modules/date-fns/parse/_lib/parsers/ISOTimezoneWithZParser.js
var ISOTimezoneWithZParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 10);
    __publicField(this, "incompatibleTokens", ["t", "T", "x"]);
  }
  parse(dateString, token) {
    switch (token) {
      case "X":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "XX":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "XXXX":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "XXXXX":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "XXX":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
};

// node_modules/date-fns/parse/_lib/parsers/ISOTimezoneParser.js
var ISOTimezoneParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 10);
    __publicField(this, "incompatibleTokens", ["t", "T", "X"]);
  }
  parse(dateString, token) {
    switch (token) {
      case "x":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalMinutes,
          dateString
        );
      case "xx":
        return parseTimezonePattern(timezonePatterns.basic, dateString);
      case "xxxx":
        return parseTimezonePattern(
          timezonePatterns.basicOptionalSeconds,
          dateString
        );
      case "xxxxx":
        return parseTimezonePattern(
          timezonePatterns.extendedOptionalSeconds,
          dateString
        );
      case "xxx":
      default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
    }
  }
  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return constructFrom(
      date,
      date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
    );
  }
};

// node_modules/date-fns/parse/_lib/parsers/TimestampSecondsParser.js
var TimestampSecondsParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 40);
    __publicField(this, "incompatibleTokens", "*");
  }
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
  }
};

// node_modules/date-fns/parse/_lib/parsers/TimestampMillisecondsParser.js
var TimestampMillisecondsParser = class extends Parser {
  constructor() {
    super(...arguments);
    __publicField(this, "priority", 20);
    __publicField(this, "incompatibleTokens", "*");
  }
  parse(dateString) {
    return parseAnyDigitsSigned(dateString);
  }
  set(date, _flags, value) {
    return [constructFrom(date, value), { timestampIsSet: true }];
  }
};

// node_modules/date-fns/parse/_lib/parsers.js
var parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};

// node_modules/date-fns/isSameMonth.js
function isSameMonth(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  return laterDate_.getFullYear() === earlierDate_.getFullYear() && laterDate_.getMonth() === earlierDate_.getMonth();
}

// node_modules/date-fns/isSameYear.js
function isSameYear(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  return laterDate_.getFullYear() === earlierDate_.getFullYear();
}

// node_modules/date-fns/setMonth.js
function setMonth(date, month, options) {
  const _date = toDate(date, options == null ? void 0 : options.in);
  const year = _date.getFullYear();
  const day = _date.getDate();
  const midMonth = constructFrom((options == null ? void 0 : options.in) || date, 0);
  midMonth.setFullYear(year, month, 15);
  midMonth.setHours(0, 0, 0, 0);
  const daysInMonth = getDaysInMonth(midMonth);
  _date.setMonth(month, Math.min(day, daysInMonth));
  return _date;
}

// node_modules/date-fns/setYear.js
function setYear(date, year, options) {
  const date_ = toDate(date, options == null ? void 0 : options.in);
  if (isNaN(+date_)) return constructFrom((options == null ? void 0 : options.in) || date, NaN);
  date_.setFullYear(year);
  return date_;
}

// node_modules/date-fns/locale/af/_lib/formatLong.js
var dateFormats2 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "yyyy/MM/dd"
};
var timeFormats2 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats2 = {
  full: "{{date}} 'om' {{time}}",
  long: "{{date}} 'om' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong2 = {
  date: buildFormatLongFn({
    formats: dateFormats2,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats2,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats2,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/af/_lib/localize.js
var eraValues2 = {
  narrow: ["vC", "nC"],
  abbreviated: ["vC", "nC"],
  wide: ["voor Christus", "na Christus"]
};
var quarterValues2 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1ste kwartaal", "2de kwartaal", "3de kwartaal", "4de kwartaal"]
};
var monthValues2 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mrt",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ],
  wide: [
    "Januarie",
    "Februarie",
    "Maart",
    "April",
    "Mei",
    "Junie",
    "Julie",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ]
};
var dayValues2 = {
  narrow: ["S", "M", "D", "W", "D", "V", "S"],
  short: ["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa"],
  abbreviated: ["Son", "Maa", "Din", "Woe", "Don", "Vry", "Sat"],
  wide: [
    "Sondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrydag",
    "Saterdag"
  ]
};
var dayPeriodValues2 = {
  narrow: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "middaguur",
    morning: "oggend",
    afternoon: "middag",
    evening: "laat middag",
    night: "aand"
  },
  abbreviated: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "middaguur",
    morning: "oggend",
    afternoon: "middag",
    evening: "laat middag",
    night: "aand"
  },
  wide: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "middaguur",
    morning: "oggend",
    afternoon: "middag",
    evening: "laat middag",
    night: "aand"
  }
};
var formattingDayPeriodValues2 = {
  narrow: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "uur die middag",
    morning: "uur die oggend",
    afternoon: "uur die middag",
    evening: "uur die aand",
    night: "uur die aand"
  },
  abbreviated: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "uur die middag",
    morning: "uur die oggend",
    afternoon: "uur die middag",
    evening: "uur die aand",
    night: "uur die aand"
  },
  wide: {
    am: "vm",
    pm: "nm",
    midnight: "middernag",
    noon: "uur die middag",
    morning: "uur die oggend",
    afternoon: "uur die middag",
    evening: "uur die aand",
    night: "uur die aand"
  }
};
var ordinalNumber2 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 < 20) {
    switch (rem100) {
      case 1:
      case 8:
        return number + "ste";
      default:
        return number + "de";
    }
  }
  return number + "ste";
};
var localize2 = {
  ordinalNumber: ordinalNumber2,
  era: buildLocalizeFn({
    values: eraValues2,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues2,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues2,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues2,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues2,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues2,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/af/_lib/match.js
var matchOrdinalNumberPattern2 = /^(\d+)(ste|de)?/i;
var parseOrdinalNumberPattern2 = /\d+/i;
var matchEraPatterns2 = {
  narrow: /^([vn]\.? ?C\.?)/,
  abbreviated: /^([vn]\. ?C\.?)/,
  wide: /^((voor|na) Christus)/
};
var parseEraPatterns2 = {
  any: [/^v/, /^n/]
};
var matchQuarterPatterns2 = {
  narrow: /^[1234]/i,
  abbreviated: /^K[1234]/i,
  wide: /^[1234](st|d)e kwartaal/i
};
var parseQuarterPatterns2 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns2 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(Jan|Feb|Mrt|Apr|Mei|Jun|Jul|Aug|Sep|Okt|Nov|Dec)\.?/i,
  wide: /^(Januarie|Februarie|Maart|April|Mei|Junie|Julie|Augustus|September|Oktober|November|Desember)/i
};
var parseMonthPatterns2 = {
  narrow: [
    /^J/i,
    /^F/i,
    /^M/i,
    /^A/i,
    /^M/i,
    /^J/i,
    /^J/i,
    /^A/i,
    /^S/i,
    /^O/i,
    /^N/i,
    /^D/i
  ],
  any: [
    /^Jan/i,
    /^Feb/i,
    /^Mrt/i,
    /^Apr/i,
    /^Mei/i,
    /^Jun/i,
    /^Jul/i,
    /^Aug/i,
    /^Sep/i,
    /^Okt/i,
    /^Nov/i,
    /^Dec/i
  ]
};
var matchDayPatterns2 = {
  narrow: /^[smdwv]/i,
  short: /^(So|Ma|Di|Wo|Do|Vr|Sa)/i,
  abbreviated: /^(Son|Maa|Din|Woe|Don|Vry|Sat)/i,
  wide: /^(Sondag|Maandag|Dinsdag|Woensdag|Donderdag|Vrydag|Saterdag)/i
};
var parseDayPatterns2 = {
  narrow: [/^S/i, /^M/i, /^D/i, /^W/i, /^D/i, /^V/i, /^S/i],
  any: [/^So/i, /^Ma/i, /^Di/i, /^Wo/i, /^Do/i, /^Vr/i, /^Sa/i]
};
var matchDayPeriodPatterns2 = {
  any: /^(vm|nm|middernag|(?:uur )?die (oggend|middag|aand))/i
};
var parseDayPeriodPatterns2 = {
  any: {
    am: /^vm/i,
    pm: /^nm/i,
    midnight: /^middernag/i,
    noon: /^middaguur/i,
    morning: /oggend/i,
    afternoon: /middag/i,
    evening: /laat middag/i,
    night: /aand/i
  }
};
var match2 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern2,
    parsePattern: parseOrdinalNumberPattern2,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns2,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns2,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns2,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns2,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns2,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns2,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar/_lib/formatLong.js
var dateFormats3 = {
  full: "EEEE، do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "dd/MM/yyyy"
};
var timeFormats3 = {
  full: "HH:mm:ss",
  long: "HH:mm:ss",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats3 = {
  full: "{{date}} 'عند الساعة' {{time}}",
  long: "{{date}} 'عند الساعة' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong3 = {
  date: buildFormatLongFn({
    formats: dateFormats3,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats3,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats3,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar/_lib/localize.js
var eraValues3 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues3 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues3 = {
  narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
  abbreviated: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ],
  wide: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ]
};
var dayValues3 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues3 = {
  narrow: {
    am: "ص",
    pm: "م",
    morning: "الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "المساء",
    night: "الليل",
    midnight: "منتصف الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    morning: "الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "المساء",
    night: "الليل",
    midnight: "منتصف الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    morning: "الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "المساء",
    night: "الليل",
    midnight: "منتصف الليل"
  }
};
var formattingDayPeriodValues3 = {
  narrow: {
    am: "ص",
    pm: "م",
    morning: "في الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل",
    midnight: "منتصف الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    morning: "في الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل",
    midnight: "منتصف الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    morning: "في الصباح",
    noon: "الظهر",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل",
    midnight: "منتصف الليل"
  }
};
var ordinalNumber3 = (num) => String(num);
var localize3 = {
  ordinalNumber: ordinalNumber3,
  era: buildLocalizeFn({
    values: eraValues3,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues3,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues3,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues3,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues3,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues3,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar/_lib/match.js
var matchOrdinalNumberPattern3 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern3 = /\d+/i;
var matchEraPatterns3 = {
  narrow: /[قب]/,
  abbreviated: /[قب]\.م\./,
  wide: /(قبل|بعد) الميلاد/
};
var parseEraPatterns3 = {
  any: [/قبل/, /بعد/]
};
var matchQuarterPatterns3 = {
  narrow: /^[1234]/i,
  abbreviated: /ر[1234]/,
  wide: /الربع (الأول|الثاني|الثالث|الرابع)/
};
var parseQuarterPatterns3 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns3 = {
  narrow: /^[أيفمسند]/,
  abbreviated: /^(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/,
  wide: /^(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/
};
var parseMonthPatterns3 = {
  narrow: [
    /^ي/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ي/i,
    /^ي/i,
    /^أ/i,
    /^س/i,
    /^أ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^يناير/i,
    /^فبراير/i,
    /^مارس/i,
    /^أبريل/i,
    /^مايو/i,
    /^يونيو/i,
    /^يوليو/i,
    /^أغسطس/i,
    /^سبتمبر/i,
    /^أكتوبر/i,
    /^نوفمبر/i,
    /^ديسمبر/i
  ]
};
var matchDayPatterns3 = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
};
var parseDayPatterns3 = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الاثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i
  ],
  any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
};
var matchDayPeriodPatterns3 = {
  narrow: /^(ص|م|منتصف الليل|الظهر|بعد الظهر|في الصباح|في المساء|في الليل)/,
  any: /^(ص|م|منتصف الليل|الظهر|بعد الظهر|في الصباح|في المساء|في الليل)/
};
var parseDayPeriodPatterns3 = {
  any: {
    am: /^ص/,
    pm: /^م/,
    midnight: /منتصف الليل/,
    noon: /الظهر/,
    afternoon: /بعد الظهر/,
    morning: /في الصباح/,
    evening: /في المساء/,
    night: /في الليل/
  }
};
var match3 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern3,
    parsePattern: parseOrdinalNumberPattern3,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns3,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns3,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns3,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns3,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns3,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns3,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns3,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns3,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns3,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns3,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar-DZ/_lib/formatLong.js
var dateFormats4 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats4 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats4 = {
  full: "{{date}} 'عند' {{time}}",
  long: "{{date}} 'عند' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong4 = {
  date: buildFormatLongFn({
    formats: dateFormats4,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats4,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats4,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar-DZ/_lib/localize.js
var eraValues4 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues4 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues4 = {
  narrow: ["ج", "ف", "م", "أ", "م", "ج", "ج", "أ", "س", "أ", "ن", "د"],
  abbreviated: [
    "جانـ",
    "فيفـ",
    "مارس",
    "أفريل",
    "مايـ",
    "جوانـ",
    "جويـ",
    "أوت",
    "سبتـ",
    "أكتـ",
    "نوفـ",
    "ديسـ"
  ],
  wide: [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ]
};
var dayValues4 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues4 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  }
};
var formattingDayPeriodValues4 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "في الصباح",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  }
};
var ordinalNumber4 = (dirtyNumber) => {
  return String(dirtyNumber);
};
var localize4 = {
  ordinalNumber: ordinalNumber4,
  era: buildLocalizeFn({
    values: eraValues4,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues4,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues4,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues4,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues4,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues4,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar-DZ/_lib/match.js
var matchOrdinalNumberPattern4 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern4 = /\d+/i;
var matchEraPatterns4 = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
  wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
};
var parseEraPatterns4 = {
  any: [/^قبل/i, /^بعد/i]
};
var matchQuarterPatterns4 = {
  narrow: /^[1234]/i,
  abbreviated: /^ر[1234]/i,
  wide: /^الربع [1234]/i
};
var parseQuarterPatterns4 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns4 = {
  narrow: /^[جفمأسند]/i,
  abbreviated: /^(جان|فيف|مار|أفر|ماي|جوا|جوي|أوت|سبت|أكت|نوف|ديس)/i,
  wide: /^(جانفي|فيفري|مارس|أفريل|ماي|جوان|جويلية|أوت|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/i
};
var parseMonthPatterns4 = {
  narrow: [
    /^ج/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ج/i,
    /^ج/i,
    /^أ/i,
    /^س/i,
    /^أ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^جان/i,
    /^فيف/i,
    /^مار/i,
    /^أفر/i,
    /^ماي/i,
    /^جوا/i,
    /^جوي/i,
    /^أوت/i,
    /^سبت/i,
    /^أكت/i,
    /^نوف/i,
    /^ديس/i
  ]
};
var matchDayPatterns4 = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|اثن|ثلا|أرب|خمي|جمعة|سبت)/i,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
};
var parseDayPatterns4 = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الاثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i
  ],
  any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
};
var matchDayPeriodPatterns4 = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns4 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match4 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern4,
    parsePattern: parseOrdinalNumberPattern4,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns4,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns4,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns4,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns4,
    defaultParseWidth: "any",
    valueCallback: (index) => Number(index) + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns4,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns4,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns4,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns4,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns4,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns4,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar-EG/_lib/formatLong.js
var dateFormats5 = {
  full: "EEEE، do MMMM y",
  long: "do MMMM y",
  medium: "dd/MMM/y",
  short: "d/MM/y"
};
var timeFormats5 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats5 = {
  full: "{{date}} 'الساعة' {{time}}",
  long: "{{date}} 'الساعة' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong5 = {
  date: buildFormatLongFn({
    formats: dateFormats5,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats5,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats5,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar-EG/_lib/localize.js
var eraValues5 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م", "ب.م"],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues5 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues5 = {
  narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
  abbreviated: [
    "ينا",
    "فبر",
    "مارس",
    "أبريل",
    "مايو",
    "يونـ",
    "يولـ",
    "أغسـ",
    "سبتـ",
    "أكتـ",
    "نوفـ",
    "ديسـ"
  ],
  wide: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ]
};
var dayValues5 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues5 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءً",
    night: "ليلاً"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهراً",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءً",
    night: "ليلاً"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهراً",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءً",
    night: "ليلاً"
  }
};
var formattingDayPeriodValues5 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهراً",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    morning: "في الصباح",
    noon: "ظهراً",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  }
};
var ordinalNumber5 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize5 = {
  ordinalNumber: ordinalNumber5,
  era: buildLocalizeFn({
    values: eraValues5,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues5,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues5,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues5,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues5,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues5,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar-EG/_lib/match.js
var matchOrdinalNumberPattern5 = /^(\d+)/;
var parseOrdinalNumberPattern5 = /\d+/i;
var matchEraPatterns5 = {
  narrow: /^(ق|ب)/g,
  abbreviated: /^(ق.م|ب.م)/g,
  wide: /^(قبل الميلاد|بعد الميلاد)/g
};
var parseEraPatterns5 = {
  any: [/^ق/g, /^ب/g]
};
var matchQuarterPatterns5 = {
  narrow: /^[1234]/,
  abbreviated: /^ر[1234]/,
  wide: /^الربع (الأول|الثاني|الثالث|الرابع)/
};
var parseQuarterPatterns5 = {
  wide: [/الربع الأول/, /الربع الثاني/, /الربع الثالث/, /الربع الرابع/],
  any: [/1/, /2/, /3/, /4/]
};
var matchMonthPatterns5 = {
  narrow: /^(ي|ف|م|أ|س|ن|د)/,
  abbreviated: /^(ينا|فبر|مارس|أبريل|مايو|يونـ|يولـ|أغسـ|سبتـ|أكتـ|نوفـ|ديسـ)/,
  wide: /^(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/
};
var parseMonthPatterns5 = {
  narrow: [
    /^ي/,
    /^ف/,
    /^م/,
    /^أ/,
    /^م/,
    /^ي/,
    /^ي/,
    /^أ/,
    /^س/,
    /^أ/,
    /^ن/,
    /^د/
  ],
  any: [
    /^ينا/,
    /^فبر/,
    /^مارس/,
    /^أبريل/,
    /^مايو/,
    /^يون/,
    /^يول/,
    /^أغس/,
    /^سبت/,
    /^أكت/,
    /^نوف/,
    /^ديس/
  ]
};
var matchDayPatterns5 = {
  narrow: /^(ح|ن|ث|ر|خ|ج|س)/,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/,
  abbreviated: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/
};
var parseDayPatterns5 = {
  narrow: [/^ح/, /^ن/, /^ث/, /^ر/, /^خ/, /^ج/, /^س/],
  any: [/أحد/, /اثنين/, /ثلاثاء/, /أربعاء/, /خميس/, /جمعة/, /سبت/]
};
var matchDayPeriodPatterns5 = {
  narrow: /^(ص|م|ن|ظ|في الصباح|بعد الظهر|في المساء|في الليل)/,
  abbreviated: /^(ص|م|نصف الليل|ظهراً|في الصباح|بعد الظهر|في المساء|في الليل)/,
  wide: /^(ص|م|نصف الليل|في الصباح|ظهراً|بعد الظهر|في المساء|في الليل)/,
  any: /^(ص|م|صباح|ظهر|مساء|ليل)/
};
var parseDayPeriodPatterns5 = {
  any: {
    am: /^ص/,
    pm: /^م/,
    midnight: /^ن/,
    noon: /^ظ/,
    morning: /^ص/,
    afternoon: /^بعد/,
    evening: /^م/,
    night: /^ل/
  }
};
var match5 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern5,
    parsePattern: parseOrdinalNumberPattern5,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns5,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns5,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns5,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns5,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns5,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns5,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns5,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns5,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns5,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns5,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar-MA/_lib/formatLong.js
var dateFormats6 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats6 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats6 = {
  full: "{{date}} 'عند' {{time}}",
  long: "{{date}} 'عند' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong6 = {
  date: buildFormatLongFn({
    formats: dateFormats6,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats6,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats6,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar-MA/_lib/localize.js
var eraValues6 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues6 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues6 = {
  narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "غ", "ش", "أ", "ن", "د"],
  abbreviated: [
    "ينا",
    "فبر",
    "مارس",
    "أبريل",
    "ماي",
    "يونـ",
    "يولـ",
    "غشت",
    "شتنـ",
    "أكتـ",
    "نونـ",
    "دجنـ"
  ],
  wide: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "ماي",
    "يونيو",
    "يوليوز",
    "غشت",
    "شتنبر",
    "أكتوبر",
    "نونبر",
    "دجنبر"
  ]
};
var dayValues6 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues6 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  }
};
var formattingDayPeriodValues6 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "في الصباح",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  }
};
var ordinalNumber6 = (dirtyNumber) => {
  return String(dirtyNumber);
};
var localize6 = {
  ordinalNumber: ordinalNumber6,
  era: buildLocalizeFn({
    values: eraValues6,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues6,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues6,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues6,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues6,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues6,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar-MA/_lib/match.js
var matchOrdinalNumberPattern6 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern6 = /\d+/i;
var matchEraPatterns6 = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
  wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
};
var parseEraPatterns6 = {
  any: [/^قبل/i, /^بعد/i]
};
var matchQuarterPatterns6 = {
  narrow: /^[1234]/i,
  abbreviated: /^ر[1234]/i,
  wide: /^الربع [1234]/i
};
var parseQuarterPatterns6 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns6 = {
  narrow: /^[يفمأمسند]/i,
  abbreviated: /^(ين|ف|مار|أب|ماي|يون|يول|غش|شت|أك|ن|د)/i,
  wide: /^(ين|ف|مار|أب|ماي|يون|يول|غش|شت|أك|ن|د)/i
};
var parseMonthPatterns6 = {
  narrow: [
    /^ي/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ي/i,
    /^ي/i,
    /^غ/i,
    /^ش/i,
    /^أ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^ين/i,
    /^فب/i,
    /^مار/i,
    /^أب/i,
    /^ماي/i,
    /^يون/i,
    /^يول/i,
    /^غشت/i,
    /^ش/i,
    /^أك/i,
    /^ن/i,
    /^د/i
  ]
};
var matchDayPatterns6 = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|إثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|إثن|ثلا|أرب|خمي|جمعة|سبت)/i,
  wide: /^(الأحد|الإثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
};
var parseDayPatterns6 = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الإثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i
  ],
  any: [/^أح/i, /^إث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
};
var matchDayPeriodPatterns6 = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns6 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match6 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern6,
    parsePattern: parseOrdinalNumberPattern6,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns6,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns6,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns6,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns6,
    defaultParseWidth: "any",
    valueCallback: (index) => Number(index) + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns6,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns6,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns6,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns6,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns6,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns6,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar-SA/_lib/formatLong.js
var dateFormats7 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats7 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats7 = {
  full: "{{date}} 'عند' {{time}}",
  long: "{{date}} 'عند' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong7 = {
  date: buildFormatLongFn({
    formats: dateFormats7,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats7,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats7,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar-SA/_lib/localize.js
var eraValues7 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues7 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues7 = {
  narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
  abbreviated: [
    "ينا",
    "فبر",
    "مارس",
    "أبريل",
    "مايو",
    "يونـ",
    "يولـ",
    "أغسـ",
    "سبتـ",
    "أكتـ",
    "نوفـ",
    "ديسـ"
  ],
  wide: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ]
};
var dayValues7 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues7 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً"
  }
};
var formattingDayPeriodValues7 = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "في الصباح",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل"
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل"
  }
};
var ordinalNumber7 = (dirtyNumber) => {
  return String(dirtyNumber);
};
var localize7 = {
  ordinalNumber: ordinalNumber7,
  era: buildLocalizeFn({
    values: eraValues7,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues7,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues7,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues7,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues7,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues7,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar-SA/_lib/match.js
var matchOrdinalNumberPattern7 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern7 = /\d+/i;
var matchEraPatterns7 = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
  wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i
};
var parseEraPatterns7 = {
  any: [/^قبل/i, /^بعد/i]
};
var matchQuarterPatterns7 = {
  narrow: /^[1234]/i,
  abbreviated: /^ر[1234]/i,
  wide: /^الربع [1234]/i
};
var parseQuarterPatterns7 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns7 = {
  narrow: /^[يفمأمسند]/i,
  abbreviated: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i,
  wide: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i
};
var parseMonthPatterns7 = {
  narrow: [
    /^ي/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ي/i,
    /^ي/i,
    /^أ/i,
    /^س/i,
    /^أ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^ين/i,
    /^ف/i,
    /^مار/i,
    /^أب/i,
    /^ماي/i,
    /^يون/i,
    /^يول/i,
    /^أغ/i,
    /^س/i,
    /^أك/i,
    /^ن/i,
    /^د/i
  ]
};
var matchDayPatterns7 = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|اثن|ثلا|أرب|خمي|جمعة|سبت)/i,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
};
var parseDayPatterns7 = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الاثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i
  ],
  any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
};
var matchDayPeriodPatterns7 = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns7 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match7 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern7,
    parsePattern: parseOrdinalNumberPattern7,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns7,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns7,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns7,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns7,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns7,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns7,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns7,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns7,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns7,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns7,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ar-TN/_lib/formatLong.js
var dateFormats8 = {
  full: "EEEE، do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "dd/MM/yyyy"
};
var timeFormats8 = {
  full: "HH:mm:ss",
  long: "HH:mm:ss",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats8 = {
  full: "{{date}} 'مع' {{time}}",
  long: "{{date}} 'مع' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong8 = {
  date: buildFormatLongFn({
    formats: dateFormats8,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats8,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats8,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ar-TN/_lib/localize.js
var eraValues8 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"]
};
var quarterValues8 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]
};
var monthValues8 = {
  narrow: ["د", "ن", "أ", "س", "أ", "ج", "ج", "م", "أ", "م", "ف", "ج"],
  abbreviated: [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ],
  wide: [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ]
};
var dayValues8 = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
  ]
};
var dayPeriodValues8 = {
  narrow: {
    am: "ص",
    pm: "ع",
    morning: "الصباح",
    noon: "القايلة",
    afternoon: "بعد القايلة",
    evening: "العشية",
    night: "الليل",
    midnight: "نص الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "ع",
    morning: "الصباح",
    noon: "القايلة",
    afternoon: "بعد القايلة",
    evening: "العشية",
    night: "الليل",
    midnight: "نص الليل"
  },
  wide: {
    am: "ص",
    pm: "ع",
    morning: "الصباح",
    noon: "القايلة",
    afternoon: "بعد القايلة",
    evening: "العشية",
    night: "الليل",
    midnight: "نص الليل"
  }
};
var formattingDayPeriodValues8 = {
  narrow: {
    am: "ص",
    pm: "ع",
    morning: "في الصباح",
    noon: "في القايلة",
    afternoon: "بعد القايلة",
    evening: "في العشية",
    night: "في الليل",
    midnight: "نص الليل"
  },
  abbreviated: {
    am: "ص",
    pm: "ع",
    morning: "في الصباح",
    noon: "في القايلة",
    afternoon: "بعد القايلة",
    evening: "في العشية",
    night: "في الليل",
    midnight: "نص الليل"
  },
  wide: {
    am: "ص",
    pm: "ع",
    morning: "في الصباح",
    noon: "في القايلة",
    afternoon: "بعد القايلة",
    evening: "في العشية",
    night: "في الليل",
    midnight: "نص الليل"
  }
};
var ordinalNumber8 = (num) => String(num);
var localize8 = {
  ordinalNumber: ordinalNumber8,
  era: buildLocalizeFn({
    values: eraValues8,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues8,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues8,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues8,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues8,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues8,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ar-TN/_lib/match.js
var matchOrdinalNumberPattern8 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern8 = /\d+/i;
var matchEraPatterns8 = {
  narrow: /[قب]/,
  abbreviated: /[قب]\.م\./,
  wide: /(قبل|بعد) الميلاد/
};
var parseEraPatterns8 = {
  any: [/قبل/, /بعد/]
};
var matchQuarterPatterns8 = {
  narrow: /^[1234]/i,
  abbreviated: /ر[1234]/,
  wide: /الربع (الأول|الثاني|الثالث|الرابع)/
};
var parseQuarterPatterns8 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns8 = {
  narrow: /^[جفمأسند]/,
  abbreviated: /^(جانفي|فيفري|مارس|أفريل|ماي|جوان|جويلية|أوت|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/,
  wide: /^(جانفي|فيفري|مارس|أفريل|ماي|جوان|جويلية|أوت|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/
};
var parseMonthPatterns8 = {
  narrow: [
    /^ج/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ج/i,
    /^ج/i,
    /^أ/i,
    /^س/i,
    /^أ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^جانفي/i,
    /^فيفري/i,
    /^مارس/i,
    /^أفريل/i,
    /^ماي/i,
    /^جوان/i,
    /^جويلية/i,
    /^أوت/i,
    /^سبتمبر/i,
    /^أكتوبر/i,
    /^نوفمبر/i,
    /^ديسمبر/i
  ]
};
var matchDayPatterns8 = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i
};
var parseDayPatterns8 = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الاثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i
  ],
  any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i]
};
var matchDayPeriodPatterns8 = {
  narrow: /^(ص|ع|ن ل|ل|(في|مع) (صباح|قايلة|عشية|ليل))/,
  any: /^([صع]|نص الليل|قايلة|(في|مع) (صباح|قايلة|عشية|ليل))/
};
var parseDayPeriodPatterns8 = {
  any: {
    am: /^ص/,
    pm: /^ع/,
    midnight: /نص الليل/,
    noon: /قايلة/,
    afternoon: /بعد القايلة/,
    morning: /صباح/,
    evening: /عشية/,
    night: /ليل/
  }
};
var match8 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern8,
    parsePattern: parseOrdinalNumberPattern8,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns8,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns8,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns8,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns8,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns8,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns8,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns8,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns8,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns8,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns8,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/az/_lib/formatLong.js
var dateFormats9 = {
  full: "EEEE, do MMMM y 'il'",
  long: "do MMMM y 'il'",
  medium: "d MMM y 'il'",
  short: "dd.MM.yyyy"
};
var timeFormats9 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats9 = {
  full: "{{date}} {{time}} - 'də'",
  long: "{{date}} {{time}} - 'də'",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong9 = {
  date: buildFormatLongFn({
    formats: dateFormats9,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats9,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats9,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/az/_lib/localize.js
var eraValues9 = {
  narrow: ["e.ə", "b.e"],
  abbreviated: ["e.ə", "b.e"],
  wide: ["eramızdan əvvəl", "bizim era"]
};
var quarterValues9 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1ci kvartal", "2ci kvartal", "3cü kvartal", "4cü kvartal"]
};
var monthValues9 = {
  narrow: ["Y", "F", "M", "A", "M", "İ", "İ", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "İyun",
    "İyul",
    "Avq",
    "Sen",
    "Okt",
    "Noy",
    "Dek"
  ],
  wide: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
  ]
};
var dayValues9 = {
  narrow: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
  short: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
  abbreviated: ["Baz", "Baz.e", "Çər.a", "Çər", "Cüm.a", "Cüm", "Şə"],
  wide: [
    "Bazar",
    "Bazar ertəsi",
    "Çərşənbə axşamı",
    "Çərşənbə",
    "Cümə axşamı",
    "Cümə",
    "Şənbə"
  ]
};
var dayPeriodValues9 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  }
};
var formattingDayPeriodValues9 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gecəyarı",
    noon: "gün",
    morning: "səhər",
    afternoon: "gündüz",
    evening: "axşam",
    night: "gecə"
  }
};
var suffixes = {
  1: "-inci",
  5: "-inci",
  8: "-inci",
  70: "-inci",
  80: "-inci",
  2: "-nci",
  7: "-nci",
  20: "-nci",
  50: "-nci",
  3: "-üncü",
  4: "-üncü",
  100: "-üncü",
  6: "-ncı",
  9: "-uncu",
  10: "-uncu",
  30: "-uncu",
  60: "-ıncı",
  90: "-ıncı"
};
var getSuffix = (number) => {
  if (number === 0) {
    return number + "-ıncı";
  }
  const a = number % 10;
  const b = number % 100 - a;
  const c = number >= 100 ? 100 : null;
  if (suffixes[a]) {
    return suffixes[a];
  } else if (suffixes[b]) {
    return suffixes[b];
  } else if (c !== null) {
    return suffixes[c];
  }
  return "";
};
var ordinalNumber9 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const suffix = getSuffix(number);
  return number + suffix;
};
var localize9 = {
  ordinalNumber: ordinalNumber9,
  era: buildLocalizeFn({
    values: eraValues9,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues9,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues9,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues9,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues9,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues9,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/az/_lib/match.js
var matchOrdinalNumberPattern9 = /^(\d+)(-?(ci|inci|nci|uncu|üncü|ncı))?/i;
var parseOrdinalNumberPattern9 = /\d+/i;
var matchEraPatterns9 = {
  narrow: /^(b|a)$/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)$/i,
  wide: /^(bizim eradan əvvəl|bizim era)$/i
};
var parseEraPatterns9 = {
  any: [/^b$/i, /^(a|c)$/i]
};
var matchQuarterPatterns9 = {
  narrow: /^[1234]$/i,
  abbreviated: /^K[1234]$/i,
  wide: /^[1234](ci)? kvartal$/i
};
var parseQuarterPatterns9 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns9 = {
  narrow: /^[(?-i)yfmaisond]$/i,
  abbreviated: /^(Yan|Fev|Mar|Apr|May|İyun|İyul|Avq|Sen|Okt|Noy|Dek)$/i,
  wide: /^(Yanvar|Fevral|Mart|Aprel|May|İyun|İyul|Avgust|Sentyabr|Oktyabr|Noyabr|Dekabr)$/i
};
var parseMonthPatterns9 = {
  narrow: [
    /^[(?-i)y]$/i,
    /^[(?-i)f]$/i,
    /^[(?-i)m]$/i,
    /^[(?-i)a]$/i,
    /^[(?-i)m]$/i,
    /^[(?-i)i]$/i,
    /^[(?-i)i]$/i,
    /^[(?-i)a]$/i,
    /^[(?-i)s]$/i,
    /^[(?-i)o]$/i,
    /^[(?-i)n]$/i,
    /^[(?-i)d]$/i
  ],
  abbreviated: [
    /^Yan$/i,
    /^Fev$/i,
    /^Mar$/i,
    /^Apr$/i,
    /^May$/i,
    /^İyun$/i,
    /^İyul$/i,
    /^Avg$/i,
    /^Sen$/i,
    /^Okt$/i,
    /^Noy$/i,
    /^Dek$/i
  ],
  wide: [
    /^Yanvar$/i,
    /^Fevral$/i,
    /^Mart$/i,
    /^Aprel$/i,
    /^May$/i,
    /^İyun$/i,
    /^İyul$/i,
    /^Avgust$/i,
    /^Sentyabr$/i,
    /^Oktyabr$/i,
    /^Noyabr$/i,
    /^Dekabr$/i
  ]
};
var matchDayPatterns9 = {
  narrow: /^(B\.|B\.e|Ç\.a|Ç\.|C\.a|C\.|Ş\.)$/i,
  short: /^(B\.|B\.e|Ç\.a|Ç\.|C\.a|C\.|Ş\.)$/i,
  abbreviated: /^(Baz\.e|Çər|Çər\.a|Cüm|Cüm\.a|Şə)$/i,
  wide: /^(Bazar|Bazar ertəsi|Çərşənbə axşamı|Çərşənbə|Cümə axşamı|Cümə|Şənbə)$/i
};
var parseDayPatterns9 = {
  narrow: [
    /^B\.$/i,
    /^B\.e$/i,
    /^Ç\.a$/i,
    /^Ç\.$/i,
    /^C\.a$/i,
    /^C\.$/i,
    /^Ş\.$/i
  ],
  abbreviated: [
    /^Baz$/i,
    /^Baz\.e$/i,
    /^Çər\.a$/i,
    /^Çər$/i,
    /^Cüm\.a$/i,
    /^Cüm$/i,
    /^Şə$/i
  ],
  wide: [
    /^Bazar$/i,
    /^Bazar ertəsi$/i,
    /^Çərşənbə axşamı$/i,
    /^Çərşənbə$/i,
    /^Cümə axşamı$/i,
    /^Cümə$/i,
    /^Şənbə$/i
  ],
  any: [
    /^B\.$/i,
    /^B\.e$/i,
    /^Ç\.a$/i,
    /^Ç\.$/i,
    /^C\.a$/i,
    /^C\.$/i,
    /^Ş\.$/i
  ]
};
var matchDayPeriodPatterns9 = {
  narrow: /^(a|p|gecəyarı|gün|səhər|gündüz|axşam|gecə)$/i,
  any: /^(am|pm|a\.m\.|p\.m\.|AM|PM|gecəyarı|gün|səhər|gündüz|axşam|gecə)$/i
};
var parseDayPeriodPatterns9 = {
  any: {
    am: /^a$/i,
    pm: /^p$/i,
    midnight: /^gecəyarı$/i,
    noon: /^gün$/i,
    morning: /səhər$/i,
    afternoon: /gündüz$/i,
    evening: /axşam$/i,
    night: /gecə$/i
  }
};
var match9 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern9,
    parsePattern: parseOrdinalNumberPattern9,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns9,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns9,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns9,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns9,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns9,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns9,
    defaultParseWidth: "narrow"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns9,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns9,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns9,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns9,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/be/_lib/formatDistance.js
function declension(scheme, count) {
  if (scheme.one !== void 0 && count === 1) {
    return scheme.one;
  }
  const rem10 = count % 10;
  const rem100 = count % 100;
  if (rem10 === 1 && rem100 !== 11) {
    return scheme.singularNominative.replace("{{count}}", String(count));
  } else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 > 20)) {
    return scheme.singularGenitive.replace("{{count}}", String(count));
  } else {
    return scheme.pluralGenitive.replace("{{count}}", String(count));
  }
}
function buildLocalizeTokenFn(scheme) {
  return (count, options) => {
    if (options && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        if (scheme.future) {
          return declension(scheme.future, count);
        } else {
          return "праз " + declension(scheme.regular, count);
        }
      } else {
        if (scheme.past) {
          return declension(scheme.past, count);
        } else {
          return declension(scheme.regular, count) + " таму";
        }
      }
    } else {
      return declension(scheme.regular, count);
    }
  };
}
var halfAMinute = (_, options) => {
  if (options && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "праз паўхвіліны";
    } else {
      return "паўхвіліны таму";
    }
  }
  return "паўхвіліны";
};
var formatDistanceLocale2 = {
  lessThanXSeconds: buildLocalizeTokenFn({
    regular: {
      one: "менш за секунду",
      singularNominative: "менш за {{count}} секунду",
      singularGenitive: "менш за {{count}} секунды",
      pluralGenitive: "менш за {{count}} секунд"
    },
    future: {
      one: "менш, чым праз секунду",
      singularNominative: "менш, чым праз {{count}} секунду",
      singularGenitive: "менш, чым праз {{count}} секунды",
      pluralGenitive: "менш, чым праз {{count}} секунд"
    }
  }),
  xSeconds: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} секунда",
      singularGenitive: "{{count}} секунды",
      pluralGenitive: "{{count}} секунд"
    },
    past: {
      singularNominative: "{{count}} секунду таму",
      singularGenitive: "{{count}} секунды таму",
      pluralGenitive: "{{count}} секунд таму"
    },
    future: {
      singularNominative: "праз {{count}} секунду",
      singularGenitive: "праз {{count}} секунды",
      pluralGenitive: "праз {{count}} секунд"
    }
  }),
  halfAMinute,
  lessThanXMinutes: buildLocalizeTokenFn({
    regular: {
      one: "менш за хвіліну",
      singularNominative: "менш за {{count}} хвіліну",
      singularGenitive: "менш за {{count}} хвіліны",
      pluralGenitive: "менш за {{count}} хвілін"
    },
    future: {
      one: "менш, чым праз хвіліну",
      singularNominative: "менш, чым праз {{count}} хвіліну",
      singularGenitive: "менш, чым праз {{count}} хвіліны",
      pluralGenitive: "менш, чым праз {{count}} хвілін"
    }
  }),
  xMinutes: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} хвіліна",
      singularGenitive: "{{count}} хвіліны",
      pluralGenitive: "{{count}} хвілін"
    },
    past: {
      singularNominative: "{{count}} хвіліну таму",
      singularGenitive: "{{count}} хвіліны таму",
      pluralGenitive: "{{count}} хвілін таму"
    },
    future: {
      singularNominative: "праз {{count}} хвіліну",
      singularGenitive: "праз {{count}} хвіліны",
      pluralGenitive: "праз {{count}} хвілін"
    }
  }),
  aboutXHours: buildLocalizeTokenFn({
    regular: {
      singularNominative: "каля {{count}} гадзіны",
      singularGenitive: "каля {{count}} гадзін",
      pluralGenitive: "каля {{count}} гадзін"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} гадзіну",
      singularGenitive: "прыблізна праз {{count}} гадзіны",
      pluralGenitive: "прыблізна праз {{count}} гадзін"
    }
  }),
  xHours: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} гадзіна",
      singularGenitive: "{{count}} гадзіны",
      pluralGenitive: "{{count}} гадзін"
    },
    past: {
      singularNominative: "{{count}} гадзіну таму",
      singularGenitive: "{{count}} гадзіны таму",
      pluralGenitive: "{{count}} гадзін таму"
    },
    future: {
      singularNominative: "праз {{count}} гадзіну",
      singularGenitive: "праз {{count}} гадзіны",
      pluralGenitive: "праз {{count}} гадзін"
    }
  }),
  xDays: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} дзень",
      singularGenitive: "{{count}} дні",
      pluralGenitive: "{{count}} дзён"
    }
  }),
  aboutXWeeks: buildLocalizeTokenFn({
    regular: {
      singularNominative: "каля {{count}} тыдні",
      singularGenitive: "каля {{count}} тыдняў",
      pluralGenitive: "каля {{count}} тыдняў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} тыдзень",
      singularGenitive: "прыблізна праз {{count}} тыдні",
      pluralGenitive: "прыблізна праз {{count}} тыдняў"
    }
  }),
  xWeeks: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} тыдзень",
      singularGenitive: "{{count}} тыдні",
      pluralGenitive: "{{count}} тыдняў"
    }
  }),
  aboutXMonths: buildLocalizeTokenFn({
    regular: {
      singularNominative: "каля {{count}} месяца",
      singularGenitive: "каля {{count}} месяцаў",
      pluralGenitive: "каля {{count}} месяцаў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} месяц",
      singularGenitive: "прыблізна праз {{count}} месяцы",
      pluralGenitive: "прыблізна праз {{count}} месяцаў"
    }
  }),
  xMonths: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} месяц",
      singularGenitive: "{{count}} месяцы",
      pluralGenitive: "{{count}} месяцаў"
    }
  }),
  aboutXYears: buildLocalizeTokenFn({
    regular: {
      singularNominative: "каля {{count}} года",
      singularGenitive: "каля {{count}} гадоў",
      pluralGenitive: "каля {{count}} гадоў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} год",
      singularGenitive: "прыблізна праз {{count}} гады",
      pluralGenitive: "прыблізна праз {{count}} гадоў"
    }
  }),
  xYears: buildLocalizeTokenFn({
    regular: {
      singularNominative: "{{count}} год",
      singularGenitive: "{{count}} гады",
      pluralGenitive: "{{count}} гадоў"
    }
  }),
  overXYears: buildLocalizeTokenFn({
    regular: {
      singularNominative: "больш за {{count}} год",
      singularGenitive: "больш за {{count}} гады",
      pluralGenitive: "больш за {{count}} гадоў"
    },
    future: {
      singularNominative: "больш, чым праз {{count}} год",
      singularGenitive: "больш, чым праз {{count}} гады",
      pluralGenitive: "больш, чым праз {{count}} гадоў"
    }
  }),
  almostXYears: buildLocalizeTokenFn({
    regular: {
      singularNominative: "амаль {{count}} год",
      singularGenitive: "амаль {{count}} гады",
      pluralGenitive: "амаль {{count}} гадоў"
    },
    future: {
      singularNominative: "амаль праз {{count}} год",
      singularGenitive: "амаль праз {{count}} гады",
      pluralGenitive: "амаль праз {{count}} гадоў"
    }
  })
};

// node_modules/date-fns/locale/be/_lib/formatLong.js
var dateFormats10 = {
  full: "EEEE, d MMMM y 'г.'",
  long: "d MMMM y 'г.'",
  medium: "d MMM y 'г.'",
  short: "dd.MM.y"
};
var timeFormats10 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats10 = {
  any: "{{date}}, {{time}}"
};
var formatLong10 = {
  date: buildFormatLongFn({
    formats: dateFormats10,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats10,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats10,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/be/_lib/localize.js
var eraValues10 = {
  narrow: ["да н.э.", "н.э."],
  abbreviated: ["да н. э.", "н. э."],
  wide: ["да нашай эры", "нашай эры"]
};
var quarterValues10 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-ы кв.", "2-і кв.", "3-і кв.", "4-ы кв."],
  wide: ["1-ы квартал", "2-і квартал", "3-і квартал", "4-ы квартал"]
};
var monthValues10 = {
  narrow: ["С", "Л", "С", "К", "М", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
  abbreviated: [
    "студз.",
    "лют.",
    "сак.",
    "крас.",
    "май",
    "чэрв.",
    "ліп.",
    "жн.",
    "вер.",
    "кастр.",
    "ліст.",
    "снеж."
  ],
  wide: [
    "студзень",
    "люты",
    "сакавік",
    "красавік",
    "май",
    "чэрвень",
    "ліпень",
    "жнівень",
    "верасень",
    "кастрычнік",
    "лістапад",
    "снежань"
  ]
};
var formattingMonthValues = {
  narrow: ["С", "Л", "С", "К", "М", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
  abbreviated: [
    "студз.",
    "лют.",
    "сак.",
    "крас.",
    "мая",
    "чэрв.",
    "ліп.",
    "жн.",
    "вер.",
    "кастр.",
    "ліст.",
    "снеж."
  ],
  wide: [
    "студзеня",
    "лютага",
    "сакавіка",
    "красавіка",
    "мая",
    "чэрвеня",
    "ліпеня",
    "жніўня",
    "верасня",
    "кастрычніка",
    "лістапада",
    "снежня"
  ]
};
var dayValues10 = {
  narrow: ["Н", "П", "А", "С", "Ч", "П", "С"],
  short: ["нд", "пн", "аў", "ср", "чц", "пт", "сб"],
  abbreviated: ["нядз", "пан", "аўт", "сер", "чац", "пят", "суб"],
  wide: [
    "нядзеля",
    "панядзелак",
    "аўторак",
    "серада",
    "чацвер",
    "пятніца",
    "субота"
  ]
};
var dayPeriodValues10 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дзень",
    evening: "веч.",
    night: "ноч"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дзень",
    evening: "веч.",
    night: "ноч"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўнач",
    noon: "поўдзень",
    morning: "раніца",
    afternoon: "дзень",
    evening: "вечар",
    night: "ноч"
  }
};
var formattingDayPeriodValues10 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дня",
    evening: "веч.",
    night: "ночы"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дня",
    evening: "веч.",
    night: "ночы"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўнач",
    noon: "поўдзень",
    morning: "раніцы",
    afternoon: "дня",
    evening: "вечара",
    night: "ночы"
  }
};
var ordinalNumber10 = (dirtyNumber, options) => {
  const unit = String(options == null ? void 0 : options.unit);
  const number = Number(dirtyNumber);
  let suffix;
  if (unit === "date") {
    suffix = "-га";
  } else if (unit === "hour" || unit === "minute" || unit === "second") {
    suffix = "-я";
  } else {
    suffix = (number % 10 === 2 || number % 10 === 3) && number % 100 !== 12 && number % 100 !== 13 ? "-і" : "-ы";
  }
  return number + suffix;
};
var localize10 = {
  ordinalNumber: ordinalNumber10,
  era: buildLocalizeFn({
    values: eraValues10,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues10,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues10,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues10,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues10,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues10,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/be/_lib/match.js
var matchOrdinalNumberPattern10 = /^(\d+)(-?(е|я|га|і|ы|ае|ая|яя|шы|гі|ці|ты|мы))?/i;
var parseOrdinalNumberPattern10 = /\d+/i;
var matchEraPatterns10 = {
  narrow: /^((да )?н\.?\s?э\.?)/i,
  abbreviated: /^((да )?н\.?\s?э\.?)/i,
  wide: /^(да нашай эры|нашай эры|наша эра)/i
};
var parseEraPatterns10 = {
  any: [/^д/i, /^н/i]
};
var matchQuarterPatterns10 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[ыі]?)? кв.?/i,
  wide: /^[1234](-?[ыі]?)? квартал/i
};
var parseQuarterPatterns10 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns10 = {
  narrow: /^[слкмчжв]/i,
  abbreviated: /^(студз|лют|сак|крас|ма[йя]|чэрв|ліп|жн|вер|кастр|ліст|снеж)\.?/i,
  wide: /^(студзен[ья]|лют(ы|ага)|сакавіка?|красавіка?|ма[йя]|чэрвен[ья]|ліпен[ья]|жні(вень|ўня)|верас(ень|ня)|кастрычніка?|лістапада?|снеж(ань|ня))/i
};
var parseMonthPatterns10 = {
  narrow: [
    /^с/i,
    /^л/i,
    /^с/i,
    /^к/i,
    /^м/i,
    /^ч/i,
    /^л/i,
    /^ж/i,
    /^в/i,
    /^к/i,
    /^л/i,
    /^с/i
  ],
  any: [
    /^ст/i,
    /^лю/i,
    /^са/i,
    /^кр/i,
    /^ма/i,
    /^ч/i,
    /^ліп/i,
    /^ж/i,
    /^в/i,
    /^ка/i,
    /^ліс/i,
    /^сн/i
  ]
};
var matchDayPatterns10 = {
  narrow: /^[нпасч]/i,
  short: /^(нд|ня|пн|па|аў|ат|ср|се|чц|ча|пт|пя|сб|су)\.?/i,
  abbreviated: /^(нядз?|ндз|пнд|пан|аўт|срд|сер|чцв|чац|птн|пят|суб).?/i,
  wide: /^(нядзел[яі]|панядзел(ак|ка)|аўтор(ак|ка)|серад[аы]|чацв(ер|ярга)|пятніц[аы]|субот[аы])/i
};
var parseDayPatterns10 = {
  narrow: [/^н/i, /^п/i, /^а/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^н/i, /^п[ан]/i, /^а/i, /^с[ер]/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
};
var matchDayPeriodPatterns10 = {
  narrow: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
  abbreviated: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
  wide: /^([дп]п|поўнач|поўдзень|раніц[аы]|дзень|дня|вечара?|ночы?)/i
};
var parseDayPeriodPatterns10 = {
  any: {
    am: /^дп/i,
    pm: /^пп/i,
    midnight: /^поўн/i,
    noon: /^поўд/i,
    morning: /^р/i,
    afternoon: /^д[зн]/i,
    evening: /^в/i,
    night: /^н/i
  }
};
var match10 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern10,
    parsePattern: parseOrdinalNumberPattern10,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns10,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns10,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns10,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns10,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns10,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns10,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns10,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns10,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns10,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns10,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/be-tarask/_lib/formatDistance.js
function declension2(scheme, count) {
  if (scheme.one !== void 0 && count === 1) {
    return scheme.one;
  }
  const rem10 = count % 10;
  const rem100 = count % 100;
  if (rem10 === 1 && rem100 !== 11) {
    return scheme.singularNominative.replace("{{count}}", String(count));
  } else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 > 20)) {
    return scheme.singularGenitive.replace("{{count}}", String(count));
  } else {
    return scheme.pluralGenitive.replace("{{count}}", String(count));
  }
}
function buildLocalizeTokenFn2(scheme) {
  return (count, options) => {
    if (options && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        if (scheme.future) {
          return declension2(scheme.future, count);
        } else {
          return "праз " + declension2(scheme.regular, count);
        }
      } else {
        if (scheme.past) {
          return declension2(scheme.past, count);
        } else {
          return declension2(scheme.regular, count) + " таму";
        }
      }
    } else {
      return declension2(scheme.regular, count);
    }
  };
}
var halfAMinute2 = (_, options) => {
  if (options && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "праз паўхвіліны";
    } else {
      return "паўхвіліны таму";
    }
  }
  return "паўхвіліны";
};
var formatDistanceLocale3 = {
  lessThanXSeconds: buildLocalizeTokenFn2({
    regular: {
      one: "менш за секунду",
      singularNominative: "менш за {{count}} секунду",
      singularGenitive: "менш за {{count}} секунды",
      pluralGenitive: "менш за {{count}} секунд"
    },
    future: {
      one: "менш, чым праз секунду",
      singularNominative: "менш, чым праз {{count}} секунду",
      singularGenitive: "менш, чым праз {{count}} секунды",
      pluralGenitive: "менш, чым праз {{count}} секунд"
    }
  }),
  xSeconds: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} секунда",
      singularGenitive: "{{count}} секунды",
      pluralGenitive: "{{count}} секунд"
    },
    past: {
      singularNominative: "{{count}} секунду таму",
      singularGenitive: "{{count}} секунды таму",
      pluralGenitive: "{{count}} секунд таму"
    },
    future: {
      singularNominative: "праз {{count}} секунду",
      singularGenitive: "праз {{count}} секунды",
      pluralGenitive: "праз {{count}} секунд"
    }
  }),
  halfAMinute: halfAMinute2,
  lessThanXMinutes: buildLocalizeTokenFn2({
    regular: {
      one: "менш за хвіліну",
      singularNominative: "менш за {{count}} хвіліну",
      singularGenitive: "менш за {{count}} хвіліны",
      pluralGenitive: "менш за {{count}} хвілін"
    },
    future: {
      one: "менш, чым праз хвіліну",
      singularNominative: "менш, чым праз {{count}} хвіліну",
      singularGenitive: "менш, чым праз {{count}} хвіліны",
      pluralGenitive: "менш, чым праз {{count}} хвілін"
    }
  }),
  xMinutes: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} хвіліна",
      singularGenitive: "{{count}} хвіліны",
      pluralGenitive: "{{count}} хвілін"
    },
    past: {
      singularNominative: "{{count}} хвіліну таму",
      singularGenitive: "{{count}} хвіліны таму",
      pluralGenitive: "{{count}} хвілін таму"
    },
    future: {
      singularNominative: "праз {{count}} хвіліну",
      singularGenitive: "праз {{count}} хвіліны",
      pluralGenitive: "праз {{count}} хвілін"
    }
  }),
  aboutXHours: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "каля {{count}} гадзіны",
      singularGenitive: "каля {{count}} гадзін",
      pluralGenitive: "каля {{count}} гадзін"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} гадзіну",
      singularGenitive: "прыблізна праз {{count}} гадзіны",
      pluralGenitive: "прыблізна праз {{count}} гадзін"
    }
  }),
  xHours: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} гадзіна",
      singularGenitive: "{{count}} гадзіны",
      pluralGenitive: "{{count}} гадзін"
    },
    past: {
      singularNominative: "{{count}} гадзіну таму",
      singularGenitive: "{{count}} гадзіны таму",
      pluralGenitive: "{{count}} гадзін таму"
    },
    future: {
      singularNominative: "праз {{count}} гадзіну",
      singularGenitive: "праз {{count}} гадзіны",
      pluralGenitive: "праз {{count}} гадзін"
    }
  }),
  xDays: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} дзень",
      singularGenitive: "{{count}} дні",
      pluralGenitive: "{{count}} дзён"
    }
  }),
  aboutXWeeks: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "каля {{count}} тыдні",
      singularGenitive: "каля {{count}} тыдняў",
      pluralGenitive: "каля {{count}} тыдняў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} тыдзень",
      singularGenitive: "прыблізна праз {{count}} тыдні",
      pluralGenitive: "прыблізна праз {{count}} тыдняў"
    }
  }),
  xWeeks: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} тыдзень",
      singularGenitive: "{{count}} тыдні",
      pluralGenitive: "{{count}} тыдняў"
    }
  }),
  aboutXMonths: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "каля {{count}} месяца",
      singularGenitive: "каля {{count}} месяцаў",
      pluralGenitive: "каля {{count}} месяцаў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} месяц",
      singularGenitive: "прыблізна праз {{count}} месяцы",
      pluralGenitive: "прыблізна праз {{count}} месяцаў"
    }
  }),
  xMonths: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} месяц",
      singularGenitive: "{{count}} месяцы",
      pluralGenitive: "{{count}} месяцаў"
    }
  }),
  aboutXYears: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "каля {{count}} года",
      singularGenitive: "каля {{count}} гадоў",
      pluralGenitive: "каля {{count}} гадоў"
    },
    future: {
      singularNominative: "прыблізна праз {{count}} год",
      singularGenitive: "прыблізна праз {{count}} гады",
      pluralGenitive: "прыблізна праз {{count}} гадоў"
    }
  }),
  xYears: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "{{count}} год",
      singularGenitive: "{{count}} гады",
      pluralGenitive: "{{count}} гадоў"
    }
  }),
  overXYears: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "больш за {{count}} год",
      singularGenitive: "больш за {{count}} гады",
      pluralGenitive: "больш за {{count}} гадоў"
    },
    future: {
      singularNominative: "больш, чым праз {{count}} год",
      singularGenitive: "больш, чым праз {{count}} гады",
      pluralGenitive: "больш, чым праз {{count}} гадоў"
    }
  }),
  almostXYears: buildLocalizeTokenFn2({
    regular: {
      singularNominative: "амаль {{count}} год",
      singularGenitive: "амаль {{count}} гады",
      pluralGenitive: "амаль {{count}} гадоў"
    },
    future: {
      singularNominative: "амаль праз {{count}} год",
      singularGenitive: "амаль праз {{count}} гады",
      pluralGenitive: "амаль праз {{count}} гадоў"
    }
  })
};

// node_modules/date-fns/locale/be-tarask/_lib/formatLong.js
var dateFormats11 = {
  full: "EEEE, d MMMM y 'г.'",
  long: "d MMMM y 'г.'",
  medium: "d MMM y 'г.'",
  short: "dd.MM.y"
};
var timeFormats11 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats11 = {
  any: "{{date}}, {{time}}"
};
var formatLong11 = {
  date: buildFormatLongFn({
    formats: dateFormats11,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats11,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats11,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/be-tarask/_lib/localize.js
var eraValues11 = {
  narrow: ["да н.э.", "н.э."],
  abbreviated: ["да н. э.", "н. э."],
  wide: ["да нашай эры", "нашай эры"]
};
var quarterValues11 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-ы кв.", "2-і кв.", "3-і кв.", "4-ы кв."],
  wide: ["1-ы квартал", "2-і квартал", "3-і квартал", "4-ы квартал"]
};
var monthValues11 = {
  narrow: ["С", "Л", "С", "К", "Т", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
  abbreviated: [
    "студз.",
    "лют.",
    "сак.",
    "крас.",
    "трав.",
    "чэрв.",
    "ліп.",
    "жн.",
    "вер.",
    "кастр.",
    "ліст.",
    "сьнеж."
  ],
  wide: [
    "студзень",
    "люты",
    "сакавік",
    "красавік",
    "травень",
    "чэрвень",
    "ліпень",
    "жнівень",
    "верасень",
    "кастрычнік",
    "лістапад",
    "сьнежань"
  ]
};
var formattingMonthValues2 = {
  narrow: ["С", "Л", "С", "К", "Т", "Ч", "Л", "Ж", "В", "К", "Л", "С"],
  abbreviated: [
    "студз.",
    "лют.",
    "сак.",
    "крас.",
    "трав.",
    "чэрв.",
    "ліп.",
    "жн.",
    "вер.",
    "кастр.",
    "ліст.",
    "сьнеж."
  ],
  wide: [
    "студзеня",
    "лютага",
    "сакавіка",
    "красавіка",
    "траўня",
    "чэрвеня",
    "ліпеня",
    "жніўня",
    "верасня",
    "кастрычніка",
    "лістапада",
    "сьнежня"
  ]
};
var dayValues11 = {
  narrow: ["Н", "П", "А", "С", "Ч", "П", "С"],
  short: ["нд", "пн", "аў", "ср", "чц", "пт", "сб"],
  abbreviated: ["нядз", "пан", "аўт", "сер", "чаць", "пят", "суб"],
  wide: [
    "нядзеля",
    "панядзелак",
    "аўторак",
    "серада",
    "чацьвер",
    "пятніца",
    "субота"
  ]
};
var dayPeriodValues11 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дзень",
    evening: "веч.",
    night: "ноч"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дзень",
    evening: "веч.",
    night: "ноч"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўнач",
    noon: "поўдзень",
    morning: "раніца",
    afternoon: "дзень",
    evening: "вечар",
    night: "ноч"
  }
};
var formattingDayPeriodValues11 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дня",
    evening: "веч.",
    night: "ночы"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўн.",
    noon: "поўд.",
    morning: "ран.",
    afternoon: "дня",
    evening: "веч.",
    night: "ночы"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "поўнач",
    noon: "поўдзень",
    morning: "раніцы",
    afternoon: "дня",
    evening: "вечара",
    night: "ночы"
  }
};
var ordinalNumber11 = (dirtyNumber, options) => {
  const unit = String(options == null ? void 0 : options.unit);
  const number = Number(dirtyNumber);
  let suffix;
  if (unit === "date") {
    suffix = "-га";
  } else if (unit === "hour" || unit === "minute" || unit === "second") {
    suffix = "-я";
  } else {
    suffix = (number % 10 === 2 || number % 10 === 3) && number % 100 !== 12 && number % 100 !== 13 ? "-і" : "-ы";
  }
  return number + suffix;
};
var localize11 = {
  ordinalNumber: ordinalNumber11,
  era: buildLocalizeFn({
    values: eraValues11,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues11,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues11,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues2,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues11,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues11,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues11,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/be-tarask/_lib/match.js
var matchOrdinalNumberPattern11 = /^(\d+)(-?(е|я|га|і|ы|ае|ая|яя|шы|гі|ці|ты|мы))?/i;
var parseOrdinalNumberPattern11 = /\d+/i;
var matchEraPatterns11 = {
  narrow: /^((да )?н\.?\s?э\.?)/i,
  abbreviated: /^((да )?н\.?\s?э\.?)/i,
  wide: /^(да нашай эры|нашай эры|наша эра)/i
};
var parseEraPatterns11 = {
  any: [/^д/i, /^н/i]
};
var matchQuarterPatterns11 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[ыі]?)? кв.?/i,
  wide: /^[1234](-?[ыі]?)? квартал/i
};
var parseQuarterPatterns11 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns11 = {
  narrow: /^[слкмчжв]/i,
  abbreviated: /^(студз|лют|сак|крас|тр(ав)?|чэрв|ліп|жн|вер|кастр|ліст|сьнеж)\.?/i,
  wide: /^(студзен[ья]|лют(ы|ага)|сакавіка?|красавіка?|тра(вень|ўня)|чэрвен[ья]|ліпен[ья]|жні(вень|ўня)|верас(ень|ня)|кастрычніка?|лістапада?|сьнеж(ань|ня))/i
};
var parseMonthPatterns11 = {
  narrow: [
    /^с/i,
    /^л/i,
    /^с/i,
    /^к/i,
    /^т/i,
    /^ч/i,
    /^л/i,
    /^ж/i,
    /^в/i,
    /^к/i,
    /^л/i,
    /^с/i
  ],
  any: [
    /^ст/i,
    /^лю/i,
    /^са/i,
    /^кр/i,
    /^тр/i,
    /^ч/i,
    /^ліп/i,
    /^ж/i,
    /^в/i,
    /^ка/i,
    /^ліс/i,
    /^сн/i
  ]
};
var matchDayPatterns11 = {
  narrow: /^[нпасч]/i,
  short: /^(нд|ня|пн|па|аў|ат|ср|се|чц|ча|пт|пя|сб|су)\.?/i,
  abbreviated: /^(нядз?|ндз|пнд|пан|аўт|срд|сер|чцьв|чаць|птн|пят|суб).?/i,
  wide: /^(нядзел[яі]|панядзел(ак|ка)|аўтор(ак|ка)|серад[аы]|чацьв(ер|ярга)|пятніц[аы]|субот[аы])/i
};
var parseDayPatterns11 = {
  narrow: [/^н/i, /^п/i, /^а/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^н/i, /^п[ан]/i, /^а/i, /^с[ер]/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
};
var matchDayPeriodPatterns11 = {
  narrow: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
  abbreviated: /^([дп]п|поўн\.?|поўд\.?|ран\.?|дзень|дня|веч\.?|ночы?)/i,
  wide: /^([дп]п|поўнач|поўдзень|раніц[аы]|дзень|дня|вечара?|ночы?)/i
};
var parseDayPeriodPatterns11 = {
  any: {
    am: /^дп/i,
    pm: /^пп/i,
    midnight: /^поўн/i,
    noon: /^поўд/i,
    morning: /^р/i,
    afternoon: /^д[зн]/i,
    evening: /^в/i,
    night: /^н/i
  }
};
var match11 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern11,
    parsePattern: parseOrdinalNumberPattern11,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns11,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns11,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns11,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns11,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns11,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns11,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns11,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns11,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns11,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns11,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/bg/_lib/formatLong.js
var dateFormats12 = {
  full: "EEEE, dd MMMM yyyy",
  long: "dd MMMM yyyy",
  medium: "dd MMM yyyy",
  short: "dd.MM.yyyy"
};
var timeFormats12 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "H:mm"
};
var dateTimeFormats12 = {
  any: "{{date}} {{time}}"
};
var formatLong12 = {
  date: buildFormatLongFn({
    formats: dateFormats12,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats12,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats12,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/bg/_lib/localize.js
var eraValues12 = {
  narrow: ["пр.н.е.", "н.е."],
  abbreviated: ["преди н. е.", "н. е."],
  wide: ["преди новата ера", "новата ера"]
};
var quarterValues12 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-во тримес.", "2-ро тримес.", "3-то тримес.", "4-то тримес."],
  wide: [
    "1-во тримесечие",
    "2-ро тримесечие",
    "3-то тримесечие",
    "4-то тримесечие"
  ]
};
var monthValues12 = {
  abbreviated: [
    "яну",
    "фев",
    "мар",
    "апр",
    "май",
    "юни",
    "юли",
    "авг",
    "сеп",
    "окт",
    "ное",
    "дек"
  ],
  wide: [
    "януари",
    "февруари",
    "март",
    "април",
    "май",
    "юни",
    "юли",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември"
  ]
};
var dayValues12 = {
  narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
  short: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
  abbreviated: ["нед", "пон", "вто", "сря", "чет", "пет", "съб"],
  wide: [
    "неделя",
    "понеделник",
    "вторник",
    "сряда",
    "четвъртък",
    "петък",
    "събота"
  ]
};
var dayPeriodValues12 = {
  wide: {
    am: "преди обяд",
    pm: "след обяд",
    midnight: "в полунощ",
    noon: "на обяд",
    morning: "сутринта",
    afternoon: "следобед",
    evening: "вечерта",
    night: "през нощта"
  }
};
function isFeminine(unit) {
  return unit === "year" || unit === "week" || unit === "minute" || unit === "second";
}
function isNeuter(unit) {
  return unit === "quarter";
}
function numberWithSuffix(number, unit, masculine, feminine, neuter) {
  const suffix = isNeuter(unit) ? neuter : isFeminine(unit) ? feminine : masculine;
  return number + "-" + suffix;
}
var ordinalNumber12 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  if (number === 0) {
    return numberWithSuffix(0, unit, "ев", "ева", "ево");
  } else if (number % 1e3 === 0) {
    return numberWithSuffix(number, unit, "ен", "на", "но");
  } else if (number % 100 === 0) {
    return numberWithSuffix(number, unit, "тен", "тна", "тно");
  }
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return numberWithSuffix(number, unit, "ви", "ва", "во");
      case 2:
        return numberWithSuffix(number, unit, "ри", "ра", "ро");
      case 7:
      case 8:
        return numberWithSuffix(number, unit, "ми", "ма", "мо");
    }
  }
  return numberWithSuffix(number, unit, "ти", "та", "то");
};
var localize12 = {
  ordinalNumber: ordinalNumber12,
  era: buildLocalizeFn({
    values: eraValues12,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues12,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues12,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues12,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues12,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/bg/_lib/match.js
var matchOrdinalNumberPattern12 = /^(\d+)(-?[врмт][аи]|-?т?(ен|на)|-?(ев|ева))?/i;
var parseOrdinalNumberPattern12 = /\d+/i;
var matchEraPatterns12 = {
  narrow: /^((пр)?н\.?\s?е\.?)/i,
  abbreviated: /^((пр)?н\.?\s?е\.?)/i,
  wide: /^(преди новата ера|новата ера|нова ера)/i
};
var parseEraPatterns12 = {
  any: [/^п/i, /^н/i]
};
var matchQuarterPatterns12 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[врт]?o?)? тримес.?/i,
  wide: /^[1234](-?[врт]?о?)? тримесечие/i
};
var parseQuarterPatterns12 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchDayPatterns12 = {
  narrow: /^[нпвсч]/i,
  short: /^(нд|пн|вт|ср|чт|пт|сб)/i,
  abbreviated: /^(нед|пон|вто|сря|чет|пет|съб)/i,
  wide: /^(неделя|понеделник|вторник|сряда|четвъртък|петък|събота)/i
};
var parseDayPatterns12 = {
  narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^н[ед]/i, /^п[он]/i, /^вт/i, /^ср/i, /^ч[ет]/i, /^п[ет]/i, /^с[ъб]/i]
};
var matchMonthPatterns12 = {
  abbreviated: /^(яну|фев|мар|апр|май|юни|юли|авг|сеп|окт|ное|дек)/i,
  wide: /^(януари|февруари|март|април|май|юни|юли|август|септември|октомври|ноември|декември)/i
};
var parseMonthPatterns12 = {
  any: [
    /^я/i,
    /^ф/i,
    /^мар/i,
    /^ап/i,
    /^май/i,
    /^юн/i,
    /^юл/i,
    /^ав/i,
    /^се/i,
    /^окт/i,
    /^но/i,
    /^де/i
  ]
};
var matchDayPeriodPatterns12 = {
  any: /^(преди о|след о|в по|на о|през|веч|сут|следо)/i
};
var parseDayPeriodPatterns12 = {
  any: {
    am: /^преди о/i,
    pm: /^след о/i,
    midnight: /^в пол/i,
    noon: /^на об/i,
    morning: /^сут/i,
    afternoon: /^следо/i,
    evening: /^веч/i,
    night: /^през н/i
  }
};
var match12 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern12,
    parsePattern: parseOrdinalNumberPattern12,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns12,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns12,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns12,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns12,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns12,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns12,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns12,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns12,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns12,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns12,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/bn/_lib/localize.js
var numberValues = {
  locale: {
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
    0: "০"
  },
  number: {
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
    "০": "0"
  }
};
var eraValues13 = {
  narrow: ["খ্রিঃপূঃ", "খ্রিঃ"],
  abbreviated: ["খ্রিঃপূর্ব", "খ্রিঃ"],
  wide: ["খ্রিস্টপূর্ব", "খ্রিস্টাব্দ"]
};
var quarterValues13 = {
  narrow: ["১", "২", "৩", "৪"],
  abbreviated: ["১ত্রৈ", "২ত্রৈ", "৩ত্রৈ", "৪ত্রৈ"],
  wide: ["১ম ত্রৈমাসিক", "২য় ত্রৈমাসিক", "৩য় ত্রৈমাসিক", "৪র্থ ত্রৈমাসিক"]
};
var monthValues13 = {
  narrow: [
    "জানু",
    "ফেব্রু",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্ট",
    "অক্টো",
    "নভে",
    "ডিসে"
  ],
  abbreviated: [
    "জানু",
    "ফেব্রু",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্ট",
    "অক্টো",
    "নভে",
    "ডিসে"
  ],
  wide: [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর"
  ]
};
var dayValues13 = {
  narrow: ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"],
  short: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
  abbreviated: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
  wide: [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার ",
    "শুক্রবার",
    "শনিবার"
  ]
};
var dayPeriodValues13 = {
  narrow: {
    am: "পূ",
    pm: "অপ",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  },
  abbreviated: {
    am: "পূর্বাহ্ন",
    pm: "অপরাহ্ন",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  },
  wide: {
    am: "পূর্বাহ্ন",
    pm: "অপরাহ্ন",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  }
};
var formattingDayPeriodValues12 = {
  narrow: {
    am: "পূ",
    pm: "অপ",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  },
  abbreviated: {
    am: "পূর্বাহ্ন",
    pm: "অপরাহ্ন",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  },
  wide: {
    am: "পূর্বাহ্ন",
    pm: "অপরাহ্ন",
    midnight: "মধ্যরাত",
    noon: "মধ্যাহ্ন",
    morning: "সকাল",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত"
  }
};
function dateOrdinalNumber(number, localeNumber) {
  if (number > 18 && number <= 31) {
    return localeNumber + "শে";
  } else {
    switch (number) {
      case 1:
        return localeNumber + "লা";
      case 2:
      case 3:
        return localeNumber + "রা";
      case 4:
        return localeNumber + "ঠা";
      default:
        return localeNumber + "ই";
    }
  }
}
var ordinalNumber13 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const localeNumber = numberToLocale(number);
  const unit = options == null ? void 0 : options.unit;
  if (unit === "date") {
    return dateOrdinalNumber(number, localeNumber);
  }
  if (number > 10 || number === 0) return localeNumber + "তম";
  const rem10 = number % 10;
  switch (rem10) {
    case 2:
    case 3:
      return localeNumber + "য়";
    case 4:
      return localeNumber + "র্থ";
    case 6:
      return localeNumber + "ষ্ঠ";
    default:
      return localeNumber + "ম";
  }
};
function numberToLocale(enNumber) {
  return enNumber.toString().replace(/\d/g, function(match85) {
    return numberValues.locale[match85];
  });
}
var localize13 = {
  ordinalNumber: ordinalNumber13,
  era: buildLocalizeFn({
    values: eraValues13,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues13,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues13,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues13,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues13,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues12,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/bn/_lib/formatLong.js
var dateFormats13 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats13 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats13 = {
  full: "{{date}} {{time}} 'সময়'",
  long: "{{date}} {{time}} 'সময়'",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong13 = {
  date: buildFormatLongFn({
    formats: dateFormats13,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats13,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats13,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/bn/_lib/match.js
var matchOrdinalNumberPattern13 = /^(\d+)(ম|য়|র্থ|ষ্ঠ|শে|ই|তম)?/i;
var parseOrdinalNumberPattern13 = /\d+/i;
var matchEraPatterns13 = {
  narrow: /^(খ্রিঃপূঃ|খ্রিঃ)/i,
  abbreviated: /^(খ্রিঃপূর্ব|খ্রিঃ)/i,
  wide: /^(খ্রিস্টপূর্ব|খ্রিস্টাব্দ)/i
};
var parseEraPatterns13 = {
  narrow: [/^খ্রিঃপূঃ/i, /^খ্রিঃ/i],
  abbreviated: [/^খ্রিঃপূর্ব/i, /^খ্রিঃ/i],
  wide: [/^খ্রিস্টপূর্ব/i, /^খ্রিস্টাব্দ/i]
};
var matchQuarterPatterns13 = {
  narrow: /^[১২৩৪]/i,
  abbreviated: /^[১২৩৪]ত্রৈ/i,
  wide: /^[১২৩৪](ম|য়|র্থ)? ত্রৈমাসিক/i
};
var parseQuarterPatterns13 = {
  any: [/১/i, /২/i, /৩/i, /৪/i]
};
var matchMonthPatterns13 = {
  narrow: /^(জানু|ফেব্রু|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্ট|অক্টো|নভে|ডিসে)/i,
  abbreviated: /^(জানু|ফেব্রু|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্ট|অক্টো|নভে|ডিসে)/i,
  wide: /^(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)/i
};
var parseMonthPatterns13 = {
  any: [
    /^জানু/i,
    /^ফেব্রু/i,
    /^মার্চ/i,
    /^এপ্রিল/i,
    /^মে/i,
    /^জুন/i,
    /^জুলাই/i,
    /^আগস্ট/i,
    /^সেপ্ট/i,
    /^অক্টো/i,
    /^নভে/i,
    /^ডিসে/i
  ]
};
var matchDayPatterns13 = {
  narrow: /^(র|সো|ম|বু|বৃ|শু|শ)+/i,
  short: /^(রবি|সোম|মঙ্গল|বুধ|বৃহ|শুক্র|শনি)+/i,
  abbreviated: /^(রবি|সোম|মঙ্গল|বুধ|বৃহ|শুক্র|শনি)+/i,
  wide: /^(রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার |শুক্রবার|শনিবার)+/i
};
var parseDayPatterns13 = {
  narrow: [/^র/i, /^সো/i, /^ম/i, /^বু/i, /^বৃ/i, /^শু/i, /^শ/i],
  short: [/^রবি/i, /^সোম/i, /^মঙ্গল/i, /^বুধ/i, /^বৃহ/i, /^শুক্র/i, /^শনি/i],
  abbreviated: [
    /^রবি/i,
    /^সোম/i,
    /^মঙ্গল/i,
    /^বুধ/i,
    /^বৃহ/i,
    /^শুক্র/i,
    /^শনি/i
  ],
  wide: [
    /^রবিবার/i,
    /^সোমবার/i,
    /^মঙ্গলবার/i,
    /^বুধবার/i,
    /^বৃহস্পতিবার /i,
    /^শুক্রবার/i,
    /^শনিবার/i
  ]
};
var matchDayPeriodPatterns13 = {
  narrow: /^(পূ|অপ|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i,
  abbreviated: /^(পূর্বাহ্ন|অপরাহ্ন|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i,
  wide: /^(পূর্বাহ্ন|অপরাহ্ন|মধ্যরাত|মধ্যাহ্ন|সকাল|বিকাল|সন্ধ্যা|রাত)/i
};
var parseDayPeriodPatterns13 = {
  any: {
    am: /^পূ/i,
    pm: /^অপ/i,
    midnight: /^মধ্যরাত/i,
    noon: /^মধ্যাহ্ন/i,
    morning: /সকাল/i,
    afternoon: /বিকাল/i,
    evening: /সন্ধ্যা/i,
    night: /রাত/i
  }
};
var match13 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern13,
    parsePattern: parseOrdinalNumberPattern13,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns13,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns13,
    defaultParseWidth: "wide"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns13,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns13,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns13,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns13,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns13,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns13,
    defaultParseWidth: "wide"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns13,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns13,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/bs/_lib/formatLong.js
var dateFormats14 = {
  full: "EEEE, d. MMMM yyyy.",
  long: "d. MMMM yyyy.",
  medium: "d. MMM yy.",
  short: "dd. MM. yy."
};
var timeFormats14 = {
  full: "HH:mm:ss (zzzz)",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats14 = {
  full: "{{date}} 'u' {{time}}",
  long: "{{date}} 'u' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong14 = {
  date: buildFormatLongFn({
    formats: dateFormats14,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats14,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats14,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/bs/_lib/localize.js
var eraValues14 = {
  narrow: ["pr.n.e.", "AD"],
  abbreviated: ["pr. Hr.", "po. Hr."],
  wide: ["Prije Hrista", "Poslije Hrista"]
};
var quarterValues14 = {
  narrow: ["1.", "2.", "3.", "4."],
  abbreviated: ["1. kv.", "2. kv.", "3. kv.", "4. kv."],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues14 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "juni",
    "juli",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar"
  ]
};
var formattingMonthValues3 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "juni",
    "juli",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar"
  ]
};
var dayValues14 = {
  narrow: ["N", "P", "U", "S", "Č", "P", "S"],
  short: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  abbreviated: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  wide: [
    "nedjelja",
    "ponedjeljak",
    "utorak",
    "srijeda",
    "četvrtak",
    "petak",
    "subota"
  ]
};
var dayPeriodValues14 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "poslije podne",
    evening: "uveče",
    night: "noću"
  }
};
var formattingDayPeriodValues13 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "poslije podne",
    evening: "uveče",
    night: "noću"
  }
};
var ordinalNumber14 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return String(number) + ".";
};
var localize14 = {
  ordinalNumber: ordinalNumber14,
  era: buildLocalizeFn({
    values: eraValues14,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues14,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues14,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues3,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues14,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues14,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues13,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/bs/_lib/match.js
var matchOrdinalNumberPattern14 = /^(\d+)\./i;
var parseOrdinalNumberPattern14 = /\d+/i;
var matchEraPatterns14 = {
  narrow: /^(pr\.n\.e\.|AD)/i,
  abbreviated: /^(pr\.\s?Hr\.|po\.\s?Hr\.)/i,
  wide: /^(Prije Hrista|prije nove ere|Poslije Hrista|nova era)/i
};
var parseEraPatterns14 = {
  any: [/^pr/i, /^(po|nova)/i]
};
var matchQuarterPatterns14 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\.\s?kv\.?/i,
  wide: /^[1234]\. kvartal/i
};
var parseQuarterPatterns14 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns14 = {
  narrow: /^(10|11|12|[123456789])\./i,
  abbreviated: /^(jan|feb|mar|apr|maj|jun|jul|avg|sep|okt|nov|dec)/i,
  wide: /^((januar|januara)|(februar|februara)|(mart|marta)|(april|aprila)|(maj|maja)|(juni|juna)|(juli|jula)|(avgust|avgusta)|(septembar|septembra)|(oktobar|oktobra)|(novembar|novembra)|(decembar|decembra))/i
};
var parseMonthPatterns14 = {
  narrow: [
    /^1/i,
    /^2/i,
    /^3/i,
    /^4/i,
    /^5/i,
    /^6/i,
    /^7/i,
    /^8/i,
    /^9/i,
    /^10/i,
    /^11/i,
    /^12/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^avg/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns14 = {
  narrow: /^[npusčc]/i,
  short: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
  abbreviated: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
  wide: /^(nedjelja|ponedjeljak|utorak|srijeda|(četvrtak|cetvrtak)|petak|subota)/i
};
var parseDayPatterns14 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns14 = {
  any: /^(am|pm|ponoc|ponoć|(po)?podne|uvece|uveče|noću|poslije podne|ujutru)/i
};
var parseDayPeriodPatterns14 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^pono/i,
    noon: /^pod/i,
    morning: /jutro/i,
    afternoon: /(poslije\s|po)+podne/i,
    evening: /(uvece|uveče)/i,
    night: /(nocu|noću)/i
  }
};
var match14 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern14,
    parsePattern: parseOrdinalNumberPattern14,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns14,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns14,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns14,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns14,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns14,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns14,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns14,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns14,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns14,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns14,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ca/_lib/formatLong.js
var dateFormats15 = {
  full: "EEEE, d 'de' MMMM y",
  long: "d 'de' MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats15 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats15 = {
  full: "{{date}} 'a les' {{time}}",
  long: "{{date}} 'a les' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong15 = {
  date: buildFormatLongFn({
    formats: dateFormats15,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats15,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats15,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ca/_lib/localize.js
var eraValues15 = {
  narrow: ["aC", "dC"],
  abbreviated: ["a. de C.", "d. de C."],
  wide: ["abans de Crist", "després de Crist"]
};
var quarterValues15 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"]
};
var monthValues15 = {
  narrow: [
    "GN",
    "FB",
    "MÇ",
    "AB",
    "MG",
    "JN",
    "JL",
    "AG",
    "ST",
    "OC",
    "NV",
    "DS"
  ],
  /**
   * Les abreviatures dels mesos de l'any es formen seguint una de les normes generals de formació d'abreviatures.
   * S'escriu la primera síl·laba i les consonants de la síl·laba següent anteriors a la primera vocal.
   * Els mesos de març, maig i juny no s'abreugen perquè són paraules d'una sola síl·laba.
   */
  abbreviated: [
    "gen.",
    "febr.",
    "març",
    "abr.",
    "maig",
    "juny",
    "jul.",
    "ag.",
    "set.",
    "oct.",
    "nov.",
    "des."
  ],
  wide: [
    "gener",
    "febrer",
    "març",
    "abril",
    "maig",
    "juny",
    "juliol",
    "agost",
    "setembre",
    "octubre",
    "novembre",
    "desembre"
  ]
};
var dayValues15 = {
  narrow: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
  short: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
  abbreviated: ["dg.", "dl.", "dt.", "dm.", "dj.", "dv.", "ds."],
  wide: [
    "diumenge",
    "dilluns",
    "dimarts",
    "dimecres",
    "dijous",
    "divendres",
    "dissabte"
  ]
};
var dayPeriodValues15 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "mitjanit",
    noon: "migdia",
    morning: "matí",
    afternoon: "tarda",
    evening: "vespre",
    night: "nit"
  },
  abbreviated: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "mitjanit",
    noon: "migdia",
    morning: "matí",
    afternoon: "tarda",
    evening: "vespre",
    night: "nit"
  },
  wide: {
    am: "ante meridiem",
    pm: "post meridiem",
    midnight: "mitjanit",
    noon: "migdia",
    morning: "matí",
    afternoon: "tarda",
    evening: "vespre",
    night: "nit"
  }
};
var formattingDayPeriodValues14 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "de la mitjanit",
    noon: "del migdia",
    morning: "del matí",
    afternoon: "de la tarda",
    evening: "del vespre",
    night: "de la nit"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "de la mitjanit",
    noon: "del migdia",
    morning: "del matí",
    afternoon: "de la tarda",
    evening: "del vespre",
    night: "de la nit"
  },
  wide: {
    am: "ante meridiem",
    pm: "post meridiem",
    midnight: "de la mitjanit",
    noon: "del migdia",
    morning: "del matí",
    afternoon: "de la tarda",
    evening: "del vespre",
    night: "de la nit"
  }
};
var ordinalNumber15 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "r";
      case 2:
        return number + "n";
      case 3:
        return number + "r";
      case 4:
        return number + "t";
    }
  }
  return number + "è";
};
var localize15 = {
  ordinalNumber: ordinalNumber15,
  era: buildLocalizeFn({
    values: eraValues15,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues15,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues15,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues15,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues15,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues14,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ca/_lib/match.js
var matchOrdinalNumberPattern15 = /^(\d+)(è|r|n|r|t)?/i;
var parseOrdinalNumberPattern15 = /\d+/i;
var matchEraPatterns15 = {
  narrow: /^(aC|dC)/i,
  abbreviated: /^(a. de C.|d. de C.)/i,
  wide: /^(abans de Crist|despr[eé]s de Crist)/i
};
var parseEraPatterns15 = {
  narrow: [/^aC/i, /^dC/i],
  abbreviated: [/^(a. de C.)/i, /^(d. de C.)/i],
  wide: [/^(abans de Crist)/i, /^(despr[eé]s de Crist)/i]
};
var matchQuarterPatterns15 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^[1234](è|r|n|r|t)? trimestre/i
};
var parseQuarterPatterns15 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns15 = {
  narrow: /^(GN|FB|MÇ|AB|MG|JN|JL|AG|ST|OC|NV|DS)/i,
  abbreviated: /^(gen.|febr.|març|abr.|maig|juny|jul.|ag.|set.|oct.|nov.|des.)/i,
  wide: /^(gener|febrer|març|abril|maig|juny|juliol|agost|setembre|octubre|novembre|desembre)/i
};
var parseMonthPatterns15 = {
  narrow: [
    /^GN/i,
    /^FB/i,
    /^MÇ/i,
    /^AB/i,
    /^MG/i,
    /^JN/i,
    /^JL/i,
    /^AG/i,
    /^ST/i,
    /^OC/i,
    /^NV/i,
    /^DS/i
  ],
  abbreviated: [
    /^gen./i,
    /^febr./i,
    /^març/i,
    /^abr./i,
    /^maig/i,
    /^juny/i,
    /^jul./i,
    /^ag./i,
    /^set./i,
    /^oct./i,
    /^nov./i,
    /^des./i
  ],
  wide: [
    /^gener/i,
    /^febrer/i,
    /^març/i,
    /^abril/i,
    /^maig/i,
    /^juny/i,
    /^juliol/i,
    /^agost/i,
    /^setembre/i,
    /^octubre/i,
    /^novembre/i,
    /^desembre/i
  ]
};
var matchDayPatterns15 = {
  narrow: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
  short: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
  abbreviated: /^(dg\.|dl\.|dt\.|dm\.|dj\.|dv\.|ds\.)/i,
  wide: /^(diumenge|dilluns|dimarts|dimecres|dijous|divendres|dissabte)/i
};
var parseDayPatterns15 = {
  narrow: [/^dg./i, /^dl./i, /^dt./i, /^dm./i, /^dj./i, /^dv./i, /^ds./i],
  abbreviated: [/^dg./i, /^dl./i, /^dt./i, /^dm./i, /^dj./i, /^dv./i, /^ds./i],
  wide: [
    /^diumenge/i,
    /^dilluns/i,
    /^dimarts/i,
    /^dimecres/i,
    /^dijous/i,
    /^divendres/i,
    /^disssabte/i
  ]
};
var matchDayPeriodPatterns15 = {
  narrow: /^(a|p|mn|md|(del|de la) (matí|tarda|vespre|nit))/i,
  abbreviated: /^([ap]\.?\s?m\.?|mitjanit|migdia|(del|de la) (matí|tarda|vespre|nit))/i,
  wide: /^(ante meridiem|post meridiem|mitjanit|migdia|(del|de la) (matí|tarda|vespre|nit))/i
};
var parseDayPeriodPatterns15 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mitjanit/i,
    noon: /^migdia/i,
    morning: /matí/i,
    afternoon: /tarda/i,
    evening: /vespre/i,
    night: /nit/i
  }
};
var match15 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern15,
    parsePattern: parseOrdinalNumberPattern15,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns15,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns15,
    defaultParseWidth: "wide"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns15,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns15,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns15,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns15,
    defaultParseWidth: "wide"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns15,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns15,
    defaultParseWidth: "wide"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns15,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns15,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ckb/_lib/formatLong.js
var dateFormats16 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats16 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats16 = {
  full: "{{date}} 'کاتژمێر' {{time}}",
  long: "{{date}} 'کاتژمێر' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong16 = {
  date: buildFormatLongFn({
    formats: dateFormats16,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats16,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats16,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ckb/_lib/localize.js
var eraValues16 = {
  narrow: ["پ", "د"],
  abbreviated: ["پ-ز", "د-ز"],
  wide: ["پێش زاین", "دوای زاین"]
};
var quarterValues16 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["چ1م", "چ2م", "چ3م", "چ4م"],
  wide: ["چارەگی یەکەم", "چارەگی دووەم", "چارەگی سێیەم", "چارەگی چوارەم"]
};
var monthValues16 = {
  narrow: [
    "ک-د",
    "ش",
    "ئا",
    "ن",
    "م",
    "ح",
    "ت",
    "ئا",
    "ئە",
    "تش-ی",
    "تش-د",
    "ک-ی"
  ],
  abbreviated: [
    "کان-دوو",
    "شوب",
    "ئاد",
    "نیس",
    "مایس",
    "حوز",
    "تەم",
    "ئاب",
    "ئەل",
    "تش-یەک",
    "تش-دوو",
    "کان-یەک"
  ],
  wide: [
    "کانوونی دووەم",
    "شوبات",
    "ئادار",
    "نیسان",
    "مایس",
    "حوزەیران",
    "تەمموز",
    "ئاب",
    "ئەیلول",
    "تشرینی یەکەم",
    "تشرینی دووەم",
    "کانوونی یەکەم"
  ]
};
var dayValues16 = {
  narrow: ["ی-ش", "د-ش", "س-ش", "چ-ش", "پ-ش", "هە", "ش"],
  short: ["یە-شە", "دوو-شە", "سێ-شە", "چو-شە", "پێ-شە", "هەی", "شە"],
  abbreviated: [
    "یەک-شەم",
    "دوو-شەم",
    "سێ-شەم",
    "چوار-شەم",
    "پێنج-شەم",
    "هەینی",
    "شەمە"
  ],
  wide: [
    "یەک شەمە",
    "دوو شەمە",
    "سێ شەمە",
    "چوار شەمە",
    "پێنج شەمە",
    "هەینی",
    "شەمە"
  ]
};
var dayPeriodValues16 = {
  narrow: {
    am: "پ",
    pm: "د",
    midnight: "ن-ش",
    noon: "ن",
    morning: "بەیانی",
    afternoon: "دوای نیوەڕۆ",
    evening: "ئێوارە",
    night: "شەو"
  },
  abbreviated: {
    am: "پ-ن",
    pm: "د-ن",
    midnight: "نیوە شەو",
    noon: "نیوەڕۆ",
    morning: "بەیانی",
    afternoon: "دوای نیوەڕۆ",
    evening: "ئێوارە",
    night: "شەو"
  },
  wide: {
    am: "پێش نیوەڕۆ",
    pm: "دوای نیوەڕۆ",
    midnight: "نیوە شەو",
    noon: "نیوەڕۆ",
    morning: "بەیانی",
    afternoon: "دوای نیوەڕۆ",
    evening: "ئێوارە",
    night: "شەو"
  }
};
var formattingDayPeriodValues15 = {
  narrow: {
    am: "پ",
    pm: "د",
    midnight: "ن-ش",
    noon: "ن",
    morning: "لە بەیانیدا",
    afternoon: "لە دوای نیوەڕۆدا",
    evening: "لە ئێوارەدا",
    night: "لە شەودا"
  },
  abbreviated: {
    am: "پ-ن",
    pm: "د-ن",
    midnight: "نیوە شەو",
    noon: "نیوەڕۆ",
    morning: "لە بەیانیدا",
    afternoon: "لە دوای نیوەڕۆدا",
    evening: "لە ئێوارەدا",
    night: "لە شەودا"
  },
  wide: {
    am: "پێش نیوەڕۆ",
    pm: "دوای نیوەڕۆ",
    midnight: "نیوە شەو",
    noon: "نیوەڕۆ",
    morning: "لە بەیانیدا",
    afternoon: "لە دوای نیوەڕۆدا",
    evening: "لە ئێوارەدا",
    night: "لە شەودا"
  }
};
var ordinalNumber16 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize16 = {
  ordinalNumber: ordinalNumber16,
  era: buildLocalizeFn({
    values: eraValues16,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues16,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues16,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues16,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues16,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues15,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ckb/_lib/match.js
var matchOrdinalNumberPattern16 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern16 = /\d+/i;
var matchEraPatterns16 = {
  narrow: /^(پ|د)/i,
  abbreviated: /^(پ-ز|د.ز)/i,
  wide: /^(پێش زاین| دوای زاین)/i
};
var parseEraPatterns16 = {
  any: [/^د/g, /^پ/g]
};
var matchQuarterPatterns16 = {
  narrow: /^[1234]/i,
  abbreviated: /^م[1234]چ/i,
  wide: /^(یەکەم|دووەم|سێیەم| چوارەم) (چارەگی)? quarter/i
};
var parseQuarterPatterns16 = {
  wide: [/چارەگی یەکەم/, /چارەگی دووەم/, /چارەگی سيیەم/, /چارەگی چوارەم/],
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns16 = {
  narrow: /^(ک-د|ش|ئا|ن|م|ح|ت|ئە|تش-ی|تش-د|ک-ی)/i,
  abbreviated: /^(کان-دوو|شوب|ئاد|نیس|مایس|حوز|تەم|ئاب|ئەل|تش-یەک|تش-دوو|کان-یەک)/i,
  wide: /^(کانوونی دووەم|شوبات|ئادار|نیسان|مایس|حوزەیران|تەمموز|ئاب|ئەیلول|تشرینی یەکەم|تشرینی دووەم|کانوونی یەکەم)/i
};
var parseMonthPatterns16 = {
  narrow: [
    /^ک-د/i,
    /^ش/i,
    /^ئا/i,
    /^ن/i,
    /^م/i,
    /^ح/i,
    /^ت/i,
    /^ئا/i,
    /^ئە/i,
    /^تش-ی/i,
    /^تش-د/i,
    /^ک-ی/i
  ],
  any: [
    /^کان-دوو/i,
    /^شوب/i,
    /^ئاد/i,
    /^نیس/i,
    /^مایس/i,
    /^حوز/i,
    /^تەم/i,
    /^ئاب/i,
    /^ئەل/i,
    /^تش-یەک/i,
    /^تش-دوو/i,
    /^|کان-یەک/i
  ]
};
var matchDayPatterns16 = {
  narrow: /^(ش|ی|د|س|چ|پ|هە)/i,
  short: /^(یە-شە|دوو-شە|سێ-شە|چو-شە|پێ-شە|هە|شە)/i,
  abbreviated: /^(یەک-شەم|دوو-شەم|سێ-شەم|چوار-شەم|پێنخ-شەم|هەینی|شەمە)/i,
  wide: /^(یەک شەمە|دوو شەمە|سێ شەمە|چوار شەمە|پێنج شەمە|هەینی|شەمە)/i
};
var parseDayPatterns16 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns16 = {
  narrow: /^(پ|د|ن-ش|ن| (بەیانی|دوای نیوەڕۆ|ئێوارە|شەو))/i,
  abbreviated: /^(پ-ن|د-ن|نیوە شەو|نیوەڕۆ|بەیانی|دوای نیوەڕۆ|ئێوارە|شەو)/,
  wide: /^(پێش نیوەڕۆ|دوای نیوەڕۆ|نیوەڕۆ|نیوە شەو|لەبەیانیدا|لەدواینیوەڕۆدا|لە ئێوارەدا|لە شەودا)/,
  any: /^(پ|د|بەیانی|نیوەڕۆ|ئێوارە|شەو)/
};
var parseDayPeriodPatterns16 = {
  any: {
    am: /^د/i,
    pm: /^پ/i,
    midnight: /^ن-ش/i,
    noon: /^ن/i,
    morning: /بەیانی/i,
    afternoon: /دواینیوەڕۆ/i,
    evening: /ئێوارە/i,
    night: /شەو/i
  }
};
var match16 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern16,
    parsePattern: parseOrdinalNumberPattern16,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns16,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns16,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns16,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns16,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns16,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns16,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns16,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns16,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns16,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns16,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/cs/_lib/formatLong.js
var dateFormats17 = {
  full: "EEEE, d. MMMM yyyy",
  long: "d. MMMM yyyy",
  medium: "d. M. yyyy",
  short: "dd.MM.yyyy"
};
var timeFormats17 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats17 = {
  full: "{{date}} 'v' {{time}}",
  long: "{{date}} 'v' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong17 = {
  date: buildFormatLongFn({
    formats: dateFormats17,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats17,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats17,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/cs/_lib/localize.js
var eraValues17 = {
  narrow: ["př. n. l.", "n. l."],
  abbreviated: ["př. n. l.", "n. l."],
  wide: ["před naším letopočtem", "našeho letopočtu"]
};
var quarterValues17 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1. čtvrtletí", "2. čtvrtletí", "3. čtvrtletí", "4. čtvrtletí"],
  wide: ["1. čtvrtletí", "2. čtvrtletí", "3. čtvrtletí", "4. čtvrtletí"]
};
var monthValues17 = {
  narrow: ["L", "Ú", "B", "D", "K", "Č", "Č", "S", "Z", "Ř", "L", "P"],
  abbreviated: [
    "led",
    "úno",
    "bře",
    "dub",
    "kvě",
    "čvn",
    "čvc",
    "srp",
    "zář",
    "říj",
    "lis",
    "pro"
  ],
  wide: [
    "leden",
    "únor",
    "březen",
    "duben",
    "květen",
    "červen",
    "červenec",
    "srpen",
    "září",
    "říjen",
    "listopad",
    "prosinec"
  ]
};
var formattingMonthValues4 = {
  narrow: ["L", "Ú", "B", "D", "K", "Č", "Č", "S", "Z", "Ř", "L", "P"],
  abbreviated: [
    "led",
    "úno",
    "bře",
    "dub",
    "kvě",
    "čvn",
    "čvc",
    "srp",
    "zář",
    "říj",
    "lis",
    "pro"
  ],
  wide: [
    "ledna",
    "února",
    "března",
    "dubna",
    "května",
    "června",
    "července",
    "srpna",
    "září",
    "října",
    "listopadu",
    "prosince"
  ]
};
var dayValues17 = {
  narrow: ["ne", "po", "út", "st", "čt", "pá", "so"],
  short: ["ne", "po", "út", "st", "čt", "pá", "so"],
  abbreviated: ["ned", "pon", "úte", "stř", "čtv", "pát", "sob"],
  wide: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"]
};
var dayPeriodValues17 = {
  narrow: {
    am: "dop.",
    pm: "odp.",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  },
  abbreviated: {
    am: "dop.",
    pm: "odp.",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  },
  wide: {
    am: "dopoledne",
    pm: "odpoledne",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  }
};
var formattingDayPeriodValues16 = {
  narrow: {
    am: "dop.",
    pm: "odp.",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  },
  abbreviated: {
    am: "dop.",
    pm: "odp.",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  },
  wide: {
    am: "dopoledne",
    pm: "odpoledne",
    midnight: "půlnoc",
    noon: "poledne",
    morning: "ráno",
    afternoon: "odpoledne",
    evening: "večer",
    night: "noc"
  }
};
var ordinalNumber17 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize17 = {
  ordinalNumber: ordinalNumber17,
  era: buildLocalizeFn({
    values: eraValues17,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues17,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues17,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues4,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues17,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues17,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues16,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/cs/_lib/match.js
var matchOrdinalNumberPattern17 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern17 = /\d+/i;
var matchEraPatterns17 = {
  narrow: /^(p[řr](\.|ed) Kr\.|p[řr](\.|ed) n\. l\.|po Kr\.|n\. l\.)/i,
  abbreviated: /^(p[řr](\.|ed) Kr\.|p[řr](\.|ed) n\. l\.|po Kr\.|n\. l\.)/i,
  wide: /^(p[řr](\.|ed) Kristem|p[řr](\.|ed) na[šs][íi]m letopo[čc]tem|po Kristu|na[šs]eho letopo[čc]tu)/i
};
var parseEraPatterns17 = {
  any: [/^p[řr]/i, /^(po|n)/i]
};
var matchQuarterPatterns17 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\. [čc]tvrtlet[íi]/i,
  wide: /^[1234]\. [čc]tvrtlet[íi]/i
};
var parseQuarterPatterns17 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns17 = {
  narrow: /^[lúubdkčcszřrlp]/i,
  abbreviated: /^(led|[úu]no|b[řr]e|dub|kv[ěe]|[čc]vn|[čc]vc|srp|z[áa][řr]|[řr][íi]j|lis|pro)/i,
  wide: /^(leden|ledna|[úu]nora?|b[řr]ezen|b[řr]ezna|duben|dubna|kv[ěe]ten|kv[ěe]tna|[čc]erven(ec|ce)?|[čc]ervna|srpen|srpna|z[áa][řr][íi]|[řr][íi]jen|[řr][íi]jna|listopad(a|u)?|prosinec|prosince)/i
};
var parseMonthPatterns17 = {
  narrow: [
    /^l/i,
    /^[úu]/i,
    /^b/i,
    /^d/i,
    /^k/i,
    /^[čc]/i,
    /^[čc]/i,
    /^s/i,
    /^z/i,
    /^[řr]/i,
    /^l/i,
    /^p/i
  ],
  any: [
    /^led/i,
    /^[úu]n/i,
    /^b[řr]e/i,
    /^dub/i,
    /^kv[ěe]/i,
    /^[čc]vn|[čc]erven(?!\w)|[čc]ervna/i,
    /^[čc]vc|[čc]erven(ec|ce)/i,
    /^srp/i,
    /^z[áa][řr]/i,
    /^[řr][íi]j/i,
    /^lis/i,
    /^pro/i
  ]
};
var matchDayPatterns17 = {
  narrow: /^[npuúsčps]/i,
  short: /^(ne|po|[úu]t|st|[čc]t|p[áa]|so)/i,
  abbreviated: /^(ned|pon|[úu]te|st[rř]|[čc]tv|p[áa]t|sob)/i,
  wide: /^(ned[ěe]le|pond[ěe]l[íi]|[úu]ter[ýy]|st[řr]eda|[čc]tvrtek|p[áa]tek|sobota)/i
};
var parseDayPatterns17 = {
  narrow: [/^n/i, /^p/i, /^[úu]/i, /^s/i, /^[čc]/i, /^p/i, /^s/i],
  any: [/^ne/i, /^po/i, /^[úu]t/i, /^st/i, /^[čc]t/i, /^p[áa]/i, /^so/i]
};
var matchDayPeriodPatterns17 = {
  any: /^dopoledne|dop\.?|odpoledne|odp\.?|p[ůu]lnoc|poledne|r[áa]no|odpoledne|ve[čc]er|(v )?noci?/i
};
var parseDayPeriodPatterns17 = {
  any: {
    am: /^dop/i,
    pm: /^odp/i,
    midnight: /^p[ůu]lnoc/i,
    noon: /^poledne/i,
    morning: /r[áa]no/i,
    afternoon: /odpoledne/i,
    evening: /ve[čc]er/i,
    night: /noc/i
  }
};
var match17 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern17,
    parsePattern: parseOrdinalNumberPattern17,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns17,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns17,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns17,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns17,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns17,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns17,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns17,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns17,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns17,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns17,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/cy/_lib/formatLong.js
var dateFormats18 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats18 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats18 = {
  full: "{{date}} 'am' {{time}}",
  long: "{{date}} 'am' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong18 = {
  date: buildFormatLongFn({
    formats: dateFormats18,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats18,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats18,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/cy/_lib/localize.js
var eraValues18 = {
  narrow: ["C", "O"],
  abbreviated: ["CC", "OC"],
  wide: ["Cyn Crist", "Ar ôl Crist"]
};
var quarterValues18 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Ch1", "Ch2", "Ch3", "Ch4"],
  wide: ["Chwarter 1af", "2ail chwarter", "3ydd chwarter", "4ydd chwarter"]
};
var monthValues18 = {
  narrow: ["I", "Ch", "Ma", "E", "Mi", "Me", "G", "A", "Md", "H", "T", "Rh"],
  abbreviated: [
    "Ion",
    "Chwe",
    "Maw",
    "Ebr",
    "Mai",
    "Meh",
    "Gor",
    "Aws",
    "Med",
    "Hyd",
    "Tach",
    "Rhag"
  ],
  wide: [
    "Ionawr",
    "Chwefror",
    "Mawrth",
    "Ebrill",
    "Mai",
    "Mehefin",
    "Gorffennaf",
    "Awst",
    "Medi",
    "Hydref",
    "Tachwedd",
    "Rhagfyr"
  ]
};
var dayValues18 = {
  narrow: ["S", "Ll", "M", "M", "I", "G", "S"],
  short: ["Su", "Ll", "Ma", "Me", "Ia", "Gw", "Sa"],
  abbreviated: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwe", "Sad"],
  wide: [
    "dydd Sul",
    "dydd Llun",
    "dydd Mawrth",
    "dydd Mercher",
    "dydd Iau",
    "dydd Gwener",
    "dydd Sadwrn"
  ]
};
var dayPeriodValues18 = {
  narrow: {
    am: "b",
    pm: "h",
    midnight: "hn",
    noon: "hd",
    morning: "bore",
    afternoon: "prynhawn",
    evening: "gyda'r nos",
    night: "nos"
  },
  abbreviated: {
    am: "yb",
    pm: "yh",
    midnight: "hanner nos",
    noon: "hanner dydd",
    morning: "bore",
    afternoon: "prynhawn",
    evening: "gyda'r nos",
    night: "nos"
  },
  wide: {
    am: "y.b.",
    pm: "y.h.",
    midnight: "hanner nos",
    noon: "hanner dydd",
    morning: "bore",
    afternoon: "prynhawn",
    evening: "gyda'r nos",
    night: "nos"
  }
};
var formattingDayPeriodValues17 = {
  narrow: {
    am: "b",
    pm: "h",
    midnight: "hn",
    noon: "hd",
    morning: "yn y bore",
    afternoon: "yn y prynhawn",
    evening: "gyda'r nos",
    night: "yn y nos"
  },
  abbreviated: {
    am: "yb",
    pm: "yh",
    midnight: "hanner nos",
    noon: "hanner dydd",
    morning: "yn y bore",
    afternoon: "yn y prynhawn",
    evening: "gyda'r nos",
    night: "yn y nos"
  },
  wide: {
    am: "y.b.",
    pm: "y.h.",
    midnight: "hanner nos",
    noon: "hanner dydd",
    morning: "yn y bore",
    afternoon: "yn y prynhawn",
    evening: "gyda'r nos",
    night: "yn y nos"
  }
};
var ordinalNumber18 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  if (number < 20) {
    switch (number) {
      case 0:
        return number + "fed";
      case 1:
        return number + "af";
      case 2:
        return number + "ail";
      case 3:
      case 4:
        return number + "ydd";
      case 5:
      case 6:
        return number + "ed";
      case 7:
      case 8:
      case 9:
      case 10:
      case 12:
      case 15:
      case 18:
        return number + "fed";
      case 11:
      case 13:
      case 14:
      case 16:
      case 17:
      case 19:
        return number + "eg";
    }
  } else if (number >= 50 && number <= 60 || number === 80 || number >= 100) {
    return number + "fed";
  }
  return number + "ain";
};
var localize18 = {
  ordinalNumber: ordinalNumber18,
  era: buildLocalizeFn({
    values: eraValues18,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues18,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues18,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues18,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues18,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues17,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/cy/_lib/match.js
var matchOrdinalNumberPattern18 = /^(\d+)(af|ail|ydd|ed|fed|eg|ain)?/i;
var parseOrdinalNumberPattern18 = /\d+/i;
var matchEraPatterns18 = {
  narrow: /^(c|o)/i,
  abbreviated: /^(c\.?\s?c\.?|o\.?\s?c\.?)/i,
  wide: /^(cyn christ|ar ôl crist|ar ol crist)/i
};
var parseEraPatterns18 = {
  wide: [/^c/i, /^(ar ôl crist|ar ol crist)/i],
  any: [/^c/i, /^o/i]
};
var matchQuarterPatterns18 = {
  narrow: /^[1234]/i,
  abbreviated: /^ch[1234]/i,
  wide: /^(chwarter 1af)|([234](ail|ydd)? chwarter)/i
};
var parseQuarterPatterns18 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns18 = {
  narrow: /^(i|ch|m|e|g|a|h|t|rh)/i,
  abbreviated: /^(ion|chwe|maw|ebr|mai|meh|gor|aws|med|hyd|tach|rhag)/i,
  wide: /^(ionawr|chwefror|mawrth|ebrill|mai|mehefin|gorffennaf|awst|medi|hydref|tachwedd|rhagfyr)/i
};
var parseMonthPatterns18 = {
  narrow: [
    /^i/i,
    /^ch/i,
    /^m/i,
    /^e/i,
    /^m/i,
    /^m/i,
    /^g/i,
    /^a/i,
    /^m/i,
    /^h/i,
    /^t/i,
    /^rh/i
  ],
  any: [
    /^io/i,
    /^ch/i,
    /^maw/i,
    /^e/i,
    /^mai/i,
    /^meh/i,
    /^g/i,
    /^a/i,
    /^med/i,
    /^h/i,
    /^t/i,
    /^rh/i
  ]
};
var matchDayPatterns18 = {
  narrow: /^(s|ll|m|i|g)/i,
  short: /^(su|ll|ma|me|ia|gw|sa)/i,
  abbreviated: /^(sul|llun|maw|mer|iau|gwe|sad)/i,
  wide: /^dydd (sul|llun|mawrth|mercher|iau|gwener|sadwrn)/i
};
var parseDayPatterns18 = {
  narrow: [/^s/i, /^ll/i, /^m/i, /^m/i, /^i/i, /^g/i, /^s/i],
  wide: [
    /^dydd su/i,
    /^dydd ll/i,
    /^dydd ma/i,
    /^dydd me/i,
    /^dydd i/i,
    /^dydd g/i,
    /^dydd sa/i
  ],
  any: [/^su/i, /^ll/i, /^ma/i, /^me/i, /^i/i, /^g/i, /^sa/i]
};
var matchDayPeriodPatterns18 = {
  narrow: /^(b|h|hn|hd|(yn y|y|yr|gyda'r) (bore|prynhawn|nos|hwyr))/i,
  any: /^(y\.?\s?[bh]\.?|hanner nos|hanner dydd|(yn y|y|yr|gyda'r) (bore|prynhawn|nos|hwyr))/i
};
var parseDayPeriodPatterns18 = {
  any: {
    am: /^b|(y\.?\s?b\.?)/i,
    pm: /^h|(y\.?\s?h\.?)|(yr hwyr)/i,
    midnight: /^hn|hanner nos/i,
    noon: /^hd|hanner dydd/i,
    morning: /bore/i,
    afternoon: /prynhawn/i,
    evening: /^gyda'r nos$/i,
    night: /blah/i
  }
};
var match18 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern18,
    parsePattern: parseOrdinalNumberPattern18,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns18,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns18,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns18,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns18,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns18,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns18,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns18,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns18,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns18,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns18,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/da/_lib/formatLong.js
var dateFormats19 = {
  full: "EEEE 'den' d. MMMM y",
  long: "d. MMMM y",
  medium: "d. MMM y",
  short: "dd/MM/y"
};
var timeFormats19 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats19 = {
  full: "{{date}} 'kl'. {{time}}",
  long: "{{date}} 'kl'. {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong19 = {
  date: buildFormatLongFn({
    formats: dateFormats19,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats19,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats19,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/da/_lib/localize.js
var eraValues19 = {
  narrow: ["fvt", "vt"],
  abbreviated: ["f.v.t.", "v.t."],
  wide: ["før vesterlandsk tidsregning", "vesterlandsk tidsregning"]
};
var quarterValues19 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1. kvt.", "2. kvt.", "3. kvt.", "4. kvt."],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues19 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mar.",
    "apr.",
    "maj",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "januar",
    "februar",
    "marts",
    "april",
    "maj",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "december"
  ]
};
var dayValues19 = {
  narrow: ["S", "M", "T", "O", "T", "F", "L"],
  short: ["sø", "ma", "ti", "on", "to", "fr", "lø"],
  abbreviated: ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."],
  wide: [
    "søndag",
    "mandag",
    "tirsdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lørdag"
  ]
};
var dayPeriodValues19 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "midnat",
    noon: "middag",
    morning: "morgen",
    afternoon: "eftermiddag",
    evening: "aften",
    night: "nat"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnat",
    noon: "middag",
    morning: "morgen",
    afternoon: "eftermiddag",
    evening: "aften",
    night: "nat"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnat",
    noon: "middag",
    morning: "morgen",
    afternoon: "eftermiddag",
    evening: "aften",
    night: "nat"
  }
};
var formattingDayPeriodValues18 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "midnat",
    noon: "middag",
    morning: "om morgenen",
    afternoon: "om eftermiddagen",
    evening: "om aftenen",
    night: "om natten"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnat",
    noon: "middag",
    morning: "om morgenen",
    afternoon: "om eftermiddagen",
    evening: "om aftenen",
    night: "om natten"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnat",
    noon: "middag",
    morning: "om morgenen",
    afternoon: "om eftermiddagen",
    evening: "om aftenen",
    night: "om natten"
  }
};
var ordinalNumber19 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize19 = {
  ordinalNumber: ordinalNumber19,
  era: buildLocalizeFn({
    values: eraValues19,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues19,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues19,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues19,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues19,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues18,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/da/_lib/match.js
var matchOrdinalNumberPattern19 = /^(\d+)(\.)?/i;
var parseOrdinalNumberPattern19 = /\d+/i;
var matchEraPatterns19 = {
  narrow: /^(fKr|fvt|eKr|vt)/i,
  abbreviated: /^(f\.Kr\.?|f\.v\.t\.?|e\.Kr\.?|v\.t\.)/i,
  wide: /^(f.Kr.|før vesterlandsk tidsregning|e.Kr.|vesterlandsk tidsregning)/i
};
var parseEraPatterns19 = {
  any: [/^f/i, /^(v|e)/i]
};
var matchQuarterPatterns19 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]. kvt\./i,
  wide: /^[1234]\.? kvartal/i
};
var parseQuarterPatterns19 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns19 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan.|feb.|mar.|apr.|maj|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
  wide: /^(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)/i
};
var parseMonthPatterns19 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns19 = {
  narrow: /^[smtofl]/i,
  short: /^(søn.|man.|tir.|ons.|tor.|fre.|lør.)/i,
  abbreviated: /^(søn|man|tir|ons|tor|fre|lør)/i,
  wide: /^(søndag|mandag|tirsdag|onsdag|torsdag|fredag|lørdag)/i
};
var parseDayPatterns19 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^o/i, /^t/i, /^f/i, /^l/i],
  any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
};
var matchDayPeriodPatterns19 = {
  narrow: /^(a|p|midnat|middag|(om) (morgenen|eftermiddagen|aftenen|natten))/i,
  any: /^([ap]\.?\s?m\.?|midnat|middag|(om) (morgenen|eftermiddagen|aftenen|natten))/i
};
var parseDayPeriodPatterns19 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /midnat/i,
    noon: /middag/i,
    morning: /morgen/i,
    afternoon: /eftermiddag/i,
    evening: /aften/i,
    night: /nat/i
  }
};
var match19 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern19,
    parsePattern: parseOrdinalNumberPattern19,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns19,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns19,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns19,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns19,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns19,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns19,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns19,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns19,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns19,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns19,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/de/_lib/formatLong.js
var dateFormats20 = {
  full: "EEEE, do MMMM y",
  // Montag, 7. Januar 2018
  long: "do MMMM y",
  // 7. Januar 2018
  medium: "do MMM y",
  // 7. Jan. 2018
  short: "dd.MM.y"
  // 07.01.2018
};
var timeFormats20 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats20 = {
  full: "{{date}} 'um' {{time}}",
  long: "{{date}} 'um' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong20 = {
  date: buildFormatLongFn({
    formats: dateFormats20,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats20,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats20,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/de/_lib/localize.js
var eraValues20 = {
  narrow: ["v.Chr.", "n.Chr."],
  abbreviated: ["v.Chr.", "n.Chr."],
  wide: ["vor Christus", "nach Christus"]
};
var quarterValues20 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"]
};
var monthValues20 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez"
  ],
  wide: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ]
};
var formattingMonthValues5 = {
  narrow: monthValues20.narrow,
  abbreviated: [
    "Jan.",
    "Feb.",
    "März",
    "Apr.",
    "Mai",
    "Juni",
    "Juli",
    "Aug.",
    "Sep.",
    "Okt.",
    "Nov.",
    "Dez."
  ],
  wide: monthValues20.wide
};
var dayValues20 = {
  narrow: ["S", "M", "D", "M", "D", "F", "S"],
  short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  abbreviated: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  wide: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
  ]
};
var dayPeriodValues20 = {
  narrow: {
    am: "vm.",
    pm: "nm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachm.",
    evening: "Abend",
    night: "Nacht"
  },
  abbreviated: {
    am: "vorm.",
    pm: "nachm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachmittag",
    evening: "Abend",
    night: "Nacht"
  },
  wide: {
    am: "vormittags",
    pm: "nachmittags",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachmittag",
    evening: "Abend",
    night: "Nacht"
  }
};
var formattingDayPeriodValues19 = {
  narrow: {
    am: "vm.",
    pm: "nm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachm.",
    evening: "abends",
    night: "nachts"
  },
  abbreviated: {
    am: "vorm.",
    pm: "nachm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachmittags",
    evening: "abends",
    night: "nachts"
  },
  wide: {
    am: "vormittags",
    pm: "nachmittags",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachmittags",
    evening: "abends",
    night: "nachts"
  }
};
var ordinalNumber20 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize20 = {
  ordinalNumber: ordinalNumber20,
  era: buildLocalizeFn({
    values: eraValues20,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues20,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues20,
    formattingValues: formattingMonthValues5,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues20,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues20,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues19,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/de/_lib/match.js
var matchOrdinalNumberPattern20 = /^(\d+)(\.)?/i;
var parseOrdinalNumberPattern20 = /\d+/i;
var matchEraPatterns20 = {
  narrow: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
  abbreviated: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
  wide: /^(vor Christus|vor unserer Zeitrechnung|nach Christus|unserer Zeitrechnung)/i
};
var parseEraPatterns20 = {
  any: [/^v/i, /^n/i]
};
var matchQuarterPatterns20 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](\.)? Quartal/i
};
var parseQuarterPatterns20 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns20 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(j[aä]n|feb|mär[z]?|apr|mai|jun[i]?|jul[i]?|aug|sep|okt|nov|dez)\.?/i,
  wide: /^(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/i
};
var parseMonthPatterns20 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^j[aä]/i,
    /^f/i,
    /^mär/i,
    /^ap/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns20 = {
  narrow: /^[smdmf]/i,
  short: /^(so|mo|di|mi|do|fr|sa)/i,
  abbreviated: /^(son?|mon?|die?|mit?|don?|fre?|sam?)\.?/i,
  wide: /^(sonntag|montag|dienstag|mittwoch|donnerstag|freitag|samstag)/i
};
var parseDayPatterns20 = {
  any: [/^so/i, /^mo/i, /^di/i, /^mi/i, /^do/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns20 = {
  narrow: /^(vm\.?|nm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
  abbreviated: /^(vorm\.?|nachm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
  wide: /^(vormittags|nachmittags|Mitternacht|Mittag|morgens|nachmittags|abends|nachts)/i
};
var parseDayPeriodPatterns20 = {
  any: {
    am: /^v/i,
    pm: /^n/i,
    midnight: /^Mitte/i,
    noon: /^Mitta/i,
    morning: /morgens/i,
    afternoon: /nachmittags/i,
    // will never be matched. Afternoon is matched by `pm`
    evening: /abends/i,
    night: /nachts/i
    // will never be matched. Night is matched by `pm`
  }
};
var match20 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern20,
    parsePattern: parseOrdinalNumberPattern20,
    valueCallback: (value) => parseInt(value)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns20,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns20,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns20,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns20,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns20,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns20,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns20,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns20,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns20,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns20,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/de-AT/_lib/localize.js
var eraValues21 = {
  narrow: ["v.Chr.", "n.Chr."],
  abbreviated: ["v.Chr.", "n.Chr."],
  wide: ["vor Christus", "nach Christus"]
};
var quarterValues21 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"]
};
var monthValues21 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jän",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez"
  ],
  wide: [
    "Jänner",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ]
};
var formattingMonthValues6 = {
  narrow: monthValues21.narrow,
  abbreviated: [
    "Jän.",
    "Feb.",
    "März",
    "Apr.",
    "Mai",
    "Juni",
    "Juli",
    "Aug.",
    "Sep.",
    "Okt.",
    "Nov.",
    "Dez."
  ],
  wide: monthValues21.wide
};
var dayValues21 = {
  narrow: ["S", "M", "D", "M", "D", "F", "S"],
  short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  abbreviated: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  wide: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
  ]
};
var dayPeriodValues21 = {
  narrow: {
    am: "vm.",
    pm: "nm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachm.",
    evening: "Abend",
    night: "Nacht"
  },
  abbreviated: {
    am: "vorm.",
    pm: "nachm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachmittag",
    evening: "Abend",
    night: "Nacht"
  },
  wide: {
    am: "vormittags",
    pm: "nachmittags",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "Morgen",
    afternoon: "Nachmittag",
    evening: "Abend",
    night: "Nacht"
  }
};
var formattingDayPeriodValues20 = {
  narrow: {
    am: "vm.",
    pm: "nm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachm.",
    evening: "abends",
    night: "nachts"
  },
  abbreviated: {
    am: "vorm.",
    pm: "nachm.",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachmittags",
    evening: "abends",
    night: "nachts"
  },
  wide: {
    am: "vormittags",
    pm: "nachmittags",
    midnight: "Mitternacht",
    noon: "Mittag",
    morning: "morgens",
    afternoon: "nachmittags",
    evening: "abends",
    night: "nachts"
  }
};
var ordinalNumber21 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize21 = {
  ordinalNumber: ordinalNumber21,
  era: buildLocalizeFn({
    values: eraValues21,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues21,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues21,
    formattingValues: formattingMonthValues6,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues21,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues21,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues20,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/el/_lib/formatLong.js
var dateFormats21 = {
  full: "EEEE, d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "d/M/yy"
};
var timeFormats21 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats21 = {
  full: "{{date}} - {{time}}",
  long: "{{date}} - {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong21 = {
  date: buildFormatLongFn({
    formats: dateFormats21,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats21,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats21,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/el/_lib/localize.js
var eraValues22 = {
  narrow: ["πΧ", "μΧ"],
  abbreviated: ["π.Χ.", "μ.Χ."],
  wide: ["προ Χριστού", "μετά Χριστόν"]
};
var quarterValues22 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Τ1", "Τ2", "Τ3", "Τ4"],
  wide: ["1ο τρίμηνο", "2ο τρίμηνο", "3ο τρίμηνο", "4ο τρίμηνο"]
};
var monthValues22 = {
  narrow: ["Ι", "Φ", "Μ", "Α", "Μ", "Ι", "Ι", "Α", "Σ", "Ο", "Ν", "Δ"],
  abbreviated: [
    "Ιαν",
    "Φεβ",
    "Μάρ",
    "Απρ",
    "Μάι",
    "Ιούν",
    "Ιούλ",
    "Αύγ",
    "Σεπ",
    "Οκτ",
    "Νοέ",
    "Δεκ"
  ],
  wide: [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος"
  ]
};
var formattingMonthValues7 = {
  narrow: ["Ι", "Φ", "Μ", "Α", "Μ", "Ι", "Ι", "Α", "Σ", "Ο", "Ν", "Δ"],
  abbreviated: [
    "Ιαν",
    "Φεβ",
    "Μαρ",
    "Απρ",
    "Μαΐ",
    "Ιουν",
    "Ιουλ",
    "Αυγ",
    "Σεπ",
    "Οκτ",
    "Νοε",
    "Δεκ"
  ],
  wide: [
    "Ιανουαρίου",
    "Φεβρουαρίου",
    "Μαρτίου",
    "Απριλίου",
    "Μαΐου",
    "Ιουνίου",
    "Ιουλίου",
    "Αυγούστου",
    "Σεπτεμβρίου",
    "Οκτωβρίου",
    "Νοεμβρίου",
    "Δεκεμβρίου"
  ]
};
var dayValues22 = {
  narrow: ["Κ", "Δ", "T", "Τ", "Π", "Π", "Σ"],
  short: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
  abbreviated: ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"],
  wide: [
    "Κυριακή",
    "Δευτέρα",
    "Τρίτη",
    "Τετάρτη",
    "Πέμπτη",
    "Παρασκευή",
    "Σάββατο"
  ]
};
var dayPeriodValues22 = {
  narrow: {
    am: "πμ",
    pm: "μμ",
    midnight: "μεσάνυχτα",
    noon: "μεσημέρι",
    morning: "πρωί",
    afternoon: "απόγευμα",
    evening: "βράδυ",
    night: "νύχτα"
  },
  abbreviated: {
    am: "π.μ.",
    pm: "μ.μ.",
    midnight: "μεσάνυχτα",
    noon: "μεσημέρι",
    morning: "πρωί",
    afternoon: "απόγευμα",
    evening: "βράδυ",
    night: "νύχτα"
  },
  wide: {
    am: "π.μ.",
    pm: "μ.μ.",
    midnight: "μεσάνυχτα",
    noon: "μεσημέρι",
    morning: "πρωί",
    afternoon: "απόγευμα",
    evening: "βράδυ",
    night: "νύχτα"
  }
};
var ordinalNumber22 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  let suffix;
  if (unit === "year" || unit === "month") {
    suffix = "ος";
  } else if (unit === "week" || unit === "dayOfYear" || unit === "day" || unit === "hour" || unit === "date") {
    suffix = "η";
  } else {
    suffix = "ο";
  }
  return number + suffix;
};
var localize22 = {
  ordinalNumber: ordinalNumber22,
  era: buildLocalizeFn({
    values: eraValues22,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues22,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues22,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues7,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues22,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues22,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/el/_lib/match.js
var matchOrdinalNumberPattern21 = /^(\d+)(ος|η|ο)?/i;
var parseOrdinalNumberPattern21 = /\d+/i;
var matchEraPatterns21 = {
  narrow: /^(πΧ|μΧ)/i,
  abbreviated: /^(π\.?\s?χ\.?|π\.?\s?κ\.?\s?χ\.?|μ\.?\s?χ\.?|κ\.?\s?χ\.?)/i,
  wide: /^(προ Χριστο(ύ|υ)|πριν απ(ό|ο) την Κοιν(ή|η) Χρονολογ(ί|ι)α|μετ(ά|α) Χριστ(ό|ο)ν|Κοιν(ή|η) Χρονολογ(ί|ι)α)/i
};
var parseEraPatterns21 = {
  any: [/^π/i, /^(μ|κ)/i]
};
var matchQuarterPatterns21 = {
  narrow: /^[1234]/i,
  abbreviated: /^τ[1234]/i,
  wide: /^[1234]ο? τρ(ί|ι)μηνο/i
};
var parseQuarterPatterns21 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns21 = {
  narrow: /^[ιφμαμιιασονδ]/i,
  abbreviated: /^(ιαν|φεβ|μ[άα]ρ|απρ|μ[άα][ιΐ]|ιο[ύυ]ν|ιο[ύυ]λ|α[ύυ]γ|σεπ|οκτ|νο[έε]|δεκ)/i,
  wide: /^(μ[άα][ιΐ]|α[ύυ]γο[υύ]στ)(ος|ου)|(ιανου[άα]ρ|φεβρου[άα]ρ|μ[άα]ρτ|απρ[ίι]λ|ιο[ύυ]ν|ιο[ύυ]λ|σεπτ[έε]μβρ|οκτ[ώω]βρ|νο[έε]μβρ|δεκ[έε]μβρ)(ιος|ίου)/i
};
var parseMonthPatterns21 = {
  narrow: [
    /^ι/i,
    /^φ/i,
    /^μ/i,
    /^α/i,
    /^μ/i,
    /^ι/i,
    /^ι/i,
    /^α/i,
    /^σ/i,
    /^ο/i,
    /^ν/i,
    /^δ/i
  ],
  any: [
    /^ια/i,
    /^φ/i,
    /^μ[άα]ρ/i,
    /^απ/i,
    /^μ[άα][ιΐ]/i,
    /^ιο[ύυ]ν/i,
    /^ιο[ύυ]λ/i,
    /^α[ύυ]/i,
    /^σ/i,
    /^ο/i,
    /^ν/i,
    /^δ/i
  ]
};
var matchDayPatterns21 = {
  narrow: /^[κδτπσ]/i,
  short: /^(κυ|δε|τρ|τε|π[εέ]|π[αά]|σ[αά])/i,
  abbreviated: /^(κυρ|δευ|τρι|τετ|πεμ|παρ|σαβ)/i,
  wide: /^(κυριακ(ή|η)|δευτ(έ|ε)ρα|τρ(ί|ι)τη|τετ(ά|α)ρτη|π(έ|ε)μπτη|παρασκευ(ή|η)|σ(ά|α)ββατο)/i
};
var parseDayPatterns21 = {
  narrow: [/^κ/i, /^δ/i, /^τ/i, /^τ/i, /^π/i, /^π/i, /^σ/i],
  any: [/^κ/i, /^δ/i, /^τρ/i, /^τε/i, /^π[εέ]/i, /^π[αά]/i, /^σ/i]
};
var matchDayPeriodPatterns21 = {
  narrow: /^(πμ|μμ|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i,
  any: /^([πμ]\.?\s?μ\.?|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i
};
var parseDayPeriodPatterns21 = {
  any: {
    am: /^πμ|π\.\s?μ\./i,
    pm: /^μμ|μ\.\s?μ\./i,
    midnight: /^μεσάν/i,
    noon: /^μεσημ(έ|ε)/i,
    morning: /πρω(ί|ι)/i,
    afternoon: /απ(ό|ο)γευμα/i,
    evening: /βρ(ά|α)δυ/i,
    night: /ν(ύ|υ)χτα/i
  }
};
var match21 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern21,
    parsePattern: parseOrdinalNumberPattern21,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns21,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns21,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns21,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns21,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns21,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns21,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns21,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns21,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns21,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns21,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/en-AU/_lib/formatLong.js
var dateFormats22 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats22 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats22 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong22 = {
  date: buildFormatLongFn({
    formats: dateFormats22,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats22,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats22,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-CA/_lib/formatLong.js
var dateFormats23 = {
  full: "EEEE, MMMM do, yyyy",
  long: "MMMM do, yyyy",
  medium: "MMM d, yyyy",
  short: "yyyy-MM-dd"
};
var timeFormats23 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats23 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong23 = {
  date: buildFormatLongFn({
    formats: dateFormats23,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats23,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats23,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-GB/_lib/formatLong.js
var dateFormats24 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats24 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats24 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong24 = {
  date: buildFormatLongFn({
    formats: dateFormats24,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats24,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats24,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-IN/_lib/formatLong.js
var dateFormats25 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM, yyyy",
  medium: "d MMM, yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats25 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats25 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong25 = {
  date: buildFormatLongFn({
    formats: dateFormats25,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats25,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats25,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-NZ/_lib/formatLong.js
var dateFormats26 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats26 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats26 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong26 = {
  date: buildFormatLongFn({
    formats: dateFormats26,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats26,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats26,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-ZA/_lib/formatLong.js
var dateFormats27 = {
  full: "EEEE, dd MMMM yyyy",
  long: "dd MMMM yyyy",
  medium: "dd MMM yyyy",
  short: "yyyy/MM/dd"
};
var timeFormats27 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats27 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong27 = {
  date: buildFormatLongFn({
    formats: dateFormats27,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats27,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats27,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/eo/_lib/formatLong.js
var dateFormats28 = {
  full: "EEEE, do 'de' MMMM y",
  long: "y-MMMM-dd",
  medium: "y-MMM-dd",
  short: "yyyy-MM-dd"
};
var timeFormats28 = {
  full: "Ho 'horo kaj' m:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats28 = {
  any: "{{date}} {{time}}"
};
var formatLong28 = {
  date: buildFormatLongFn({
    formats: dateFormats28,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats28,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats28,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/eo/_lib/localize.js
var eraValues23 = {
  narrow: ["aK", "pK"],
  abbreviated: ["a.K.E.", "p.K.E."],
  wide: ["antaŭ Komuna Erao", "Komuna Erao"]
};
var quarterValues23 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: [
    "1-a kvaronjaro",
    "2-a kvaronjaro",
    "3-a kvaronjaro",
    "4-a kvaronjaro"
  ]
};
var monthValues23 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aŭg",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januaro",
    "februaro",
    "marto",
    "aprilo",
    "majo",
    "junio",
    "julio",
    "aŭgusto",
    "septembro",
    "oktobro",
    "novembro",
    "decembro"
  ]
};
var dayValues23 = {
  narrow: ["D", "L", "M", "M", "Ĵ", "V", "S"],
  short: ["di", "lu", "ma", "me", "ĵa", "ve", "sa"],
  abbreviated: ["dim", "lun", "mar", "mer", "ĵaŭ", "ven", "sab"],
  wide: [
    "dimanĉo",
    "lundo",
    "mardo",
    "merkredo",
    "ĵaŭdo",
    "vendredo",
    "sabato"
  ]
};
var dayPeriodValues23 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "noktomezo",
    noon: "tagmezo",
    morning: "matene",
    afternoon: "posttagmeze",
    evening: "vespere",
    night: "nokte"
  },
  abbreviated: {
    am: "a.t.m.",
    pm: "p.t.m.",
    midnight: "noktomezo",
    noon: "tagmezo",
    morning: "matene",
    afternoon: "posttagmeze",
    evening: "vespere",
    night: "nokte"
  },
  wide: {
    am: "antaŭtagmeze",
    pm: "posttagmeze",
    midnight: "noktomezo",
    noon: "tagmezo",
    morning: "matene",
    afternoon: "posttagmeze",
    evening: "vespere",
    night: "nokte"
  }
};
var ordinalNumber23 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  return number + "-a";
};
var localize23 = {
  ordinalNumber: ordinalNumber23,
  era: buildLocalizeFn({
    values: eraValues23,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues23,
    defaultWidth: "wide",
    argumentCallback: function(quarter) {
      return Number(quarter) - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues23,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues23,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues23,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/eo/_lib/match.js
var matchOrdinalNumberPattern22 = /^(\d+)(-?a)?/i;
var parseOrdinalNumberPattern22 = /\d+/i;
var matchEraPatterns22 = {
  narrow: /^([ap]k)/i,
  abbreviated: /^([ap]\.?\s?k\.?\s?e\.?)/i,
  wide: /^((antaǔ |post )?komuna erao)/i
};
var parseEraPatterns22 = {
  any: [/^a/i, /^[kp]/i]
};
var matchQuarterPatterns22 = {
  narrow: /^[1234]/i,
  abbreviated: /^k[1234]/i,
  wide: /^[1234](-?a)? kvaronjaro/i
};
var parseQuarterPatterns22 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns22 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|maj|jun|jul|a(ŭ|ux|uh|u)g|sep|okt|nov|dec)/i,
  wide: /^(januaro|februaro|marto|aprilo|majo|junio|julio|a(ŭ|ux|uh|u)gusto|septembro|oktobro|novembro|decembro)/i
};
var parseMonthPatterns22 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^a(u|ŭ)/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns22 = {
  narrow: /^[dlmĵjvs]/i,
  short: /^(di|lu|ma|me|(ĵ|jx|jh|j)a|ve|sa)/i,
  abbreviated: /^(dim|lun|mar|mer|(ĵ|jx|jh|j)a(ŭ|ux|uh|u)|ven|sab)/i,
  wide: /^(diman(ĉ|cx|ch|c)o|lundo|mardo|merkredo|(ĵ|jx|jh|j)a(ŭ|ux|uh|u)do|vendredo|sabato)/i
};
var parseDayPatterns22 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^(j|ĵ)/i, /^v/i, /^s/i],
  any: [/^d/i, /^l/i, /^ma/i, /^me/i, /^(j|ĵ)/i, /^v/i, /^s/i]
};
var matchDayPeriodPatterns22 = {
  narrow: /^([ap]|(posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo])/i,
  abbreviated: /^([ap][.\s]?t[.\s]?m[.\s]?|(posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo])/i,
  wide: /^(anta(ŭ|ux)tagmez|posttagmez|noktomez|tagmez|maten|vesper|nokt)[eo]/i
};
var parseDayPeriodPatterns22 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^noktom/i,
    noon: /^t/i,
    morning: /^m/i,
    afternoon: /^posttagmeze/i,
    evening: /^v/i,
    night: /^n/i
  }
};
var match22 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern22,
    parsePattern: parseOrdinalNumberPattern22,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns22,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns22,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns22,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns22,
    defaultParseWidth: "any",
    valueCallback: function(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns22,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns22,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns22,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns22,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns22,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns22,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/es/_lib/formatLong.js
var dateFormats29 = {
  full: "EEEE, d 'de' MMMM 'de' y",
  long: "d 'de' MMMM 'de' y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats29 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats29 = {
  full: "{{date}} 'a las' {{time}}",
  long: "{{date}} 'a las' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong29 = {
  date: buildFormatLongFn({
    formats: dateFormats29,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats29,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats29,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/es/_lib/localize.js
var eraValues24 = {
  narrow: ["AC", "DC"],
  abbreviated: ["AC", "DC"],
  wide: ["antes de cristo", "después de cristo"]
};
var quarterValues24 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
};
var monthValues24 = {
  narrow: ["e", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic"
  ],
  wide: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ]
};
var dayValues24 = {
  narrow: ["d", "l", "m", "m", "j", "v", "s"],
  short: ["do", "lu", "ma", "mi", "ju", "vi", "sá"],
  abbreviated: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  wide: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado"
  ]
};
var dayPeriodValues24 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "mañana",
    afternoon: "tarde",
    evening: "tarde",
    night: "noche"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "medianoche",
    noon: "mediodia",
    morning: "mañana",
    afternoon: "tarde",
    evening: "tarde",
    night: "noche"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "medianoche",
    noon: "mediodia",
    morning: "mañana",
    afternoon: "tarde",
    evening: "tarde",
    night: "noche"
  }
};
var formattingDayPeriodValues21 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "de la mañana",
    afternoon: "de la tarde",
    evening: "de la tarde",
    night: "de la noche"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "medianoche",
    noon: "mediodia",
    morning: "de la mañana",
    afternoon: "de la tarde",
    evening: "de la tarde",
    night: "de la noche"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "medianoche",
    noon: "mediodia",
    morning: "de la mañana",
    afternoon: "de la tarde",
    evening: "de la tarde",
    night: "de la noche"
  }
};
var ordinalNumber24 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "º";
};
var localize24 = {
  ordinalNumber: ordinalNumber24,
  era: buildLocalizeFn({
    values: eraValues24,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues24,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues24,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues24,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues24,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues21,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/es/_lib/match.js
var matchOrdinalNumberPattern23 = /^(\d+)(º)?/i;
var parseOrdinalNumberPattern23 = /\d+/i;
var matchEraPatterns23 = {
  narrow: /^(ac|dc|a|d)/i,
  abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
  wide: /^(antes de cristo|antes de la era com[uú]n|despu[eé]s de cristo|era com[uú]n)/i
};
var parseEraPatterns23 = {
  any: [/^ac/i, /^dc/i],
  wide: [
    /^(antes de cristo|antes de la era com[uú]n)/i,
    /^(despu[eé]s de cristo|era com[uú]n)/i
  ]
};
var matchQuarterPatterns23 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^[1234](º)? trimestre/i
};
var parseQuarterPatterns23 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns23 = {
  narrow: /^[efmajsond]/i,
  abbreviated: /^(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i,
  wide: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i
};
var parseMonthPatterns23 = {
  narrow: [
    /^e/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^en/i,
    /^feb/i,
    /^mar/i,
    /^abr/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^ago/i,
    /^sep/i,
    /^oct/i,
    /^nov/i,
    /^dic/i
  ]
};
var matchDayPatterns23 = {
  narrow: /^[dlmjvs]/i,
  short: /^(do|lu|ma|mi|ju|vi|s[áa])/i,
  abbreviated: /^(dom|lun|mar|mi[ée]|jue|vie|s[áa]b)/i,
  wide: /^(domingo|lunes|martes|mi[ée]rcoles|jueves|viernes|s[áa]bado)/i
};
var parseDayPatterns23 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
  any: [/^do/i, /^lu/i, /^ma/i, /^mi/i, /^ju/i, /^vi/i, /^sa/i]
};
var matchDayPeriodPatterns23 = {
  narrow: /^(a|p|mn|md|(de la|a las) (mañana|tarde|noche))/i,
  any: /^([ap]\.?\s?m\.?|medianoche|mediodia|(de la|a las) (mañana|tarde|noche))/i
};
var parseDayPeriodPatterns23 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mn/i,
    noon: /^md/i,
    morning: /mañana/i,
    afternoon: /tarde/i,
    evening: /tarde/i,
    night: /noche/i
  }
};
var match23 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern23,
    parsePattern: parseOrdinalNumberPattern23,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns23,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns23,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns23,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns23,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns23,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns23,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns23,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns23,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns23,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns23,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/et/_lib/formatLong.js
var dateFormats30 = {
  full: "EEEE, d. MMMM y",
  long: "d. MMMM y",
  medium: "d. MMM y",
  short: "dd.MM.y"
};
var timeFormats30 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats30 = {
  full: "{{date}} 'kell' {{time}}",
  long: "{{date}} 'kell' {{time}}",
  medium: "{{date}}. {{time}}",
  short: "{{date}}. {{time}}"
};
var formatLong30 = {
  date: buildFormatLongFn({
    formats: dateFormats30,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats30,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats30,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/et/_lib/localize.js
var eraValues25 = {
  narrow: ["e.m.a", "m.a.j"],
  abbreviated: ["e.m.a", "m.a.j"],
  wide: ["enne meie ajaarvamist", "meie ajaarvamise järgi"]
};
var quarterValues25 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues25 = {
  narrow: ["J", "V", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jaan",
    "veebr",
    "märts",
    "apr",
    "mai",
    "juuni",
    "juuli",
    "aug",
    "sept",
    "okt",
    "nov",
    "dets"
  ],
  wide: [
    "jaanuar",
    "veebruar",
    "märts",
    "aprill",
    "mai",
    "juuni",
    "juuli",
    "august",
    "september",
    "oktoober",
    "november",
    "detsember"
  ]
};
var dayValues25 = {
  narrow: ["P", "E", "T", "K", "N", "R", "L"],
  short: ["P", "E", "T", "K", "N", "R", "L"],
  abbreviated: [
    "pühap.",
    "esmasp.",
    "teisip.",
    "kolmap.",
    "neljap.",
    "reede.",
    "laup."
  ],
  wide: [
    "pühapäev",
    "esmaspäev",
    "teisipäev",
    "kolmapäev",
    "neljapäev",
    "reede",
    "laupäev"
  ]
};
var dayPeriodValues25 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "kesköö",
    noon: "keskpäev",
    morning: "hommik",
    afternoon: "pärastlõuna",
    evening: "õhtu",
    night: "öö"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "kesköö",
    noon: "keskpäev",
    morning: "hommik",
    afternoon: "pärastlõuna",
    evening: "õhtu",
    night: "öö"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "kesköö",
    noon: "keskpäev",
    morning: "hommik",
    afternoon: "pärastlõuna",
    evening: "õhtu",
    night: "öö"
  }
};
var formattingDayPeriodValues22 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "keskööl",
    noon: "keskpäeval",
    morning: "hommikul",
    afternoon: "pärastlõunal",
    evening: "õhtul",
    night: "öösel"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "keskööl",
    noon: "keskpäeval",
    morning: "hommikul",
    afternoon: "pärastlõunal",
    evening: "õhtul",
    night: "öösel"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "keskööl",
    noon: "keskpäeval",
    morning: "hommikul",
    afternoon: "pärastlõunal",
    evening: "õhtul",
    night: "öösel"
  }
};
var ordinalNumber25 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize25 = {
  ordinalNumber: ordinalNumber25,
  era: buildLocalizeFn({
    values: eraValues25,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues25,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues25,
    defaultWidth: "wide",
    formattingValues: monthValues25,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues25,
    defaultWidth: "wide",
    formattingValues: dayValues25,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues25,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues22,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/et/_lib/match.js
var matchOrdinalNumberPattern24 = /^\d+\./i;
var parseOrdinalNumberPattern24 = /\d+/i;
var matchEraPatterns24 = {
  narrow: /^(e\.m\.a|m\.a\.j|eKr|pKr)/i,
  abbreviated: /^(e\.m\.a|m\.a\.j|eKr|pKr)/i,
  wide: /^(enne meie ajaarvamist|meie ajaarvamise järgi|enne Kristust|pärast Kristust)/i
};
var parseEraPatterns24 = {
  any: [/^e/i, /^(m|p)/i]
};
var matchQuarterPatterns24 = {
  narrow: /^[1234]/i,
  abbreviated: /^K[1234]/i,
  wide: /^[1234](\.)? kvartal/i
};
var parseQuarterPatterns24 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns24 = {
  narrow: /^[jvmasond]/i,
  abbreviated: /^(jaan|veebr|märts|apr|mai|juuni|juuli|aug|sept|okt|nov|dets)/i,
  wide: /^(jaanuar|veebruar|märts|aprill|mai|juuni|juuli|august|september|oktoober|november|detsember)/i
};
var parseMonthPatterns24 = {
  narrow: [
    /^j/i,
    /^v/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^v/i,
    /^mär/i,
    /^ap/i,
    /^mai/i,
    /^juun/i,
    /^juul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns24 = {
  narrow: /^[petknrl]/i,
  short: /^[petknrl]/i,
  abbreviated: /^(püh?|esm?|tei?|kolm?|nel?|ree?|laup?)\.?/i,
  wide: /^(pühapäev|esmaspäev|teisipäev|kolmapäev|neljapäev|reede|laupäev)/i
};
var parseDayPatterns24 = {
  any: [/^p/i, /^e/i, /^t/i, /^k/i, /^n/i, /^r/i, /^l/i]
};
var matchDayPeriodPatterns24 = {
  any: /^(am|pm|keskööl?|keskpäev(al)?|hommik(ul)?|pärastlõunal?|õhtul?|öö(sel)?)/i
};
var parseDayPeriodPatterns24 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^keskö/i,
    noon: /^keskp/i,
    morning: /hommik/i,
    afternoon: /pärastlõuna/i,
    evening: /õhtu/i,
    night: /öö/i
  }
};
var match24 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern24,
    parsePattern: parseOrdinalNumberPattern24,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns24,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns24,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns24,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns24,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns24,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns24,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns24,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns24,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns24,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns24,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/eu/_lib/formatLong.js
var dateFormats31 = {
  full: "EEEE, y'ko' MMMM'ren' d'a' y'ren'",
  long: "y'ko' MMMM'ren' d'a'",
  medium: "y MMM d",
  short: "yy/MM/dd"
};
var timeFormats31 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats31 = {
  full: "{{date}} 'tan' {{time}}",
  long: "{{date}} 'tan' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong31 = {
  date: buildFormatLongFn({
    formats: dateFormats31,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats31,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats31,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/eu/_lib/localize.js
var eraValues26 = {
  narrow: ["k.a.", "k.o."],
  abbreviated: ["k.a.", "k.o."],
  wide: ["kristo aurretik", "kristo ondoren"]
};
var quarterValues26 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1H", "2H", "3H", "4H"],
  wide: [
    "1. hiruhilekoa",
    "2. hiruhilekoa",
    "3. hiruhilekoa",
    "4. hiruhilekoa"
  ]
};
var monthValues26 = {
  narrow: ["u", "o", "m", "a", "m", "e", "u", "a", "i", "u", "a", "a"],
  abbreviated: [
    "urt",
    "ots",
    "mar",
    "api",
    "mai",
    "eka",
    "uzt",
    "abu",
    "ira",
    "urr",
    "aza",
    "abe"
  ],
  wide: [
    "urtarrila",
    "otsaila",
    "martxoa",
    "apirila",
    "maiatza",
    "ekaina",
    "uztaila",
    "abuztua",
    "iraila",
    "urria",
    "azaroa",
    "abendua"
  ]
};
var dayValues26 = {
  narrow: ["i", "a", "a", "a", "o", "o", "l"],
  short: ["ig", "al", "as", "az", "og", "or", "lr"],
  abbreviated: ["iga", "ast", "ast", "ast", "ost", "ost", "lar"],
  wide: [
    "igandea",
    "astelehena",
    "asteartea",
    "asteazkena",
    "osteguna",
    "ostirala",
    "larunbata"
  ]
};
var dayPeriodValues26 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "ge",
    noon: "eg",
    morning: "goiza",
    afternoon: "arratsaldea",
    evening: "arratsaldea",
    night: "gaua"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "gauerdia",
    noon: "eguerdia",
    morning: "goiza",
    afternoon: "arratsaldea",
    evening: "arratsaldea",
    night: "gaua"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gauerdia",
    noon: "eguerdia",
    morning: "goiza",
    afternoon: "arratsaldea",
    evening: "arratsaldea",
    night: "gaua"
  }
};
var formattingDayPeriodValues23 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "ge",
    noon: "eg",
    morning: "goizean",
    afternoon: "arratsaldean",
    evening: "arratsaldean",
    night: "gauean"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "gauerdia",
    noon: "eguerdia",
    morning: "goizean",
    afternoon: "arratsaldean",
    evening: "arratsaldean",
    night: "gauean"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gauerdia",
    noon: "eguerdia",
    morning: "goizean",
    afternoon: "arratsaldean",
    evening: "arratsaldean",
    night: "gauean"
  }
};
var ordinalNumber26 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize26 = {
  ordinalNumber: ordinalNumber26,
  era: buildLocalizeFn({
    values: eraValues26,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues26,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues26,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues26,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues26,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues23,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/eu/_lib/match.js
var matchOrdinalNumberPattern25 = /^(\d+)(.)?/i;
var parseOrdinalNumberPattern25 = /\d+/i;
var matchEraPatterns25 = {
  narrow: /^(k.a.|k.o.)/i,
  abbreviated: /^(k.a.|k.o.)/i,
  wide: /^(kristo aurretik|kristo ondoren)/i
};
var parseEraPatterns25 = {
  narrow: [/^k.a./i, /^k.o./i],
  abbreviated: [/^(k.a.)/i, /^(k.o.)/i],
  wide: [/^(kristo aurretik)/i, /^(kristo ondoren)/i]
};
var matchQuarterPatterns25 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]H/i,
  wide: /^[1234](.)? hiruhilekoa/i
};
var parseQuarterPatterns25 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns25 = {
  narrow: /^[uomaei]/i,
  abbreviated: /^(urt|ots|mar|api|mai|eka|uzt|abu|ira|urr|aza|abe)/i,
  wide: /^(urtarrila|otsaila|martxoa|apirila|maiatza|ekaina|uztaila|abuztua|iraila|urria|azaroa|abendua)/i
};
var parseMonthPatterns25 = {
  narrow: [
    /^u/i,
    /^o/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^e/i,
    /^u/i,
    /^a/i,
    /^i/i,
    /^u/i,
    /^a/i,
    /^a/i
  ],
  any: [
    /^urt/i,
    /^ots/i,
    /^mar/i,
    /^api/i,
    /^mai/i,
    /^eka/i,
    /^uzt/i,
    /^abu/i,
    /^ira/i,
    /^urr/i,
    /^aza/i,
    /^abe/i
  ]
};
var matchDayPatterns25 = {
  narrow: /^[iaol]/i,
  short: /^(ig|al|as|az|og|or|lr)/i,
  abbreviated: /^(iga|ast|ast|ast|ost|ost|lar)/i,
  wide: /^(igandea|astelehena|asteartea|asteazkena|osteguna|ostirala|larunbata)/i
};
var parseDayPatterns25 = {
  narrow: [/^i/i, /^a/i, /^a/i, /^a/i, /^o/i, /^o/i, /^l/i],
  short: [/^ig/i, /^al/i, /^as/i, /^az/i, /^og/i, /^or/i, /^lr/i],
  abbreviated: [/^iga/i, /^ast/i, /^ast/i, /^ast/i, /^ost/i, /^ost/i, /^lar/i],
  wide: [
    /^igandea/i,
    /^astelehena/i,
    /^asteartea/i,
    /^asteazkena/i,
    /^osteguna/i,
    /^ostirala/i,
    /^larunbata/i
  ]
};
var matchDayPeriodPatterns25 = {
  narrow: /^(a|p|ge|eg|((goiza|goizean)|arratsaldea|(gaua|gauean)))/i,
  any: /^([ap]\.?\s?m\.?|gauerdia|eguerdia|((goiza|goizean)|arratsaldea|(gaua|gauean)))/i
};
var parseDayPeriodPatterns25 = {
  narrow: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^ge/i,
    noon: /^eg/i,
    morning: /goiz/i,
    afternoon: /arratsaldea/i,
    evening: /arratsaldea/i,
    night: /gau/i
  },
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^gauerdia/i,
    noon: /^eguerdia/i,
    morning: /goiz/i,
    afternoon: /arratsaldea/i,
    evening: /arratsaldea/i,
    night: /gau/i
  }
};
var match25 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern25,
    parsePattern: parseOrdinalNumberPattern25,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns25,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns25,
    defaultParseWidth: "wide"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns25,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns25,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns25,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns25,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns25,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns25,
    defaultParseWidth: "wide"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns25,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns25,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/fa-IR/_lib/formatLong.js
var dateFormats32 = {
  full: "EEEE do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "yyyy/MM/dd"
};
var timeFormats32 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats32 = {
  full: "{{date}} 'در' {{time}}",
  long: "{{date}} 'در' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong32 = {
  date: buildFormatLongFn({
    formats: dateFormats32,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats32,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats32,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fa-IR/_lib/localize.js
var eraValues27 = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل از میلاد", "بعد از میلاد"]
};
var quarterValues27 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["س‌م1", "س‌م2", "س‌م3", "س‌م4"],
  wide: ["سه‌ماهه 1", "سه‌ماهه 2", "سه‌ماهه 3", "سه‌ماهه 4"]
};
var monthValues27 = {
  narrow: ["ژ", "ف", "م", "آ", "م", "ج", "ج", "آ", "س", "ا", "ن", "د"],
  abbreviated: [
    "ژانـ",
    "فور",
    "مارس",
    "آپر",
    "می",
    "جون",
    "جولـ",
    "آگو",
    "سپتـ",
    "اکتـ",
    "نوامـ",
    "دسامـ"
  ],
  wide: [
    "ژانویه",
    "فوریه",
    "مارس",
    "آپریل",
    "می",
    "جون",
    "جولای",
    "آگوست",
    "سپتامبر",
    "اکتبر",
    "نوامبر",
    "دسامبر"
  ]
};
var dayValues27 = {
  narrow: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
  short: ["1ش", "2ش", "3ش", "4ش", "5ش", "ج", "ش"],
  abbreviated: [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه"
  ],
  wide: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"]
};
var dayPeriodValues27 = {
  narrow: {
    am: "ق",
    pm: "ب",
    midnight: "ن",
    noon: "ظ",
    morning: "ص",
    afternoon: "ب.ظ.",
    evening: "ع",
    night: "ش"
  },
  abbreviated: {
    am: "ق.ظ.",
    pm: "ب.ظ.",
    midnight: "نیمه‌شب",
    noon: "ظهر",
    morning: "صبح",
    afternoon: "بعدازظهر",
    evening: "عصر",
    night: "شب"
  },
  wide: {
    am: "قبل‌ازظهر",
    pm: "بعدازظهر",
    midnight: "نیمه‌شب",
    noon: "ظهر",
    morning: "صبح",
    afternoon: "بعدازظهر",
    evening: "عصر",
    night: "شب"
  }
};
var formattingDayPeriodValues24 = {
  narrow: {
    am: "ق",
    pm: "ب",
    midnight: "ن",
    noon: "ظ",
    morning: "ص",
    afternoon: "ب.ظ.",
    evening: "ع",
    night: "ش"
  },
  abbreviated: {
    am: "ق.ظ.",
    pm: "ب.ظ.",
    midnight: "نیمه‌شب",
    noon: "ظهر",
    morning: "صبح",
    afternoon: "بعدازظهر",
    evening: "عصر",
    night: "شب"
  },
  wide: {
    am: "قبل‌ازظهر",
    pm: "بعدازظهر",
    midnight: "نیمه‌شب",
    noon: "ظهر",
    morning: "صبح",
    afternoon: "بعدازظهر",
    evening: "عصر",
    night: "شب"
  }
};
var ordinalNumber27 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize27 = {
  ordinalNumber: ordinalNumber27,
  era: buildLocalizeFn({
    values: eraValues27,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues27,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues27,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues27,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues27,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues24,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/fa-IR/_lib/match.js
var matchOrdinalNumberPattern26 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern26 = /\d+/i;
var matchEraPatterns26 = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?د\.?\s?م\.?|م\.?\s?|د\.?\s?م\.?)/i,
  wide: /^(قبل از میلاد|قبل از دوران مشترک|میلادی|دوران مشترک|بعد از میلاد)/i
};
var parseEraPatterns26 = {
  any: [/^قبل/i, /^بعد/i]
};
var matchQuarterPatterns26 = {
  narrow: /^[1234]/i,
  abbreviated: /^س‌م[1234]/i,
  wide: /^سه‌ماهه [1234]/i
};
var parseQuarterPatterns26 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns26 = {
  narrow: /^[جژفمآاماسند]/i,
  abbreviated: /^(جنو|ژانـ|ژانویه|فوریه|فور|مارس|آوریل|آپر|مه|می|ژوئن|جون|جول|جولـ|ژوئیه|اوت|آگو|سپتمبر|سپتامبر|اکتبر|اکتوبر|نوامبر|نوامـ|دسامبر|دسامـ|دسم)/i,
  wide: /^(ژانویه|جنوری|فبروری|فوریه|مارچ|مارس|آپریل|اپریل|ایپریل|آوریل|مه|می|ژوئن|جون|جولای|ژوئیه|آگست|اگست|آگوست|اوت|سپتمبر|سپتامبر|اکتبر|اکتوبر|نوامبر|نومبر|دسامبر|دسمبر)/i
};
var parseMonthPatterns26 = {
  narrow: [
    /^(ژ|ج)/i,
    /^ف/i,
    /^م/i,
    /^(آ|ا)/i,
    /^م/i,
    /^(ژ|ج)/i,
    /^(ج|ژ)/i,
    /^(آ|ا)/i,
    /^س/i,
    /^ا/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^ژا/i,
    /^ف/i,
    /^ما/i,
    /^آپ/i,
    /^(می|مه)/i,
    /^(ژوئن|جون)/i,
    /^(ژوئی|جول)/i,
    /^(اوت|آگ)/i,
    /^س/i,
    /^(اوک|اک)/i,
    /^ن/i,
    /^د/i
  ]
};
var matchDayPatterns26 = {
  narrow: /^[شیدسچپج]/i,
  short: /^(ش|ج|1ش|2ش|3ش|4ش|5ش)/i,
  abbreviated: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i,
  wide: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i
};
var parseDayPatterns26 = {
  narrow: [/^ی/i, /^دو/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
  any: [
    /^(ی|1ش|یکشنبه)/i,
    /^(د|2ش|دوشنبه)/i,
    /^(س|3ش|سه‌شنبه)/i,
    /^(چ|4ش|چهارشنبه)/i,
    /^(پ|5ش|پنجشنبه)/i,
    /^(ج|جمعه)/i,
    /^(ش|شنبه)/i
  ]
};
var matchDayPeriodPatterns26 = {
  narrow: /^(ب|ق|ن|ظ|ص|ب.ظ.|ع|ش)/i,
  abbreviated: /^(ق.ظ.|ب.ظ.|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i,
  wide: /^(قبل‌ازظهر|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i
};
var parseDayPeriodPatterns26 = {
  any: {
    am: /^(ق|ق.ظ.|قبل‌ازظهر)/i,
    pm: /^(ب|ب.ظ.|بعدازظهر)/i,
    midnight: /^(‌نیمه‌شب|ن)/i,
    noon: /^(ظ|ظهر)/i,
    morning: /(ص|صبح)/i,
    afternoon: /(ب|ب.ظ.|بعدازظهر)/i,
    evening: /(ع|عصر)/i,
    night: /(ش|شب)/i
  }
};
var match26 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern26,
    parsePattern: parseOrdinalNumberPattern26,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns26,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns26,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns26,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns26,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns26,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns26,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns26,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns26,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns26,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns26,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/fi/_lib/formatLong.js
var dateFormats33 = {
  full: "eeee d. MMMM y",
  long: "d. MMMM y",
  medium: "d. MMM y",
  short: "d.M.y"
};
var timeFormats33 = {
  full: "HH.mm.ss zzzz",
  long: "HH.mm.ss z",
  medium: "HH.mm.ss",
  short: "HH.mm"
};
var dateTimeFormats33 = {
  full: "{{date}} 'klo' {{time}}",
  long: "{{date}} 'klo' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong33 = {
  date: buildFormatLongFn({
    formats: dateFormats33,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats33,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats33,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fi/_lib/localize.js
var eraValues28 = {
  narrow: ["eaa.", "jaa."],
  abbreviated: ["eaa.", "jaa."],
  wide: ["ennen ajanlaskun alkua", "jälkeen ajanlaskun alun"]
};
var quarterValues28 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. kvartaali", "2. kvartaali", "3. kvartaali", "4. kvartaali"]
};
var monthValues28 = {
  narrow: ["T", "H", "M", "H", "T", "K", "H", "E", "S", "L", "M", "J"],
  abbreviated: [
    "tammi",
    "helmi",
    "maalis",
    "huhti",
    "touko",
    "kesä",
    "heinä",
    "elo",
    "syys",
    "loka",
    "marras",
    "joulu"
  ],
  wide: [
    "tammikuu",
    "helmikuu",
    "maaliskuu",
    "huhtikuu",
    "toukokuu",
    "kesäkuu",
    "heinäkuu",
    "elokuu",
    "syyskuu",
    "lokakuu",
    "marraskuu",
    "joulukuu"
  ]
};
var formattingMonthValues8 = {
  narrow: monthValues28.narrow,
  abbreviated: monthValues28.abbreviated,
  wide: [
    "tammikuuta",
    "helmikuuta",
    "maaliskuuta",
    "huhtikuuta",
    "toukokuuta",
    "kesäkuuta",
    "heinäkuuta",
    "elokuuta",
    "syyskuuta",
    "lokakuuta",
    "marraskuuta",
    "joulukuuta"
  ]
};
var dayValues28 = {
  narrow: ["S", "M", "T", "K", "T", "P", "L"],
  short: ["su", "ma", "ti", "ke", "to", "pe", "la"],
  abbreviated: ["sunn.", "maan.", "tiis.", "kesk.", "torst.", "perj.", "la"],
  wide: [
    "sunnuntai",
    "maanantai",
    "tiistai",
    "keskiviikko",
    "torstai",
    "perjantai",
    "lauantai"
  ]
};
var formattingDayValues = {
  narrow: dayValues28.narrow,
  short: dayValues28.short,
  abbreviated: dayValues28.abbreviated,
  wide: [
    "sunnuntaina",
    "maanantaina",
    "tiistaina",
    "keskiviikkona",
    "torstaina",
    "perjantaina",
    "lauantaina"
  ]
};
var dayPeriodValues28 = {
  narrow: {
    am: "ap",
    pm: "ip",
    midnight: "keskiyö",
    noon: "keskipäivä",
    morning: "ap",
    afternoon: "ip",
    evening: "illalla",
    night: "yöllä"
  },
  abbreviated: {
    am: "ap",
    pm: "ip",
    midnight: "keskiyö",
    noon: "keskipäivä",
    morning: "ap",
    afternoon: "ip",
    evening: "illalla",
    night: "yöllä"
  },
  wide: {
    am: "ap",
    pm: "ip",
    midnight: "keskiyöllä",
    noon: "keskipäivällä",
    morning: "aamupäivällä",
    afternoon: "iltapäivällä",
    evening: "illalla",
    night: "yöllä"
  }
};
var ordinalNumber28 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize28 = {
  ordinalNumber: ordinalNumber28,
  era: buildLocalizeFn({
    values: eraValues28,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues28,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues28,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues8,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues28,
    defaultWidth: "wide",
    formattingValues: formattingDayValues,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues28,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/fi/_lib/match.js
var matchOrdinalNumberPattern27 = /^(\d+)(\.)/i;
var parseOrdinalNumberPattern27 = /\d+/i;
var matchEraPatterns27 = {
  narrow: /^(e|j)/i,
  abbreviated: /^(eaa.|jaa.)/i,
  wide: /^(ennen ajanlaskun alkua|jälkeen ajanlaskun alun)/i
};
var parseEraPatterns27 = {
  any: [/^e/i, /^j/i]
};
var matchQuarterPatterns27 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234]\.? kvartaali/i
};
var parseQuarterPatterns27 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns27 = {
  narrow: /^[thmkeslj]/i,
  abbreviated: /^(tammi|helmi|maalis|huhti|touko|kesä|heinä|elo|syys|loka|marras|joulu)/i,
  wide: /^(tammikuu|helmikuu|maaliskuu|huhtikuu|toukokuu|kesäkuu|heinäkuu|elokuu|syyskuu|lokakuu|marraskuu|joulukuu)(ta)?/i
};
var parseMonthPatterns27 = {
  narrow: [
    /^t/i,
    /^h/i,
    /^m/i,
    /^h/i,
    /^t/i,
    /^k/i,
    /^h/i,
    /^e/i,
    /^s/i,
    /^l/i,
    /^m/i,
    /^j/i
  ],
  any: [
    /^ta/i,
    /^hel/i,
    /^maa/i,
    /^hu/i,
    /^to/i,
    /^k/i,
    /^hei/i,
    /^e/i,
    /^s/i,
    /^l/i,
    /^mar/i,
    /^j/i
  ]
};
var matchDayPatterns27 = {
  narrow: /^[smtkpl]/i,
  short: /^(su|ma|ti|ke|to|pe|la)/i,
  abbreviated: /^(sunn.|maan.|tiis.|kesk.|torst.|perj.|la)/i,
  wide: /^(sunnuntai|maanantai|tiistai|keskiviikko|torstai|perjantai|lauantai)(na)?/i
};
var parseDayPatterns27 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^k/i, /^t/i, /^p/i, /^l/i],
  any: [/^s/i, /^m/i, /^ti/i, /^k/i, /^to/i, /^p/i, /^l/i]
};
var matchDayPeriodPatterns27 = {
  narrow: /^(ap|ip|keskiyö|keskipäivä|aamupäivällä|iltapäivällä|illalla|yöllä)/i,
  any: /^(ap|ip|keskiyöllä|keskipäivällä|aamupäivällä|iltapäivällä|illalla|yöllä)/i
};
var parseDayPeriodPatterns27 = {
  any: {
    am: /^ap/i,
    pm: /^ip/i,
    midnight: /^keskiyö/i,
    noon: /^keskipäivä/i,
    morning: /aamupäivällä/i,
    afternoon: /iltapäivällä/i,
    evening: /illalla/i,
    night: /yöllä/i
  }
};
var match27 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern27,
    parsePattern: parseOrdinalNumberPattern27,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns27,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns27,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns27,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns27,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns27,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns27,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns27,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns27,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns27,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns27,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/fr/_lib/formatLong.js
var dateFormats34 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats34 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats34 = {
  full: "{{date}} 'à' {{time}}",
  long: "{{date}} 'à' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong34 = {
  date: buildFormatLongFn({
    formats: dateFormats34,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats34,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats34,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fr/_lib/localize.js
var eraValues29 = {
  narrow: ["av. J.-C", "ap. J.-C"],
  abbreviated: ["av. J.-C", "ap. J.-C"],
  wide: ["avant Jésus-Christ", "après Jésus-Christ"]
};
var quarterValues29 = {
  narrow: ["T1", "T2", "T3", "T4"],
  abbreviated: ["1er trim.", "2ème trim.", "3ème trim.", "4ème trim."],
  wide: ["1er trimestre", "2ème trimestre", "3ème trimestre", "4ème trimestre"]
};
var monthValues29 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc."
  ],
  wide: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
  ]
};
var dayValues29 = {
  narrow: ["D", "L", "M", "M", "J", "V", "S"],
  short: ["di", "lu", "ma", "me", "je", "ve", "sa"],
  abbreviated: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  wide: [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi"
  ]
};
var dayPeriodValues29 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "minuit",
    noon: "midi",
    morning: "mat.",
    afternoon: "ap.m.",
    evening: "soir",
    night: "mat."
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "minuit",
    noon: "midi",
    morning: "matin",
    afternoon: "après-midi",
    evening: "soir",
    night: "matin"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "minuit",
    noon: "midi",
    morning: "du matin",
    afternoon: "de l’après-midi",
    evening: "du soir",
    night: "du matin"
  }
};
var ordinalNumber29 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  if (number === 0) return "0";
  const feminineUnits = ["year", "week", "hour", "minute", "second"];
  let suffix;
  if (number === 1) {
    suffix = unit && feminineUnits.includes(unit) ? "ère" : "er";
  } else {
    suffix = "ème";
  }
  return number + suffix;
};
var LONG_MONTHS_TOKENS = ["MMM", "MMMM"];
var localize29 = {
  preprocessor: (date, parts) => {
    if (date.getDate() === 1) return parts;
    const hasLongMonthToken = parts.some(
      (part) => part.isToken && LONG_MONTHS_TOKENS.includes(part.value)
    );
    if (!hasLongMonthToken) return parts;
    return parts.map(
      (part) => part.isToken && part.value === "do" ? { isToken: true, value: "d" } : part
    );
  },
  ordinalNumber: ordinalNumber29,
  era: buildLocalizeFn({
    values: eraValues29,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues29,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues29,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues29,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues29,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/fr/_lib/match.js
var matchOrdinalNumberPattern28 = /^(\d+)(ième|ère|ème|er|e)?/i;
var parseOrdinalNumberPattern28 = /\d+/i;
var matchEraPatterns28 = {
  narrow: /^(av\.J\.C|ap\.J\.C|ap\.J\.-C)/i,
  abbreviated: /^(av\.J\.-C|av\.J-C|apr\.J\.-C|apr\.J-C|ap\.J-C)/i,
  wide: /^(avant Jésus-Christ|après Jésus-Christ)/i
};
var parseEraPatterns28 = {
  any: [/^av/i, /^ap/i]
};
var matchQuarterPatterns28 = {
  narrow: /^T?[1234]/i,
  abbreviated: /^[1234](er|ème|e)? trim\.?/i,
  wide: /^[1234](er|ème|e)? trimestre/i
};
var parseQuarterPatterns28 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns28 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(janv|févr|mars|avr|mai|juin|juill|juil|août|sept|oct|nov|déc)\.?/i,
  wide: /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i
};
var parseMonthPatterns28 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^av/i,
    /^ma/i,
    /^juin/i,
    /^juil/i,
    /^ao/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns28 = {
  narrow: /^[lmjvsd]/i,
  short: /^(di|lu|ma|me|je|ve|sa)/i,
  abbreviated: /^(dim|lun|mar|mer|jeu|ven|sam)\.?/i,
  wide: /^(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/i
};
var parseDayPatterns28 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
  any: [/^di/i, /^lu/i, /^ma/i, /^me/i, /^je/i, /^ve/i, /^sa/i]
};
var matchDayPeriodPatterns28 = {
  narrow: /^(a|p|minuit|midi|mat\.?|ap\.?m\.?|soir|nuit)/i,
  any: /^([ap]\.?\s?m\.?|du matin|de l'après[-\s]midi|du soir|de la nuit)/i
};
var parseDayPeriodPatterns28 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^min/i,
    noon: /^mid/i,
    morning: /mat/i,
    afternoon: /ap/i,
    evening: /soir/i,
    night: /nuit/i
  }
};
var match28 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern28,
    parsePattern: parseOrdinalNumberPattern28,
    valueCallback: (value) => parseInt(value)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns28,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns28,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns28,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns28,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns28,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns28,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns28,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns28,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns28,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns28,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/fr-CA/_lib/formatLong.js
var dateFormats35 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "yy-MM-dd"
};
var timeFormats35 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats35 = {
  full: "{{date}} 'à' {{time}}",
  long: "{{date}} 'à' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong35 = {
  date: buildFormatLongFn({
    formats: dateFormats35,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats35,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats35,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fr-CH/_lib/formatLong.js
var dateFormats36 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd.MM.y"
};
var timeFormats36 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats36 = {
  full: "{{date}} 'à' {{time}}",
  long: "{{date}} 'à' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong36 = {
  date: buildFormatLongFn({
    formats: dateFormats36,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats36,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats36,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fy/_lib/formatLong.js
var dateFormats37 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd-MM-y"
};
var timeFormats37 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats37 = {
  full: "{{date}} 'om' {{time}}",
  long: "{{date}} 'om' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong37 = {
  date: buildFormatLongFn({
    formats: dateFormats37,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats37,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats37,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/fy/_lib/localize.js
var eraValues30 = {
  narrow: ["f.K.", "n.K."],
  abbreviated: ["f.Kr.", "n.Kr."],
  wide: ["foar Kristus", "nei Kristus"]
};
var quarterValues30 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1e fearnsjier", "2e fearnsjier", "3e fearnsjier", "4e fearnsjier"]
};
var monthValues30 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan.",
    "feb.",
    "mrt.",
    "apr.",
    "mai.",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "des."
  ],
  wide: [
    "jannewaris",
    "febrewaris",
    "maart",
    "april",
    "maaie",
    "juny",
    "july",
    "augustus",
    "septimber",
    "oktober",
    "novimber",
    "desimber"
  ]
};
var dayValues30 = {
  narrow: ["s", "m", "t", "w", "t", "f", "s"],
  short: ["si", "mo", "ti", "wo", "to", "fr", "so"],
  abbreviated: ["snein", "moa", "tii", "woa", "ton", "fre", "sneon"],
  wide: [
    "snein",
    "moandei",
    "tiisdei",
    "woansdei",
    "tongersdei",
    "freed",
    "sneon"
  ]
};
var dayPeriodValues30 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "middei",
    morning: "moarns",
    afternoon: "middeis",
    evening: "jûns",
    night: "nachts"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "middei",
    morning: "moarns",
    afternoon: "middeis",
    evening: "jûns",
    night: "nachts"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "middei",
    morning: "moarns",
    afternoon: "middeis",
    evening: "jûns",
    night: "nachts"
  }
};
var ordinalNumber30 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "e";
};
var localize30 = {
  ordinalNumber: ordinalNumber30,
  era: buildLocalizeFn({
    values: eraValues30,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues30,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues30,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues30,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues30,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/fy/_lib/match.js
var matchOrdinalNumberPattern29 = /^(\d+)e?/i;
var parseOrdinalNumberPattern29 = /\d+/i;
var matchEraPatterns29 = {
  narrow: /^([fn]\.? ?K\.?)/,
  abbreviated: /^([fn]\. ?Kr\.?)/,
  wide: /^((foar|nei) Kristus)/
};
var parseEraPatterns29 = {
  any: [/^f/, /^n/]
};
var matchQuarterPatterns29 = {
  narrow: /^[1234]/i,
  abbreviated: /^K[1234]/i,
  wide: /^[1234]e fearnsjier/i
};
var parseQuarterPatterns29 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns29 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan.|feb.|mrt.|apr.|mai.|jun.|jul.|aug.|sep.|okt.|nov.|des.)/i,
  wide: /^(jannewaris|febrewaris|maart|april|maaie|juny|july|augustus|septimber|oktober|novimber|desimber)/i
};
var parseMonthPatterns29 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^jan/i,
    /^feb/i,
    /^m(r|a)/i,
    /^apr/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^aug/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^des/i
  ]
};
var matchDayPatterns29 = {
  narrow: /^[smtwf]/i,
  short: /^(si|mo|ti|wo|to|fr|so)/i,
  abbreviated: /^(snein|moa|tii|woa|ton|fre|sneon)/i,
  wide: /^(snein|moandei|tiisdei|woansdei|tongersdei|freed|sneon)/i
};
var parseDayPatterns29 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^sn/i, /^mo/i, /^ti/i, /^wo/i, /^to/i, /^fr/i, /^sn/i]
};
var matchDayPeriodPatterns29 = {
  any: /^(am|pm|middernacht|middeis|moarns|middei|jûns|nachts)/i
};
var parseDayPeriodPatterns29 = {
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /^middernacht/i,
    noon: /^middei/i,
    morning: /moarns/i,
    afternoon: /^middeis/i,
    evening: /jûns/i,
    night: /nachts/i
  }
};
var match29 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern29,
    parsePattern: parseOrdinalNumberPattern29,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns29,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns29,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns29,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns29,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns29,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns29,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns29,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns29,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns29,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns29,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/gd/_lib/formatLong.js
var dateFormats38 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats38 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats38 = {
  full: "{{date}} 'aig' {{time}}",
  long: "{{date}} 'aig' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong38 = {
  date: buildFormatLongFn({
    formats: dateFormats38,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats38,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats38,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/gd/_lib/localize.js
var eraValues31 = {
  narrow: ["R", "A"],
  abbreviated: ["RC", "AD"],
  wide: ["ro Chrìosta", "anno domini"]
};
var quarterValues31 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["C1", "C2", "C3", "C4"],
  wide: [
    "a' chiad chairteal",
    "an dàrna cairteal",
    "an treas cairteal",
    "an ceathramh cairteal"
  ]
};
var monthValues31 = {
  narrow: ["F", "G", "M", "G", "C", "Ò", "I", "L", "S", "D", "S", "D"],
  abbreviated: [
    "Faoi",
    "Gear",
    "Màrt",
    "Gibl",
    "Cèit",
    "Ògmh",
    "Iuch",
    "Lùn",
    "Sult",
    "Dàmh",
    "Samh",
    "Dùbh"
  ],
  wide: [
    "Am Faoilleach",
    "An Gearran",
    "Am Màrt",
    "An Giblean",
    "An Cèitean",
    "An t-Ògmhios",
    "An t-Iuchar",
    "An Lùnastal",
    "An t-Sultain",
    "An Dàmhair",
    "An t-Samhain",
    "An Dùbhlachd"
  ]
};
var dayValues31 = {
  narrow: ["D", "L", "M", "C", "A", "H", "S"],
  short: ["Dò", "Lu", "Mà", "Ci", "Ar", "Ha", "Sa"],
  abbreviated: ["Did", "Dil", "Dim", "Dic", "Dia", "Dih", "Dis"],
  wide: [
    "Didòmhnaich",
    "Diluain",
    "Dimàirt",
    "Diciadain",
    "Diardaoin",
    "Dihaoine",
    "Disathairne"
  ]
};
var dayPeriodValues31 = {
  narrow: {
    am: "m",
    pm: "f",
    midnight: "m.o.",
    noon: "m.l.",
    morning: "madainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "oidhche"
  },
  abbreviated: {
    am: "M.",
    pm: "F.",
    midnight: "meadhan oidhche",
    noon: "meadhan là",
    morning: "madainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "oidhche"
  },
  wide: {
    am: "m.",
    pm: "f.",
    midnight: "meadhan oidhche",
    noon: "meadhan là",
    morning: "madainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "oidhche"
  }
};
var formattingDayPeriodValues25 = {
  narrow: {
    am: "m",
    pm: "f",
    midnight: "m.o.",
    noon: "m.l.",
    morning: "sa mhadainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "air an oidhche"
  },
  abbreviated: {
    am: "M.",
    pm: "F.",
    midnight: "meadhan oidhche",
    noon: "meadhan là",
    morning: "sa mhadainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "air an oidhche"
  },
  wide: {
    am: "m.",
    pm: "f.",
    midnight: "meadhan oidhche",
    noon: "meadhan là",
    morning: "sa mhadainn",
    afternoon: "feasgar",
    evening: "feasgar",
    night: "air an oidhche"
  }
};
var ordinalNumber31 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "d";
      case 2:
        return number + "na";
    }
  }
  if (rem100 === 12) {
    return number + "na";
  }
  return number + "mh";
};
var localize31 = {
  ordinalNumber: ordinalNumber31,
  era: buildLocalizeFn({
    values: eraValues31,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues31,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues31,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues31,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues31,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues25,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/gd/_lib/match.js
var matchOrdinalNumberPattern30 = /^(\d+)(d|na|tr|mh)?/i;
var parseOrdinalNumberPattern30 = /\d+/i;
var matchEraPatterns30 = {
  narrow: /^(r|a)/i,
  abbreviated: /^(r\.?\s?c\.?|r\.?\s?a\.?\s?c\.?|a\.?\s?d\.?|a\.?\s?c\.?)/i,
  wide: /^(ro Chrìosta|ron aois choitchinn|anno domini|aois choitcheann)/i
};
var parseEraPatterns30 = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns30 = {
  narrow: /^[1234]/i,
  abbreviated: /^c[1234]/i,
  wide: /^[1234](cd|na|tr|mh)? cairteal/i
};
var parseQuarterPatterns30 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns30 = {
  narrow: /^[fgmcòilsd]/i,
  abbreviated: /^(faoi|gear|màrt|gibl|cèit|ògmh|iuch|lùn|sult|dàmh|samh|dùbh)/i,
  wide: /^(am faoilleach|an gearran|am màrt|an giblean|an cèitean|an t-Ògmhios|an t-Iuchar|an lùnastal|an t-Sultain|an dàmhair|an t-Samhain|an dùbhlachd)/i
};
var parseMonthPatterns30 = {
  narrow: [
    /^f/i,
    /^g/i,
    /^m/i,
    /^g/i,
    /^c/i,
    /^ò/i,
    /^i/i,
    /^l/i,
    /^s/i,
    /^d/i,
    /^s/i,
    /^d/i
  ],
  any: [
    /^fa/i,
    /^ge/i,
    /^mà/i,
    /^gi/i,
    /^c/i,
    /^ò/i,
    /^i/i,
    /^l/i,
    /^su/i,
    /^d/i,
    /^sa/i,
    /^d/i
  ]
};
var matchDayPatterns30 = {
  narrow: /^[dlmcahs]/i,
  short: /^(dò|lu|mà|ci|ar|ha|sa)/i,
  abbreviated: /^(did|dil|dim|dic|dia|dih|dis)/i,
  wide: /^(didòmhnaich|diluain|dimàirt|diciadain|diardaoin|dihaoine|disathairne)/i
};
var parseDayPatterns30 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^c/i, /^a/i, /^h/i, /^s/i],
  any: [/^d/i, /^l/i, /^m/i, /^c/i, /^a/i, /^h/i, /^s/i]
};
var matchDayPeriodPatterns30 = {
  narrow: /^(a|p|mi|n|(san|aig) (madainn|feasgar|feasgar|oidhche))/i,
  any: /^([ap]\.?\s?m\.?|meadhan oidhche|meadhan là|(san|aig) (madainn|feasgar|feasgar|oidhche))/i
};
var parseDayPeriodPatterns30 = {
  any: {
    am: /^m/i,
    pm: /^f/i,
    midnight: /^meadhan oidhche/i,
    noon: /^meadhan là/i,
    morning: /sa mhadainn/i,
    afternoon: /feasgar/i,
    evening: /feasgar/i,
    night: /air an oidhche/i
  }
};
var match30 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern30,
    parsePattern: parseOrdinalNumberPattern30,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns30,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns30,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns30,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns30,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns30,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns30,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns30,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns30,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns30,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns30,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/gl/_lib/formatLong.js
var dateFormats39 = {
  full: "EEEE, d 'de' MMMM y",
  long: "d 'de' MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats39 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats39 = {
  full: "{{date}} 'ás' {{time}}",
  long: "{{date}} 'ás' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong39 = {
  date: buildFormatLongFn({
    formats: dateFormats39,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats39,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats39,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/gl/_lib/localize.js
var eraValues32 = {
  narrow: ["AC", "DC"],
  abbreviated: ["AC", "DC"],
  wide: ["antes de cristo", "despois de cristo"]
};
var quarterValues32 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
};
var monthValues32 = {
  narrow: ["e", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "xan",
    "feb",
    "mar",
    "abr",
    "mai",
    "xun",
    "xul",
    "ago",
    "set",
    "out",
    "nov",
    "dec"
  ],
  wide: [
    "xaneiro",
    "febreiro",
    "marzo",
    "abril",
    "maio",
    "xuño",
    "xullo",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "decembro"
  ]
};
var dayValues32 = {
  narrow: ["d", "l", "m", "m", "j", "v", "s"],
  short: ["do", "lu", "ma", "me", "xo", "ve", "sa"],
  abbreviated: ["dom", "lun", "mar", "mer", "xov", "ven", "sab"],
  wide: ["domingo", "luns", "martes", "mércores", "xoves", "venres", "sábado"]
};
var dayPeriodValues32 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "mañá",
    afternoon: "tarde",
    evening: "tarde",
    night: "noite"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "medianoite",
    noon: "mediodía",
    morning: "mañá",
    afternoon: "tarde",
    evening: "tardiña",
    night: "noite"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "medianoite",
    noon: "mediodía",
    morning: "mañá",
    afternoon: "tarde",
    evening: "tardiña",
    night: "noite"
  }
};
var formattingDayPeriodValues26 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "da mañá",
    afternoon: "da tarde",
    evening: "da tardiña",
    night: "da noite"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "medianoite",
    noon: "mediodía",
    morning: "da mañá",
    afternoon: "da tarde",
    evening: "da tardiña",
    night: "da noite"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "medianoite",
    noon: "mediodía",
    morning: "da mañá",
    afternoon: "da tarde",
    evening: "da tardiña",
    night: "da noite"
  }
};
var ordinalNumber32 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "º";
};
var localize32 = {
  ordinalNumber: ordinalNumber32,
  era: buildLocalizeFn({
    values: eraValues32,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues32,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues32,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues32,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues32,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues26,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/gl/_lib/match.js
var matchOrdinalNumberPattern31 = /^(\d+)(º)?/i;
var parseOrdinalNumberPattern31 = /\d+/i;
var matchEraPatterns31 = {
  narrow: /^(ac|dc|a|d)/i,
  abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
  wide: /^(antes de cristo|antes da era com[uú]n|despois de cristo|era com[uú]n)/i
};
var parseEraPatterns31 = {
  any: [/^ac/i, /^dc/i],
  wide: [
    /^(antes de cristo|antes da era com[uú]n)/i,
    /^(despois de cristo|era com[uú]n)/i
  ]
};
var matchQuarterPatterns31 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^[1234](º)? trimestre/i
};
var parseQuarterPatterns31 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns31 = {
  narrow: /^[xfmasond]/i,
  abbreviated: /^(xan|feb|mar|abr|mai|xun|xul|ago|set|out|nov|dec)/i,
  wide: /^(xaneiro|febreiro|marzo|abril|maio|xuño|xullo|agosto|setembro|outubro|novembro|decembro)/i
};
var parseMonthPatterns31 = {
  narrow: [
    /^x/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^x/i,
    /^x/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^xan/i,
    /^feb/i,
    /^mar/i,
    /^abr/i,
    /^mai/i,
    /^xun/i,
    /^xul/i,
    /^ago/i,
    /^set/i,
    /^out/i,
    /^nov/i,
    /^dec/i
  ]
};
var matchDayPatterns31 = {
  narrow: /^[dlmxvs]/i,
  short: /^(do|lu|ma|me|xo|ve|sa)/i,
  abbreviated: /^(dom|lun|mar|mer|xov|ven|sab)/i,
  wide: /^(domingo|luns|martes|m[eé]rcores|xoves|venres|s[áa]bado)/i
};
var parseDayPatterns31 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^x/i, /^v/i, /^s/i],
  any: [/^do/i, /^lu/i, /^ma/i, /^me/i, /^xo/i, /^ve/i, /^sa/i]
};
var matchDayPeriodPatterns31 = {
  narrow: /^(a|p|mn|md|(da|[aá]s) (mañ[aá]|tarde|noite))/i,
  any: /^([ap]\.?\s?m\.?|medianoite|mediod[ií]a|(da|[aá]s) (mañ[aá]|tarde|noite))/i
};
var parseDayPeriodPatterns31 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mn/i,
    noon: /^md/i,
    morning: /mañ[aá]/i,
    afternoon: /tarde/i,
    evening: /tardiña/i,
    night: /noite/i
  }
};
var match31 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern31,
    parsePattern: parseOrdinalNumberPattern31,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns31,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns31,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns31,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns31,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns31,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns31,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns31,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns31,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns31,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns31,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/gu/_lib/formatLong.js
var dateFormats40 = {
  full: "EEEE, d MMMM, y",
  // CLDR #1825
  long: "d MMMM, y",
  // CLDR #1826
  medium: "d MMM, y",
  // CLDR #1827
  short: "d/M/yy"
  // CLDR #1828
};
var timeFormats40 = {
  full: "hh:mm:ss a zzzz",
  // CLDR #1829
  long: "hh:mm:ss a z",
  // CLDR #1830
  medium: "hh:mm:ss a",
  // CLDR #1831
  short: "hh:mm a"
  // CLDR #1832
};
var dateTimeFormats40 = {
  full: "{{date}} {{time}}",
  // CLDR #1833
  long: "{{date}} {{time}}",
  // CLDR #1834
  medium: "{{date}} {{time}}",
  // CLDR #1835
  short: "{{date}} {{time}}"
  // CLDR #1836
};
var formatLong40 = {
  date: buildFormatLongFn({
    formats: dateFormats40,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats40,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats40,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/gu/_lib/localize.js
var eraValues33 = {
  narrow: ["ઈસપૂ", "ઈસ"],
  abbreviated: ["ઈ.સ.પૂર્વે", "ઈ.સ."],
  wide: ["ઈસવીસન પૂર્વે", "ઈસવીસન"]
};
var quarterValues33 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1લો ત્રિમાસ", "2જો ત્રિમાસ", "3જો ત્રિમાસ", "4થો ત્રિમાસ"]
};
var monthValues33 = {
  narrow: ["જા", "ફે", "મા", "એ", "મે", "જૂ", "જુ", "ઓ", "સ", "ઓ", "ન", "ડિ"],
  abbreviated: [
    "જાન્યુ",
    "ફેબ્રુ",
    "માર્ચ",
    "એપ્રિલ",
    "મે",
    "જૂન",
    "જુલાઈ",
    "ઑગસ્ટ",
    "સપ્ટે",
    "ઓક્ટો",
    "નવે",
    "ડિસે"
  ],
  wide: [
    "જાન્યુઆરી",
    "ફેબ્રુઆરી",
    "માર્ચ",
    "એપ્રિલ",
    "મે",
    "જૂન",
    "જુલાઇ",
    "ઓગસ્ટ",
    "સપ્ટેમ્બર",
    "ઓક્ટોબર",
    "નવેમ્બર",
    "ડિસેમ્બર"
  ]
};
var dayValues33 = {
  narrow: ["ર", "સો", "મં", "બુ", "ગુ", "શુ", "શ"],
  short: ["ર", "સો", "મં", "બુ", "ગુ", "શુ", "શ"],
  abbreviated: ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"],
  wide: [
    "રવિવાર",
    "સોમવાર",
    "મંગળવાર",
    "બુધવાર",
    "ગુરુવાર",
    "શુક્રવાર",
    "શનિવાર"
  ]
};
var dayPeriodValues33 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "મ.રાત્રિ",
    noon: "બ.",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "​મધ્યરાત્રિ",
    noon: "બપોરે",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "​મધ્યરાત્રિ",
    noon: "બપોરે",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  }
};
var formattingDayPeriodValues27 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "મ.રાત્રિ",
    noon: "બપોરે",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "મધ્યરાત્રિ",
    noon: "બપોરે",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "​મધ્યરાત્રિ",
    noon: "બપોરે",
    morning: "સવારે",
    afternoon: "બપોરે",
    evening: "સાંજે",
    night: "રાત્રે"
  }
};
var ordinalNumber33 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize33 = {
  ordinalNumber: ordinalNumber33,
  era: buildLocalizeFn({
    values: eraValues33,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues33,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues33,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues33,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues33,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues27,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/gu/_lib/match.js
var matchOrdinalNumberPattern32 = /^(\d+)(લ|જ|થ|ઠ્ઠ|મ)?/i;
var parseOrdinalNumberPattern32 = /\d+/i;
var matchEraPatterns32 = {
  narrow: /^(ઈસપૂ|ઈસ)/i,
  abbreviated: /^(ઈ\.સ\.પૂર્વે|ઈ\.સ\.)/i,
  wide: /^(ઈસવીસન\sપૂર્વે|ઈસવીસન)/i
};
var parseEraPatterns32 = {
  any: [/^ઈસપૂ/i, /^ઈસ/i]
};
var matchQuarterPatterns32 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](લો|જો|થો)? ત્રિમાસ/i
};
var parseQuarterPatterns32 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns32 = {
  // eslint-disable-next-line no-misleading-character-class
  narrow: /^[જાફેમાએમેજૂજુઓસઓનડિ]/i,
  abbreviated: /^(જાન્યુ|ફેબ્રુ|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઈ|ઑગસ્ટ|સપ્ટે|ઓક્ટો|નવે|ડિસે)/i,
  wide: /^(જાન્યુઆરી|ફેબ્રુઆરી|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઇ|ઓગસ્ટ|સપ્ટેમ્બર|ઓક્ટોબર|નવેમ્બર|ડિસેમ્બર)/i
};
var parseMonthPatterns32 = {
  narrow: [
    /^જા/i,
    /^ફે/i,
    /^મા/i,
    /^એ/i,
    /^મે/i,
    /^જૂ/i,
    /^જુ/i,
    /^ઑગ/i,
    /^સ/i,
    /^ઓક્ટો/i,
    /^ન/i,
    /^ડિ/i
  ],
  any: [
    /^જા/i,
    /^ફે/i,
    /^મા/i,
    /^એ/i,
    /^મે/i,
    /^જૂ/i,
    /^જુ/i,
    /^ઑગ/i,
    /^સ/i,
    /^ઓક્ટો/i,
    /^ન/i,
    /^ડિ/i
  ]
};
var matchDayPatterns32 = {
  narrow: /^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,
  short: /^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,
  abbreviated: /^(રવિ|સોમ|મંગળ|બુધ|ગુરુ|શુક્ર|શનિ)/i,
  wide: /^(રવિવાર|સોમવાર|મંગળવાર|બુધવાર|ગુરુવાર|શુક્રવાર|શનિવાર)/i
};
var parseDayPatterns32 = {
  narrow: [/^ર/i, /^સો/i, /^મં/i, /^બુ/i, /^ગુ/i, /^શુ/i, /^શ/i],
  any: [/^ર/i, /^સો/i, /^મં/i, /^બુ/i, /^ગુ/i, /^શુ/i, /^શ/i]
};
var matchDayPeriodPatterns32 = {
  narrow: /^(a|p|મ\.?|સ|બ|સાં|રા)/i,
  any: /^(a|p|મ\.?|સ|બ|સાં|રા)/i
};
var parseDayPeriodPatterns32 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^મ\.?/i,
    noon: /^બ/i,
    morning: /સ/i,
    afternoon: /બ/i,
    evening: /સાં/i,
    night: /રા/i
  }
};
var match32 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern32,
    parsePattern: parseOrdinalNumberPattern32,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns32,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns32,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns32,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns32,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns32,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns32,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns32,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns32,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns32,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns32,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/he/_lib/formatLong.js
var dateFormats41 = {
  full: "EEEE, d בMMMM y",
  long: "d בMMMM y",
  medium: "d בMMM y",
  short: "d.M.y"
};
var timeFormats41 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats41 = {
  full: "{{date}} 'בשעה' {{time}}",
  long: "{{date}} 'בשעה' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong41 = {
  date: buildFormatLongFn({
    formats: dateFormats41,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats41,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats41,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/he/_lib/localize.js
var eraValues34 = {
  narrow: ["לפנה״ס", "לספירה"],
  abbreviated: ["לפנה״ס", "לספירה"],
  wide: ["לפני הספירה", "לספירה"]
};
var quarterValues34 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["רבעון 1", "רבעון 2", "רבעון 3", "רבעון 4"]
};
var monthValues34 = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "ינו׳",
    "פבר׳",
    "מרץ",
    "אפר׳",
    "מאי",
    "יוני",
    "יולי",
    "אוג׳",
    "ספט׳",
    "אוק׳",
    "נוב׳",
    "דצמ׳"
  ],
  wide: [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר"
  ]
};
var dayValues34 = {
  narrow: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  short: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  abbreviated: [
    "יום א׳",
    "יום ב׳",
    "יום ג׳",
    "יום ד׳",
    "יום ה׳",
    "יום ו׳",
    "שבת"
  ],
  wide: [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "יום שבת"
  ]
};
var dayPeriodValues34 = {
  narrow: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בוקר",
    afternoon: "אחר הצהריים",
    evening: "ערב",
    night: "לילה"
  },
  abbreviated: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בוקר",
    afternoon: "אחר הצהריים",
    evening: "ערב",
    night: "לילה"
  },
  wide: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בוקר",
    afternoon: "אחר הצהריים",
    evening: "ערב",
    night: "לילה"
  }
};
var formattingDayPeriodValues28 = {
  narrow: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בבוקר",
    afternoon: "בצהריים",
    evening: "בערב",
    night: "בלילה"
  },
  abbreviated: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בבוקר",
    afternoon: "אחר הצהריים",
    evening: "בערב",
    night: "בלילה"
  },
  wide: {
    am: "לפנה״צ",
    pm: "אחה״צ",
    midnight: "חצות",
    noon: "צהריים",
    morning: "בבוקר",
    afternoon: "אחר הצהריים",
    evening: "בערב",
    night: "בלילה"
  }
};
var ordinalNumber34 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  if (number <= 0 || number > 10) return String(number);
  const unit = String(options == null ? void 0 : options.unit);
  const isFemale = ["year", "hour", "minute", "second"].indexOf(unit) >= 0;
  const male = [
    "ראשון",
    "שני",
    "שלישי",
    "רביעי",
    "חמישי",
    "שישי",
    "שביעי",
    "שמיני",
    "תשיעי",
    "עשירי"
  ];
  const female = [
    "ראשונה",
    "שנייה",
    "שלישית",
    "רביעית",
    "חמישית",
    "שישית",
    "שביעית",
    "שמינית",
    "תשיעית",
    "עשירית"
  ];
  const index = number - 1;
  return isFemale ? female[index] : male[index];
};
var localize34 = {
  ordinalNumber: ordinalNumber34,
  era: buildLocalizeFn({
    values: eraValues34,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues34,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues34,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues34,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues34,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues28,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/he/_lib/match.js
var matchOrdinalNumberPattern33 = /^(\d+|(ראשון|שני|שלישי|רביעי|חמישי|שישי|שביעי|שמיני|תשיעי|עשירי|ראשונה|שנייה|שלישית|רביעית|חמישית|שישית|שביעית|שמינית|תשיעית|עשירית))/i;
var parseOrdinalNumberPattern33 = /^(\d+|רא|שנ|של|רב|ח|שי|שב|שמ|ת|ע)/i;
var matchEraPatterns33 = {
  narrow: /^ל(ספירה|פנה״ס)/i,
  abbreviated: /^ל(ספירה|פנה״ס)/i,
  wide: /^ל(פני ה)?ספירה/i
};
var parseEraPatterns33 = {
  any: [/^לפ/i, /^לס/i]
};
var matchQuarterPatterns33 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^רבעון [1234]/i
};
var parseQuarterPatterns33 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns33 = {
  narrow: /^\d+/i,
  abbreviated: /^(ינו|פבר|מרץ|אפר|מאי|יוני|יולי|אוג|ספט|אוק|נוב|דצמ)׳?/i,
  wide: /^(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/i
};
var parseMonthPatterns33 = {
  narrow: [
    /^1$/i,
    /^2/i,
    /^3/i,
    /^4/i,
    /^5/i,
    /^6/i,
    /^7/i,
    /^8/i,
    /^9/i,
    /^10/i,
    /^11/i,
    /^12/i
  ],
  any: [
    /^ינ/i,
    /^פ/i,
    /^מר/i,
    /^אפ/i,
    /^מא/i,
    /^יונ/i,
    /^יול/i,
    /^אוג/i,
    /^ס/i,
    /^אוק/i,
    /^נ/i,
    /^ד/i
  ]
};
var matchDayPatterns33 = {
  narrow: /^[אבגדהוש]׳/i,
  short: /^[אבגדהוש]׳/i,
  abbreviated: /^(שבת|יום (א|ב|ג|ד|ה|ו)׳)/i,
  wide: /^יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)/i
};
var parseDayPatterns33 = {
  abbreviated: [/א׳$/i, /ב׳$/i, /ג׳$/i, /ד׳$/i, /ה׳$/i, /ו׳$/i, /^ש/i],
  wide: [/ן$/i, /ני$/i, /לישי$/i, /עי$/i, /מישי$/i, /שישי$/i, /ת$/i],
  any: [/^א/i, /^ב/i, /^ג/i, /^ד/i, /^ה/i, /^ו/i, /^ש/i]
};
var matchDayPeriodPatterns33 = {
  any: /^(אחר ה|ב)?(חצות|צהריים|בוקר|ערב|לילה|אחה״צ|לפנה״צ)/i
};
var parseDayPeriodPatterns33 = {
  any: {
    am: /^לפ/i,
    pm: /^אחה/i,
    midnight: /^ח/i,
    noon: /^צ/i,
    morning: /בוקר/i,
    afternoon: /בצ|אחר/i,
    evening: /ערב/i,
    night: /לילה/i
  }
};
var ordinalName = ["רא", "שנ", "של", "רב", "ח", "שי", "שב", "שמ", "ת", "ע"];
var match33 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern33,
    parsePattern: parseOrdinalNumberPattern33,
    valueCallback: (value) => {
      const number = parseInt(value, 10);
      return isNaN(number) ? ordinalName.indexOf(value) + 1 : number;
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns33,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns33,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns33,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns33,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns33,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns33,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns33,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns33,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns33,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns33,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/hi/_lib/localize.js
var numberValues2 = {
  locale: {
    1: "१",
    2: "२",
    3: "३",
    4: "४",
    5: "५",
    6: "६",
    7: "७",
    8: "८",
    9: "९",
    0: "०"
  },
  number: {
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
    "०": "0"
  }
};
var eraValues35 = {
  narrow: ["ईसा-पूर्व", "ईस्वी"],
  abbreviated: ["ईसा-पूर्व", "ईस्वी"],
  wide: ["ईसा-पूर्व", "ईसवी सन"]
};
var quarterValues35 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ति1", "ति2", "ति3", "ति4"],
  wide: ["पहली तिमाही", "दूसरी तिमाही", "तीसरी तिमाही", "चौथी तिमाही"]
};
var monthValues35 = {
  narrow: [
    "ज",
    "फ़",
    "मा",
    "अ",
    "मई",
    "जू",
    "जु",
    "अग",
    "सि",
    "अक्टू",
    "न",
    "दि"
  ],
  abbreviated: [
    "जन",
    "फ़र",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुल",
    "अग",
    "सित",
    "अक्टू",
    "नव",
    "दिस"
  ],
  wide: [
    "जनवरी",
    "फ़रवरी",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अगस्त",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर"
  ]
};
var dayValues35 = {
  narrow: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
  short: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
  abbreviated: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  wide: [
    "रविवार",
    "सोमवार",
    "मंगलवार",
    "बुधवार",
    "गुरुवार",
    "शुक्रवार",
    "शनिवार"
  ]
};
var dayPeriodValues35 = {
  narrow: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  },
  abbreviated: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  },
  wide: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  }
};
var formattingDayPeriodValues29 = {
  narrow: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  },
  abbreviated: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  },
  wide: {
    am: "पूर्वाह्न",
    pm: "अपराह्न",
    midnight: "मध्यरात्रि",
    noon: "दोपहर",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात"
  }
};
var ordinalNumber35 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return numberToLocale2(number);
};
function localeToNumber(locale) {
  const enNumber = locale.toString().replace(/[१२३४५६७८९०]/g, function(match85) {
    return numberValues2.number[match85];
  });
  return Number(enNumber);
}
function numberToLocale2(enNumber) {
  return enNumber.toString().replace(/\d/g, function(match85) {
    return numberValues2.locale[match85];
  });
}
var localize35 = {
  ordinalNumber: ordinalNumber35,
  era: buildLocalizeFn({
    values: eraValues35,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues35,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues35,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues35,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues35,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues29,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/hi/_lib/formatLong.js
var dateFormats42 = {
  full: "EEEE, do MMMM, y",
  // CLDR #1787
  long: "do MMMM, y",
  // CLDR #1788
  medium: "d MMM, y",
  // CLDR #1789
  short: "dd/MM/yyyy"
  // CLDR #1790
};
var timeFormats42 = {
  full: "h:mm:ss a zzzz",
  // CLDR #1791
  long: "h:mm:ss a z",
  // CLDR #1792
  medium: "h:mm:ss a",
  // CLDR #1793
  short: "h:mm a"
  // CLDR #1794
};
var dateTimeFormats42 = {
  full: "{{date}} 'को' {{time}}",
  // CLDR #1795
  long: "{{date}} 'को' {{time}}",
  // CLDR #1796
  medium: "{{date}}, {{time}}",
  // CLDR #1797
  short: "{{date}}, {{time}}"
  // CLDR #1798
};
var formatLong42 = {
  date: buildFormatLongFn({
    formats: dateFormats42,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats42,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats42,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/hi/_lib/match.js
var matchOrdinalNumberPattern34 = /^[०१२३४५६७८९]+/i;
var parseOrdinalNumberPattern34 = /^[०१२३४५६७८९]+/i;
var matchEraPatterns34 = {
  narrow: /^(ईसा-पूर्व|ईस्वी)/i,
  abbreviated: /^(ईसा\.?\s?पूर्व\.?|ईसा\.?)/i,
  wide: /^(ईसा-पूर्व|ईसवी पूर्व|ईसवी सन|ईसवी)/i
};
var parseEraPatterns34 = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns34 = {
  narrow: /^[1234]/i,
  abbreviated: /^ति[1234]/i,
  wide: /^[1234](पहली|दूसरी|तीसरी|चौथी)? तिमाही/i
};
var parseQuarterPatterns34 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns34 = {
  // eslint-disable-next-line no-misleading-character-class
  narrow: /^[जफ़माअप्मईजूनजुअगसिअक्तनदि]/i,
  abbreviated: /^(जन|फ़र|मार्च|अप्|मई|जून|जुल|अग|सित|अक्तू|नव|दिस)/i,
  wide: /^(जनवरी|फ़रवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्तूबर|नवंबर|दिसंबर)/i
};
var parseMonthPatterns34 = {
  narrow: [
    /^ज/i,
    /^फ़/i,
    /^मा/i,
    /^अप्/i,
    /^मई/i,
    /^जू/i,
    /^जु/i,
    /^अग/i,
    /^सि/i,
    /^अक्तू/i,
    /^न/i,
    /^दि/i
  ],
  any: [
    /^जन/i,
    /^फ़/i,
    /^मा/i,
    /^अप्/i,
    /^मई/i,
    /^जू/i,
    /^जु/i,
    /^अग/i,
    /^सि/i,
    /^अक्तू/i,
    /^नव/i,
    /^दिस/i
  ]
};
var matchDayPatterns34 = {
  // eslint-disable-next-line no-misleading-character-class
  narrow: /^[रविसोममंगलबुधगुरुशुक्रशनि]/i,
  short: /^(रवि|सोम|मंगल|बुध|गुरु|शुक्र|शनि)/i,
  abbreviated: /^(रवि|सोम|मंगल|बुध|गुरु|शुक्र|शनि)/i,
  wide: /^(रविवार|सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार)/i
};
var parseDayPatterns34 = {
  narrow: [/^रवि/i, /^सोम/i, /^मंगल/i, /^बुध/i, /^गुरु/i, /^शुक्र/i, /^शनि/i],
  any: [/^रवि/i, /^सोम/i, /^मंगल/i, /^बुध/i, /^गुरु/i, /^शुक्र/i, /^शनि/i]
};
var matchDayPeriodPatterns34 = {
  narrow: /^(पू|अ|म|द.\?|सु|दो|शा|रा)/i,
  any: /^(पूर्वाह्न|अपराह्न|म|द.\?|सु|दो|शा|रा)/i
};
var parseDayPeriodPatterns34 = {
  any: {
    am: /^पूर्वाह्न/i,
    pm: /^अपराह्न/i,
    midnight: /^मध्य/i,
    noon: /^दो/i,
    morning: /सु/i,
    afternoon: /दो/i,
    evening: /शा/i,
    night: /रा/i
  }
};
var match34 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern34,
    parsePattern: parseOrdinalNumberPattern34,
    valueCallback: localeToNumber
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns34,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns34,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns34,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns34,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns34,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns34,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns34,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns34,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns34,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns34,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/hr/_lib/formatLong.js
var dateFormats43 = {
  full: "EEEE, d. MMMM y.",
  long: "d. MMMM y.",
  medium: "d. MMM y.",
  short: "dd. MM. y."
};
var timeFormats43 = {
  full: "HH:mm:ss (zzzz)",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats43 = {
  full: "{{date}} 'u' {{time}}",
  long: "{{date}} 'u' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong43 = {
  date: buildFormatLongFn({
    formats: dateFormats43,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats43,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats43,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/hr/_lib/localize.js
var eraValues36 = {
  narrow: ["pr.n.e.", "AD"],
  abbreviated: ["pr. Kr.", "po. Kr."],
  wide: ["Prije Krista", "Poslije Krista"]
};
var quarterValues36 = {
  narrow: ["1.", "2.", "3.", "4."],
  abbreviated: ["1. kv.", "2. kv.", "3. kv.", "4. kv."],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues36 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "sij",
    "velj",
    "ožu",
    "tra",
    "svi",
    "lip",
    "srp",
    "kol",
    "ruj",
    "lis",
    "stu",
    "pro"
  ],
  wide: [
    "siječanj",
    "veljača",
    "ožujak",
    "travanj",
    "svibanj",
    "lipanj",
    "srpanj",
    "kolovoz",
    "rujan",
    "listopad",
    "studeni",
    "prosinac"
  ]
};
var formattingMonthValues9 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "sij",
    "velj",
    "ožu",
    "tra",
    "svi",
    "lip",
    "srp",
    "kol",
    "ruj",
    "lis",
    "stu",
    "pro"
  ],
  wide: [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenog",
    "prosinca"
  ]
};
var dayValues36 = {
  narrow: ["N", "P", "U", "S", "Č", "P", "S"],
  short: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"],
  abbreviated: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"],
  wide: [
    "nedjelja",
    "ponedjeljak",
    "utorak",
    "srijeda",
    "četvrtak",
    "petak",
    "subota"
  ]
};
var formattingDayPeriodValues30 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "popodne",
    evening: "navečer",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "popodne",
    evening: "navečer",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "poslije podne",
    evening: "navečer",
    night: "noću"
  }
};
var dayPeriodValues36 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "popodne",
    evening: "navečer",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "popodne",
    evening: "navečer",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutro",
    afternoon: "poslije podne",
    evening: "navečer",
    night: "noću"
  }
};
var ordinalNumber36 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize36 = {
  ordinalNumber: ordinalNumber36,
  era: buildLocalizeFn({
    values: eraValues36,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues36,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues36,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues9,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues36,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues36,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues30,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/hr/_lib/match.js
var matchOrdinalNumberPattern35 = /^(\d+)\./i;
var parseOrdinalNumberPattern35 = /\d+/i;
var matchEraPatterns35 = {
  narrow: /^(pr\.n\.e\.|AD)/i,
  abbreviated: /^(pr\.\s?Kr\.|po\.\s?Kr\.)/i,
  wide: /^(Prije Krista|prije nove ere|Poslije Krista|nova era)/i
};
var parseEraPatterns35 = {
  any: [/^pr/i, /^(po|nova)/i]
};
var matchQuarterPatterns35 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\.\s?kv\.?/i,
  wide: /^[1234]\. kvartal/i
};
var parseQuarterPatterns35 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns35 = {
  narrow: /^(10|11|12|[123456789])\./i,
  abbreviated: /^(sij|velj|(ožu|ozu)|tra|svi|lip|srp|kol|ruj|lis|stu|pro)/i,
  wide: /^((siječanj|siječnja|sijecanj|sijecnja)|(veljača|veljače|veljaca|veljace)|(ožujak|ožujka|ozujak|ozujka)|(travanj|travnja)|(svibanj|svibnja)|(lipanj|lipnja)|(srpanj|srpnja)|(kolovoz|kolovoza)|(rujan|rujna)|(listopad|listopada)|(studeni|studenog)|(prosinac|prosinca))/i
};
var parseMonthPatterns35 = {
  narrow: [
    /1/i,
    /2/i,
    /3/i,
    /4/i,
    /5/i,
    /6/i,
    /7/i,
    /8/i,
    /9/i,
    /10/i,
    /11/i,
    /12/i
  ],
  abbreviated: [
    /^sij/i,
    /^velj/i,
    /^(ožu|ozu)/i,
    /^tra/i,
    /^svi/i,
    /^lip/i,
    /^srp/i,
    /^kol/i,
    /^ruj/i,
    /^lis/i,
    /^stu/i,
    /^pro/i
  ],
  wide: [
    /^sij/i,
    /^velj/i,
    /^(ožu|ozu)/i,
    /^tra/i,
    /^svi/i,
    /^lip/i,
    /^srp/i,
    /^kol/i,
    /^ruj/i,
    /^lis/i,
    /^stu/i,
    /^pro/i
  ]
};
var matchDayPatterns35 = {
  narrow: /^[npusčc]/i,
  short: /^(ned|pon|uto|sri|(čet|cet)|pet|sub)/i,
  abbreviated: /^(ned|pon|uto|sri|(čet|cet)|pet|sub)/i,
  wide: /^(nedjelja|ponedjeljak|utorak|srijeda|(četvrtak|cetvrtak)|petak|subota)/i
};
var parseDayPatterns35 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns35 = {
  any: /^(am|pm|ponoc|ponoć|(po)?podne|navecer|navečer|noću|poslije podne|ujutro)/i
};
var parseDayPeriodPatterns35 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^pono/i,
    noon: /^pod/i,
    morning: /jutro/i,
    afternoon: /(poslije\s|po)+podne/i,
    evening: /(navece|naveče)/i,
    night: /(nocu|noću)/i
  }
};
var match35 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern35,
    parsePattern: parseOrdinalNumberPattern35,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns35,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns35,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns35,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns35,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns35,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns35,
    defaultParseWidth: "wide"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns35,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns35,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns35,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns35,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ht/_lib/formatLong.js
var dateFormats44 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats44 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats44 = {
  full: "{{date}} 'nan lè' {{time}}",
  long: "{{date}} 'nan lè' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong44 = {
  date: buildFormatLongFn({
    formats: dateFormats44,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats44,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats44,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ht/_lib/localize.js
var eraValues37 = {
  narrow: ["av. J.-K", "ap. J.-K"],
  abbreviated: ["av. J.-K", "ap. J.-K"],
  wide: ["anvan Jezi Kris", "apre Jezi Kris"]
};
var quarterValues37 = {
  narrow: ["T1", "T2", "T3", "T4"],
  abbreviated: ["1ye trim.", "2yèm trim.", "3yèm trim.", "4yèm trim."],
  wide: ["1ye trimès", "2yèm trimès", "3yèm trimès", "4yèm trimès"]
};
var monthValues37 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "O", "S", "O", "N", "D"],
  abbreviated: [
    "janv.",
    "fevr.",
    "mas",
    "avr.",
    "me",
    "jen",
    "jiyè",
    "out",
    "sept.",
    "okt.",
    "nov.",
    "des."
  ],
  wide: [
    "janvye",
    "fevrye",
    "mas",
    "avril",
    "me",
    "jen",
    "jiyè",
    "out",
    "septanm",
    "oktòb",
    "novanm",
    "desanm"
  ]
};
var dayValues37 = {
  narrow: ["D", "L", "M", "M", "J", "V", "S"],
  short: ["di", "le", "ma", "mè", "je", "va", "sa"],
  abbreviated: ["dim.", "len.", "mad.", "mèk.", "jed.", "van.", "sam."],
  wide: ["dimanch", "lendi", "madi", "mèkredi", "jedi", "vandredi", "samdi"]
};
var dayPeriodValues37 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "minwit",
    noon: "midi",
    morning: "mat.",
    afternoon: "ap.m.",
    evening: "swa",
    night: "mat."
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "minwit",
    noon: "midi",
    morning: "maten",
    afternoon: "aprèmidi",
    evening: "swa",
    night: "maten"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "minwit",
    noon: "midi",
    morning: "nan maten",
    afternoon: "nan aprèmidi",
    evening: "nan aswè",
    night: "nan maten"
  }
};
var ordinalNumber37 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  if (number === 0) return String(number);
  const suffix = number === 1 ? "ye" : "yèm";
  return number + suffix;
};
var localize37 = {
  ordinalNumber: ordinalNumber37,
  era: buildLocalizeFn({
    values: eraValues37,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues37,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues37,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues37,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues37,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/ht/_lib/match.js
var matchOrdinalNumberPattern36 = /^(\d+)(ye|yèm)?/i;
var parseOrdinalNumberPattern36 = /\d+/i;
var matchEraPatterns36 = {
  narrow: /^(av\.J\.K|ap\.J\.K|ap\.J\.-K)/i,
  abbreviated: /^(av\.J\.-K|av\.J-K|apr\.J\.-K|apr\.J-K|ap\.J-K)/i,
  wide: /^(avan Jezi Kris|apre Jezi Kris)/i
};
var parseEraPatterns36 = {
  any: [/^av/i, /^ap/i]
};
var matchQuarterPatterns36 = {
  narrow: /^[1234]/i,
  abbreviated: /^t[1234]/i,
  wide: /^[1234](ye|yèm)? trimès/i
};
var parseQuarterPatterns36 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns36 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(janv|fevr|mas|avr|me|jen|jiyè|out|sept|okt|nov|des)\.?/i,
  wide: /^(janvye|fevrye|mas|avril|me|jen|jiyè|out|septanm|oktòb|novanm|desanm)/i
};
var parseMonthPatterns36 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^o/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^ma/i,
    /^av/i,
    /^me/i,
    /^je/i,
    /^ji/i,
    /^ou/i,
    /^s/i,
    /^ok/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns36 = {
  narrow: /^[lmjvsd]/i,
  short: /^(di|le|ma|me|je|va|sa)/i,
  abbreviated: /^(dim|len|mad|mèk|jed|van|sam)\.?/i,
  wide: /^(dimanch|lendi|madi|mèkredi|jedi|vandredi|samdi)/i
};
var parseDayPatterns36 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
  any: [/^di/i, /^le/i, /^ma/i, /^mè/i, /^je/i, /^va/i, /^sa/i]
};
var matchDayPeriodPatterns36 = {
  narrow: /^(a|p|minwit|midi|mat\.?|ap\.?m\.?|swa)/i,
  any: /^([ap]\.?\s?m\.?|nan maten|nan aprèmidi|nan aswè)/i
};
var parseDayPeriodPatterns36 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^min/i,
    noon: /^mid/i,
    morning: /mat/i,
    afternoon: /ap/i,
    evening: /sw/i,
    night: /nwit/i
  }
};
var match36 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern36,
    parsePattern: parseOrdinalNumberPattern36,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns36,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns36,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns36,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns36,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns36,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns36,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns36,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns36,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns36,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns36,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/hu/_lib/formatLong.js
var dateFormats45 = {
  full: "y. MMMM d., EEEE",
  long: "y. MMMM d.",
  medium: "y. MMM d.",
  short: "y. MM. dd."
};
var timeFormats45 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats45 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong45 = {
  date: buildFormatLongFn({
    formats: dateFormats45,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats45,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats45,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/hu/_lib/formatRelative.js
var accusativeWeekdays = [
  "vasárnap",
  "hétfőn",
  "kedden",
  "szerdán",
  "csütörtökön",
  "pénteken",
  "szombaton"
];
function week(isFuture) {
  return (date) => {
    const weekday = accusativeWeekdays[date.getDay()];
    const prefix = isFuture ? "" : "'múlt' ";
    return `${prefix}'${weekday}' p'-kor'`;
  };
}
var formatRelativeLocale2 = {
  lastWeek: week(false),
  yesterday: "'tegnap' p'-kor'",
  today: "'ma' p'-kor'",
  tomorrow: "'holnap' p'-kor'",
  nextWeek: week(true),
  other: "P"
};

// node_modules/date-fns/locale/hu/_lib/localize.js
var eraValues38 = {
  narrow: ["ie.", "isz."],
  abbreviated: ["i. e.", "i. sz."],
  wide: ["Krisztus előtt", "időszámításunk szerint"]
};
var quarterValues38 = {
  narrow: ["1.", "2.", "3.", "4."],
  abbreviated: ["1. n.év", "2. n.év", "3. n.év", "4. n.év"],
  wide: ["1. negyedév", "2. negyedév", "3. negyedév", "4. negyedév"]
};
var formattingQuarterValues = {
  narrow: ["I.", "II.", "III.", "IV."],
  abbreviated: ["I. n.év", "II. n.év", "III. n.év", "IV. n.év"],
  wide: ["I. negyedév", "II. negyedév", "III. negyedév", "IV. negyedév"]
};
var monthValues38 = {
  narrow: ["J", "F", "M", "Á", "M", "J", "J", "A", "Sz", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "febr.",
    "márc.",
    "ápr.",
    "máj.",
    "jún.",
    "júl.",
    "aug.",
    "szept.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "január",
    "február",
    "március",
    "április",
    "május",
    "június",
    "július",
    "augusztus",
    "szeptember",
    "október",
    "november",
    "december"
  ]
};
var dayValues38 = {
  narrow: ["V", "H", "K", "Sz", "Cs", "P", "Sz"],
  short: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
  abbreviated: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
  wide: [
    "vasárnap",
    "hétfő",
    "kedd",
    "szerda",
    "csütörtök",
    "péntek",
    "szombat"
  ]
};
var dayPeriodValues38 = {
  narrow: {
    am: "de.",
    pm: "du.",
    midnight: "éjfél",
    noon: "dél",
    morning: "reggel",
    afternoon: "du.",
    evening: "este",
    night: "éjjel"
  },
  abbreviated: {
    am: "de.",
    pm: "du.",
    midnight: "éjfél",
    noon: "dél",
    morning: "reggel",
    afternoon: "du.",
    evening: "este",
    night: "éjjel"
  },
  wide: {
    am: "de.",
    pm: "du.",
    midnight: "éjfél",
    noon: "dél",
    morning: "reggel",
    afternoon: "délután",
    evening: "este",
    night: "éjjel"
  }
};
var ordinalNumber38 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize38 = {
  ordinalNumber: ordinalNumber38,
  era: buildLocalizeFn({
    values: eraValues38,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues38,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
    formattingValues: formattingQuarterValues,
    defaultFormattingWidth: "wide"
  }),
  month: buildLocalizeFn({
    values: monthValues38,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues38,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues38,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/hu/_lib/match.js
var matchOrdinalNumberPattern37 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern37 = /\d+/i;
var matchEraPatterns37 = {
  narrow: /^(ie\.|isz\.)/i,
  abbreviated: /^(i\.\s?e\.?|b?\s?c\s?e|i\.\s?sz\.?)/i,
  wide: /^(Krisztus előtt|időszámításunk előtt|időszámításunk szerint|i\. sz\.)/i
};
var parseEraPatterns37 = {
  narrow: [/ie/i, /isz/i],
  abbreviated: [/^(i\.?\s?e\.?|b\s?ce)/i, /^(i\.?\s?sz\.?|c\s?e)/i],
  any: [/előtt/i, /(szerint|i. sz.)/i]
};
var matchQuarterPatterns37 = {
  narrow: /^[1234]\.?/i,
  abbreviated: /^[1234]?\.?\s?n\.év/i,
  wide: /^([1234]|I|II|III|IV)?\.?\s?negyedév/i
};
var parseQuarterPatterns37 = {
  any: [/1|I$/i, /2|II$/i, /3|III/i, /4|IV/i]
};
var matchMonthPatterns37 = {
  narrow: /^[jfmaásond]|sz/i,
  abbreviated: /^(jan\.?|febr\.?|márc\.?|ápr\.?|máj\.?|jún\.?|júl\.?|aug\.?|szept\.?|okt\.?|nov\.?|dec\.?)/i,
  wide: /^(január|február|március|április|május|június|július|augusztus|szeptember|október|november|december)/i
};
var parseMonthPatterns37 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a|á/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s|sz/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^már/i,
    /^áp/i,
    /^máj/i,
    /^jún/i,
    /^júl/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns37 = {
  narrow: /^([vhkpc]|sz|cs|sz)/i,
  short: /^([vhkp]|sze|cs|szo)/i,
  abbreviated: /^([vhkp]|sze|cs|szo)/i,
  wide: /^(vasárnap|hétfő|kedd|szerda|csütörtök|péntek|szombat)/i
};
var parseDayPatterns37 = {
  narrow: [/^v/i, /^h/i, /^k/i, /^sz/i, /^c/i, /^p/i, /^sz/i],
  any: [/^v/i, /^h/i, /^k/i, /^sze/i, /^c/i, /^p/i, /^szo/i]
};
var matchDayPeriodPatterns37 = {
  any: /^((de|du)\.?|éjfél|délután|dél|reggel|este|éjjel)/i
};
var parseDayPeriodPatterns37 = {
  any: {
    am: /^de\.?/i,
    pm: /^du\.?/i,
    midnight: /^éjf/i,
    noon: /^dé/i,
    morning: /reg/i,
    afternoon: /^délu\.?/i,
    evening: /es/i,
    night: /éjj/i
  }
};
var match37 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern37,
    parsePattern: parseOrdinalNumberPattern37,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns37,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns37,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns37,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns37,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns37,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns37,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns37,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns37,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns37,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns37,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/hy/_lib/formatLong.js
var dateFormats46 = {
  full: "d MMMM, y, EEEE",
  long: "d MMMM, y",
  medium: "d MMM, y",
  short: "dd.MM.yyyy"
};
var timeFormats46 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats46 = {
  full: "{{date}} 'ժ․'{{time}}",
  long: "{{date}} 'ժ․'{{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong46 = {
  date: buildFormatLongFn({
    formats: dateFormats46,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats46,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats46,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/hy/_lib/localize.js
var eraValues39 = {
  narrow: ["Ք", "Մ"],
  abbreviated: ["ՔԱ", "ՄԹ"],
  wide: ["Քրիստոսից առաջ", "Մեր թվարկության"]
};
var quarterValues39 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Ք1", "Ք2", "Ք3", "Ք4"],
  wide: ["1֊ին քառորդ", "2֊րդ քառորդ", "3֊րդ քառորդ", "4֊րդ քառորդ"]
};
var monthValues39 = {
  narrow: ["Հ", "Փ", "Մ", "Ա", "Մ", "Հ", "Հ", "Օ", "Ս", "Հ", "Ն", "Դ"],
  abbreviated: [
    "հուն",
    "փետ",
    "մար",
    "ապր",
    "մայ",
    "հուն",
    "հուլ",
    "օգս",
    "սեպ",
    "հոկ",
    "նոյ",
    "դեկ"
  ],
  wide: [
    "հունվար",
    "փետրվար",
    "մարտ",
    "ապրիլ",
    "մայիս",
    "հունիս",
    "հուլիս",
    "օգոստոս",
    "սեպտեմբեր",
    "հոկտեմբեր",
    "նոյեմբեր",
    "դեկտեմբեր"
  ]
};
var dayValues39 = {
  narrow: ["Կ", "Ե", "Ե", "Չ", "Հ", "Ո", "Շ"],
  short: ["կր", "եր", "եք", "չք", "հգ", "ուր", "շբ"],
  abbreviated: ["կիր", "երկ", "երք", "չոր", "հնգ", "ուրբ", "շաբ"],
  wide: [
    "կիրակի",
    "երկուշաբթի",
    "երեքշաբթի",
    "չորեքշաբթի",
    "հինգշաբթի",
    "ուրբաթ",
    "շաբաթ"
  ]
};
var dayPeriodValues39 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "կեսգշ",
    noon: "կեսօր",
    morning: "առավոտ",
    afternoon: "ցերեկ",
    evening: "երեկո",
    night: "գիշեր"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "կեսգիշեր",
    noon: "կեսօր",
    morning: "առավոտ",
    afternoon: "ցերեկ",
    evening: "երեկո",
    night: "գիշեր"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "կեսգիշեր",
    noon: "կեսօր",
    morning: "առավոտ",
    afternoon: "ցերեկ",
    evening: "երեկո",
    night: "գիշեր"
  }
};
var formattingDayPeriodValues31 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "կեսգշ",
    noon: "կեսօր",
    morning: "առավոտը",
    afternoon: "ցերեկը",
    evening: "երեկոյան",
    night: "գիշերը"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "կեսգիշերին",
    noon: "կեսօրին",
    morning: "առավոտը",
    afternoon: "ցերեկը",
    evening: "երեկոյան",
    night: "գիշերը"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "կեսգիշերին",
    noon: "կեսօրին",
    morning: "առավոտը",
    afternoon: "ցերեկը",
    evening: "երեկոյան",
    night: "գիշերը"
  }
};
var ordinalNumber39 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 < 10) {
    if (rem100 % 10 === 1) {
      return number + "֊ին";
    }
  }
  return number + "֊րդ";
};
var localize39 = {
  ordinalNumber: ordinalNumber39,
  era: buildLocalizeFn({
    values: eraValues39,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues39,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues39,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues39,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues39,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues31,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/hy/_lib/match.js
var matchOrdinalNumberPattern38 = /^(\d+)((-|֊)?(ին|րդ))?/i;
var parseOrdinalNumberPattern38 = /\d+/i;
var matchEraPatterns38 = {
  narrow: /^(Ք|Մ)/i,
  abbreviated: /^(Ք\.?\s?Ա\.?|Մ\.?\s?Թ\.?\s?Ա\.?|Մ\.?\s?Թ\.?|Ք\.?\s?Հ\.?)/i,
  wide: /^(քրիստոսից առաջ|մեր թվարկությունից առաջ|մեր թվարկության|քրիստոսից հետո)/i
};
var parseEraPatterns38 = {
  any: [/^ք/i, /^մ/i]
};
var matchQuarterPatterns38 = {
  narrow: /^[1234]/i,
  abbreviated: /^ք[1234]/i,
  wide: /^[1234]((-|֊)?(ին|րդ)) քառորդ/i
};
var parseQuarterPatterns38 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns38 = {
  narrow: /^[հփմաօսնդ]/i,
  abbreviated: /^(հուն|փետ|մար|ապր|մայ|հուն|հուլ|օգս|սեպ|հոկ|նոյ|դեկ)/i,
  wide: /^(հունվար|փետրվար|մարտ|ապրիլ|մայիս|հունիս|հուլիս|օգոստոս|սեպտեմբեր|հոկտեմբեր|նոյեմբեր|դեկտեմբեր)/i
};
var parseMonthPatterns38 = {
  narrow: [
    /^հ/i,
    /^փ/i,
    /^մ/i,
    /^ա/i,
    /^մ/i,
    /^հ/i,
    /^հ/i,
    /^օ/i,
    /^ս/i,
    /^հ/i,
    /^ն/i,
    /^դ/i
  ],
  any: [
    /^հու/i,
    /^փ/i,
    /^մար/i,
    /^ա/i,
    /^մայ/i,
    /^հուն/i,
    /^հուլ/i,
    /^օ/i,
    /^ս/i,
    /^հոկ/i,
    /^ն/i,
    /^դ/i
  ]
};
var matchDayPatterns38 = {
  narrow: /^[եչհոշկ]/i,
  short: /^(կր|եր|եք|չք|հգ|ուր|շբ)/i,
  abbreviated: /^(կիր|երկ|երք|չոր|հնգ|ուրբ|շաբ)/i,
  wide: /^(կիրակի|երկուշաբթի|երեքշաբթի|չորեքշաբթի|հինգշաբթի|ուրբաթ|շաբաթ)/i
};
var parseDayPatterns38 = {
  narrow: [/^կ/i, /^ե/i, /^ե/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
  short: [/^կ/i, /^եր/i, /^եք/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
  abbreviated: [/^կ/i, /^երկ/i, /^երք/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i],
  wide: [/^կ/i, /^երկ/i, /^երե/i, /^չ/i, /^հ/i, /^(ո|Ո)/, /^շ/i]
};
var matchDayPeriodPatterns38 = {
  narrow: /^([ap]|կեսգշ|կեսօր|(առավոտը?|ցերեկը?|երեկո(յան)?|գիշերը?))/i,
  any: /^([ap]\.?\s?m\.?|կեսգիշեր(ին)?|կեսօր(ին)?|(առավոտը?|ցերեկը?|երեկո(յան)?|գիշերը?))/i
};
var parseDayPeriodPatterns38 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /կեսգիշեր/i,
    noon: /կեսօր/i,
    morning: /առավոտ/i,
    afternoon: /ցերեկ/i,
    evening: /երեկո/i,
    night: /գիշեր/i
  }
};
var match38 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern38,
    parsePattern: parseOrdinalNumberPattern38,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns38,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns38,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns38,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns38,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns38,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns38,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns38,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns38,
    defaultParseWidth: "wide"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns38,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns38,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/id/_lib/formatLong.js
var dateFormats47 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "d/M/yyyy"
};
var timeFormats47 = {
  full: "HH.mm.ss",
  long: "HH.mm.ss",
  medium: "HH.mm",
  short: "HH.mm"
};
var dateTimeFormats47 = {
  full: "{{date}} 'pukul' {{time}}",
  long: "{{date}} 'pukul' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong47 = {
  date: buildFormatLongFn({
    formats: dateFormats47,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats47,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats47,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/id/_lib/localize.js
var eraValues40 = {
  narrow: ["SM", "M"],
  abbreviated: ["SM", "M"],
  wide: ["Sebelum Masehi", "Masehi"]
};
var quarterValues40 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"]
};
var monthValues40 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ],
  wide: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ]
};
var dayValues40 = {
  narrow: ["M", "S", "S", "R", "K", "J", "S"],
  short: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  abbreviated: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  wide: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
};
var dayPeriodValues40 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  }
};
var formattingDayPeriodValues32 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "siang",
    evening: "sore",
    night: "malam"
  }
};
var ordinalNumber40 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return "ke-" + number;
};
var localize40 = {
  ordinalNumber: ordinalNumber40,
  era: buildLocalizeFn({
    values: eraValues40,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues40,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues40,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues40,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues40,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues32,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/id/_lib/match.js
var matchOrdinalNumberPattern39 = /^ke-(\d+)?/i;
var parseOrdinalNumberPattern39 = /\d+/i;
var matchEraPatterns39 = {
  narrow: /^(sm|m)/i,
  abbreviated: /^(s\.?\s?m\.?|s\.?\s?e\.?\s?u\.?|m\.?|e\.?\s?u\.?)/i,
  wide: /^(sebelum masehi|sebelum era umum|masehi|era umum)/i
};
var parseEraPatterns39 = {
  any: [/^s/i, /^(m|e)/i]
};
var matchQuarterPatterns39 = {
  narrow: /^[1234]/i,
  abbreviated: /^K-?\s[1234]/i,
  wide: /^Kuartal ke-?\s?[1234]/i
};
var parseQuarterPatterns39 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns39 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|mei|jun|jul|agt|sep|okt|nov|des)/i,
  wide: /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i
};
var parseMonthPatterns39 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^ma/i,
    /^ap/i,
    /^me/i,
    /^jun/i,
    /^jul/i,
    /^ag/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns39 = {
  narrow: /^[srkjm]/i,
  short: /^(min|sen|sel|rab|kam|jum|sab)/i,
  abbreviated: /^(min|sen|sel|rab|kam|jum|sab)/i,
  wide: /^(minggu|senin|selasa|rabu|kamis|jumat|sabtu)/i
};
var parseDayPatterns39 = {
  narrow: [/^m/i, /^s/i, /^s/i, /^r/i, /^k/i, /^j/i, /^s/i],
  any: [/^m/i, /^sen/i, /^sel/i, /^r/i, /^k/i, /^j/i, /^sa/i]
};
var matchDayPeriodPatterns39 = {
  narrow: /^(a|p|tengah m|tengah h|(di(\swaktu)?) (pagi|siang|sore|malam))/i,
  any: /^([ap]\.?\s?m\.?|tengah malam|tengah hari|(di(\swaktu)?) (pagi|siang|sore|malam))/i
};
var parseDayPeriodPatterns39 = {
  any: {
    am: /^a/i,
    pm: /^pm/i,
    midnight: /^tengah m/i,
    noon: /^tengah h/i,
    morning: /pagi/i,
    afternoon: /siang/i,
    evening: /sore/i,
    night: /malam/i
  }
};
var match39 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern39,
    parsePattern: parseOrdinalNumberPattern39,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns39,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns39,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns39,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns39,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns39,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns39,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns39,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns39,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns39,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns39,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/is/_lib/formatLong.js
var dateFormats48 = {
  full: "EEEE, do MMMM y",
  long: "do MMMM y",
  medium: "do MMM y",
  short: "d.MM.y"
};
var timeFormats48 = {
  full: "'kl'. HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats48 = {
  full: "{{date}} 'kl.' {{time}}",
  long: "{{date}} 'kl.' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong48 = {
  date: buildFormatLongFn({
    formats: dateFormats48,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats48,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats48,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/is/_lib/localize.js
var eraValues41 = {
  narrow: ["f.Kr.", "e.Kr."],
  abbreviated: ["f.Kr.", "e.Kr."],
  wide: ["fyrir Krist", "eftir Krist"]
};
var quarterValues41 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1F", "2F", "3F", "4F"],
  wide: ["1. fjórðungur", "2. fjórðungur", "3. fjórðungur", "4. fjórðungur"]
};
var monthValues41 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "Á", "S", "Ó", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mars",
    "apríl",
    "maí",
    "júní",
    "júlí",
    "ágúst",
    "sept.",
    "okt.",
    "nóv.",
    "des."
  ],
  wide: [
    "janúar",
    "febrúar",
    "mars",
    "apríl",
    "maí",
    "júní",
    "júlí",
    "ágúst",
    "september",
    "október",
    "nóvember",
    "desember"
  ]
};
var dayValues41 = {
  narrow: ["S", "M", "Þ", "M", "F", "F", "L"],
  short: ["Su", "Má", "Þr", "Mi", "Fi", "Fö", "La"],
  abbreviated: ["sun.", "mán.", "þri.", "mið.", "fim.", "fös.", "lau."],
  wide: [
    "sunnudagur",
    "mánudagur",
    "þriðjudagur",
    "miðvikudagur",
    "fimmtudagur",
    "föstudagur",
    "laugardagur"
  ]
};
var dayPeriodValues41 = {
  narrow: {
    am: "f",
    pm: "e",
    midnight: "miðnætti",
    noon: "hádegi",
    morning: "morgunn",
    afternoon: "síðdegi",
    evening: "kvöld",
    night: "nótt"
  },
  abbreviated: {
    am: "f.h.",
    pm: "e.h.",
    midnight: "miðnætti",
    noon: "hádegi",
    morning: "morgunn",
    afternoon: "síðdegi",
    evening: "kvöld",
    night: "nótt"
  },
  wide: {
    am: "fyrir hádegi",
    pm: "eftir hádegi",
    midnight: "miðnætti",
    noon: "hádegi",
    morning: "morgunn",
    afternoon: "síðdegi",
    evening: "kvöld",
    night: "nótt"
  }
};
var formattingDayPeriodValues33 = {
  narrow: {
    am: "f",
    pm: "e",
    midnight: "á miðnætti",
    noon: "á hádegi",
    morning: "að morgni",
    afternoon: "síðdegis",
    evening: "um kvöld",
    night: "um nótt"
  },
  abbreviated: {
    am: "f.h.",
    pm: "e.h.",
    midnight: "á miðnætti",
    noon: "á hádegi",
    morning: "að morgni",
    afternoon: "síðdegis",
    evening: "um kvöld",
    night: "um nótt"
  },
  wide: {
    am: "fyrir hádegi",
    pm: "eftir hádegi",
    midnight: "á miðnætti",
    noon: "á hádegi",
    morning: "að morgni",
    afternoon: "síðdegis",
    evening: "um kvöld",
    night: "um nótt"
  }
};
var ordinalNumber41 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize41 = {
  ordinalNumber: ordinalNumber41,
  era: buildLocalizeFn({
    values: eraValues41,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues41,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues41,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues41,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues41,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues33,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/is/_lib/match.js
var matchOrdinalNumberPattern40 = /^(\d+)(\.)?/i;
var parseOrdinalNumberPattern40 = /\d+(\.)?/i;
var matchEraPatterns40 = {
  narrow: /^(f\.Kr\.|e\.Kr\.)/i,
  abbreviated: /^(f\.Kr\.|e\.Kr\.)/i,
  wide: /^(fyrir Krist|eftir Krist)/i
};
var parseEraPatterns40 = {
  any: [/^(f\.Kr\.)/i, /^(e\.Kr\.)/i]
};
var matchQuarterPatterns40 = {
  narrow: /^[1234]\.?/i,
  abbreviated: /^q[1234]\.?/i,
  wide: /^[1234]\.? fjórðungur/i
};
var parseQuarterPatterns40 = {
  any: [/1\.?/i, /2\.?/i, /3\.?/i, /4\.?/i]
};
var matchMonthPatterns40 = {
  narrow: /^[jfmásónd]/i,
  abbreviated: /^(jan\.|feb\.|mars\.|apríl\.|maí|júní|júlí|águst|sep\.|oct\.|nov\.|dec\.)/i,
  wide: /^(januar|febrúar|mars|apríl|maí|júní|júlí|águst|september|október|nóvember|desember)/i
};
var parseMonthPatterns40 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^á/i,
    /^s/i,
    /^ó/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maí/i,
    /^jún/i,
    /^júl/i,
    /^áu/i,
    /^s/i,
    /^ó/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns40 = {
  narrow: /^[smtwf]/i,
  short: /^(su|má|þr|mi|fi|fö|la)/i,
  abbreviated: /^(sun|mán|þri|mið|fim|fös|lau)\.?/i,
  wide: /^(sunnudagur|mánudagur|þriðjudagur|miðvikudagur|fimmtudagur|föstudagur|laugardagur)/i
};
var parseDayPatterns40 = {
  narrow: [/^s/i, /^m/i, /^þ/i, /^m/i, /^f/i, /^f/i, /^l/i],
  any: [/^su/i, /^má/i, /^þr/i, /^mi/i, /^fi/i, /^fö/i, /^la/i]
};
var matchDayPeriodPatterns40 = {
  narrow: /^(f|e|síðdegis|(á|að|um) (morgni|kvöld|nótt|miðnætti))/i,
  any: /^(fyrir hádegi|eftir hádegi|[ef]\.?h\.?|síðdegis|morgunn|(á|að|um) (morgni|kvöld|nótt|miðnætti))/i
};
var parseDayPeriodPatterns40 = {
  any: {
    am: /^f/i,
    pm: /^e/i,
    midnight: /^mi/i,
    noon: /^há/i,
    morning: /morgunn/i,
    afternoon: /síðdegi/i,
    evening: /kvöld/i,
    night: /nótt/i
  }
};
var match40 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern40,
    parsePattern: parseOrdinalNumberPattern40,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns40,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns40,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns40,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns40,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns40,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns40,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns40,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns40,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns40,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns40,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/it/_lib/formatLong.js
var dateFormats49 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats49 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats49 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong49 = {
  date: buildFormatLongFn({
    formats: dateFormats49,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats49,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats49,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/it/_lib/localize.js
var eraValues42 = {
  narrow: ["aC", "dC"],
  abbreviated: ["a.C.", "d.C."],
  wide: ["avanti Cristo", "dopo Cristo"]
};
var quarterValues42 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
};
var monthValues42 = {
  narrow: ["G", "F", "M", "A", "M", "G", "L", "A", "S", "O", "N", "D"],
  abbreviated: [
    "gen",
    "feb",
    "mar",
    "apr",
    "mag",
    "giu",
    "lug",
    "ago",
    "set",
    "ott",
    "nov",
    "dic"
  ],
  wide: [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre"
  ]
};
var dayValues42 = {
  narrow: ["D", "L", "M", "M", "G", "V", "S"],
  short: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
  abbreviated: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
  wide: [
    "domenica",
    "lunedì",
    "martedì",
    "mercoledì",
    "giovedì",
    "venerdì",
    "sabato"
  ]
};
var dayPeriodValues42 = {
  narrow: {
    am: "m.",
    pm: "p.",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "mattina",
    afternoon: "pomeriggio",
    evening: "sera",
    night: "notte"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "mattina",
    afternoon: "pomeriggio",
    evening: "sera",
    night: "notte"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "mattina",
    afternoon: "pomeriggio",
    evening: "sera",
    night: "notte"
  }
};
var formattingDayPeriodValues34 = {
  narrow: {
    am: "m.",
    pm: "p.",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "di mattina",
    afternoon: "del pomeriggio",
    evening: "di sera",
    night: "di notte"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "di mattina",
    afternoon: "del pomeriggio",
    evening: "di sera",
    night: "di notte"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "mezzanotte",
    noon: "mezzogiorno",
    morning: "di mattina",
    afternoon: "del pomeriggio",
    evening: "di sera",
    night: "di notte"
  }
};
var ordinalNumber42 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return String(number);
};
var localize42 = {
  ordinalNumber: ordinalNumber42,
  era: buildLocalizeFn({
    values: eraValues42,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues42,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues42,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues42,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues42,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues34,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/it/_lib/match.js
var matchOrdinalNumberPattern41 = /^(\d+)(º)?/i;
var parseOrdinalNumberPattern41 = /\d+/i;
var matchEraPatterns41 = {
  narrow: /^(aC|dC)/i,
  abbreviated: /^(a\.?\s?C\.?|a\.?\s?e\.?\s?v\.?|d\.?\s?C\.?|e\.?\s?v\.?)/i,
  wide: /^(avanti Cristo|avanti Era Volgare|dopo Cristo|Era Volgare)/i
};
var parseEraPatterns41 = {
  any: [/^a/i, /^(d|e)/i]
};
var matchQuarterPatterns41 = {
  narrow: /^[1234]/i,
  abbreviated: /^t[1234]/i,
  wide: /^[1234](º)? trimestre/i
};
var parseQuarterPatterns41 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns41 = {
  narrow: /^[gfmalsond]/i,
  abbreviated: /^(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)/i,
  wide: /^(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/i
};
var parseMonthPatterns41 = {
  narrow: [
    /^g/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^g/i,
    /^l/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ge/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mag/i,
    /^gi/i,
    /^l/i,
    /^ag/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns41 = {
  narrow: /^[dlmgvs]/i,
  short: /^(do|lu|ma|me|gi|ve|sa)/i,
  abbreviated: /^(dom|lun|mar|mer|gio|ven|sab)/i,
  wide: /^(domenica|luned[i|ì]|marted[i|ì]|mercoled[i|ì]|gioved[i|ì]|venerd[i|ì]|sabato)/i
};
var parseDayPatterns41 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^g/i, /^v/i, /^s/i],
  any: [/^d/i, /^l/i, /^ma/i, /^me/i, /^g/i, /^v/i, /^s/i]
};
var matchDayPeriodPatterns41 = {
  narrow: /^(a|m\.|p|mezzanotte|mezzogiorno|(di|del) (mattina|pomeriggio|sera|notte))/i,
  any: /^([ap]\.?\s?m\.?|mezzanotte|mezzogiorno|(di|del) (mattina|pomeriggio|sera|notte))/i
};
var parseDayPeriodPatterns41 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mezza/i,
    noon: /^mezzo/i,
    morning: /mattina/i,
    afternoon: /pomeriggio/i,
    evening: /sera/i,
    night: /notte/i
  }
};
var match41 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern41,
    parsePattern: parseOrdinalNumberPattern41,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns41,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns41,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns41,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns41,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns41,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns41,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns41,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns41,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns41,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns41,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/it-CH/_lib/formatLong.js
var dateFormats50 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd.MM.y"
};
var timeFormats50 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats50 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong50 = {
  date: buildFormatLongFn({
    formats: dateFormats50,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats50,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats50,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ja/_lib/formatLong.js
var dateFormats51 = {
  full: "y年M月d日EEEE",
  long: "y年M月d日",
  medium: "y/MM/dd",
  short: "y/MM/dd"
};
var timeFormats51 = {
  full: "H時mm分ss秒 zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats51 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong51 = {
  date: buildFormatLongFn({
    formats: dateFormats51,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats51,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats51,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ja/_lib/localize.js
var eraValues43 = {
  narrow: ["BC", "AC"],
  abbreviated: ["紀元前", "西暦"],
  wide: ["紀元前", "西暦"]
};
var quarterValues43 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["第1四半期", "第2四半期", "第3四半期", "第4四半期"]
};
var monthValues43 = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  wide: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ]
};
var dayValues43 = {
  narrow: ["日", "月", "火", "水", "木", "金", "土"],
  short: ["日", "月", "火", "水", "木", "金", "土"],
  abbreviated: ["日", "月", "火", "水", "木", "金", "土"],
  wide: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
};
var dayPeriodValues43 = {
  narrow: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  },
  abbreviated: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  },
  wide: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  }
};
var formattingDayPeriodValues35 = {
  narrow: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  },
  abbreviated: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  },
  wide: {
    am: "午前",
    pm: "午後",
    midnight: "深夜",
    noon: "正午",
    morning: "朝",
    afternoon: "午後",
    evening: "夜",
    night: "深夜"
  }
};
var ordinalNumber43 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = String(options == null ? void 0 : options.unit);
  switch (unit) {
    case "year":
      return `${number}年`;
    case "quarter":
      return `第${number}四半期`;
    case "month":
      return `${number}月`;
    case "week":
      return `第${number}週`;
    case "date":
      return `${number}日`;
    case "hour":
      return `${number}時`;
    case "minute":
      return `${number}分`;
    case "second":
      return `${number}秒`;
    default:
      return `${number}`;
  }
};
var localize43 = {
  ordinalNumber: ordinalNumber43,
  era: buildLocalizeFn({
    values: eraValues43,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues43,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues43,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues43,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues43,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues35,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ja/_lib/match.js
var matchOrdinalNumberPattern42 = /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i;
var parseOrdinalNumberPattern42 = /\d+/i;
var matchEraPatterns42 = {
  narrow: /^(B\.?C\.?|A\.?D\.?)/i,
  abbreviated: /^(紀元[前後]|西暦)/i,
  wide: /^(紀元[前後]|西暦)/i
};
var parseEraPatterns42 = {
  narrow: [/^B/i, /^A/i],
  any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
};
var matchQuarterPatterns42 = {
  narrow: /^[1234]/i,
  abbreviated: /^Q[1234]/i,
  wide: /^第[1234一二三四１２３４]四半期/i
};
var parseQuarterPatterns42 = {
  any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
};
var matchMonthPatterns42 = {
  narrow: /^([123456789]|1[012])/,
  abbreviated: /^([123456789]|1[012])月/i,
  wide: /^([123456789]|1[012])月/i
};
var parseMonthPatterns42 = {
  any: [
    /^1\D/,
    /^2/,
    /^3/,
    /^4/,
    /^5/,
    /^6/,
    /^7/,
    /^8/,
    /^9/,
    /^10/,
    /^11/,
    /^12/
  ]
};
var matchDayPatterns42 = {
  narrow: /^[日月火水木金土]/,
  short: /^[日月火水木金土]/,
  abbreviated: /^[日月火水木金土]/,
  wide: /^[日月火水木金土]曜日/
};
var parseDayPatterns42 = {
  any: [/^日/, /^月/, /^火/, /^水/, /^木/, /^金/, /^土/]
};
var matchDayPeriodPatterns42 = {
  any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i
};
var parseDayPeriodPatterns42 = {
  any: {
    am: /^(A|午前)/i,
    pm: /^(P|午後)/i,
    midnight: /^深夜|真夜中/i,
    noon: /^正午/i,
    morning: /^朝/i,
    afternoon: /^午後/i,
    evening: /^夜/i,
    night: /^深夜/i
  }
};
var match42 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern42,
    parsePattern: parseOrdinalNumberPattern42,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns42,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns42,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns42,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns42,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns42,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns42,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns42,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns42,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns42,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns42,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ja-Hira/_lib/formatLong.js
var dateFormats52 = {
  full: "yねんMがつdにちEEEE",
  long: "yねんMがつdにち",
  medium: "y/MM/dd",
  short: "y/MM/dd"
};
var timeFormats52 = {
  full: "Hじmmふんssびょう zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats52 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong52 = {
  date: buildFormatLongFn({
    formats: dateFormats52,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats52,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats52,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ja-Hira/_lib/localize.js
var eraValues44 = {
  narrow: ["BC", "AC"],
  abbreviated: ["きげんぜん", "せいれき"],
  wide: ["きげんぜん", "せいれき"]
};
var quarterValues44 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["だい1しはんき", "だい2しはんき", "だい3しはんき", "だい4しはんき"]
};
var monthValues44 = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "1がつ",
    "2がつ",
    "3がつ",
    "4がつ",
    "5がつ",
    "6がつ",
    "7がつ",
    "8がつ",
    "9がつ",
    "10がつ",
    "11がつ",
    "12がつ"
  ],
  wide: [
    "1がつ",
    "2がつ",
    "3がつ",
    "4がつ",
    "5がつ",
    "6がつ",
    "7がつ",
    "8がつ",
    "9がつ",
    "10がつ",
    "11がつ",
    "12がつ"
  ]
};
var dayValues44 = {
  narrow: ["にち", "げつ", "か", "すい", "もく", "きん", "ど"],
  short: ["にち", "げつ", "か", "すい", "もく", "きん", "ど"],
  abbreviated: ["にち", "げつ", "か", "すい", "もく", "きん", "ど"],
  wide: [
    "にちようび",
    "げつようび",
    "かようび",
    "すいようび",
    "もくようび",
    "きんようび",
    "どようび"
  ]
};
var dayPeriodValues44 = {
  narrow: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  },
  abbreviated: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  },
  wide: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  }
};
var formattingDayPeriodValues36 = {
  narrow: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  },
  abbreviated: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  },
  wide: {
    am: "ごぜん",
    pm: "ごご",
    midnight: "しんや",
    noon: "しょうご",
    morning: "あさ",
    afternoon: "ごご",
    evening: "よる",
    night: "しんや"
  }
};
var ordinalNumber44 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = String(options == null ? void 0 : options.unit);
  switch (unit) {
    case "year":
      return `${number}ねん`;
    case "quarter":
      return `だい${number}しはんき`;
    case "month":
      return `${number}がつ`;
    case "week":
      return `だい${number}しゅう`;
    case "date":
      return `${number}にち`;
    case "hour":
      return `${number}じ`;
    case "minute":
      return `${number}ふん`;
    case "second":
      return `${number}びょう`;
    default:
      return `${number}`;
  }
};
var localize44 = {
  ordinalNumber: ordinalNumber44,
  era: buildLocalizeFn({
    values: eraValues44,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues44,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues44,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues44,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues44,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues36,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ja-Hira/_lib/match.js
var matchOrdinalNumberPattern43 = /^だ?い?\d+(ねん|しはんき|がつ|しゅう|にち|じ|ふん|びょう)?/i;
var parseOrdinalNumberPattern43 = /\d+/i;
var matchEraPatterns43 = {
  narrow: /^(B\.?C\.?|A\.?D\.?)/i,
  abbreviated: /^(きげん[前後]|せいれき)/i,
  wide: /^(きげん[前後]|せいれき)/i
};
var parseEraPatterns43 = {
  narrow: [/^B/i, /^A/i],
  any: [/^(きげんぜん)/i, /^(せいれき|きげんご)/i]
};
var matchQuarterPatterns43 = {
  narrow: /^[1234]/i,
  abbreviated: /^Q[1234]/i,
  wide: /^だい[1234一二三四１２３４]しはんき/i
};
var parseQuarterPatterns43 = {
  any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
};
var matchMonthPatterns43 = {
  narrow: /^([123456789]|1[012])/,
  abbreviated: /^([123456789]|1[012])がつ/i,
  wide: /^([123456789]|1[012])がつ/i
};
var parseMonthPatterns43 = {
  any: [
    /^1\D/,
    /^2/,
    /^3/,
    /^4/,
    /^5/,
    /^6/,
    /^7/,
    /^8/,
    /^9/,
    /^10/,
    /^11/,
    /^12/
  ]
};
var matchDayPatterns43 = {
  narrow: /^(にち|げつ|か|すい|もく|きん|ど)/,
  short: /^(にち|げつ|か|すい|もく|きん|ど)/,
  abbreviated: /^(にち|げつ|か|すい|もく|きん|ど)/,
  wide: /^(にち|げつ|か|すい|もく|きん|ど)ようび/
};
var parseDayPatterns43 = {
  any: [/^にち/, /^げつ/, /^か/, /^すい/, /^もく/, /^きん/, /^ど/]
};
var matchDayPeriodPatterns43 = {
  any: /^(AM|PM|ごぜん|ごご|しょうご|しんや|まよなか|よる|あさ)/i
};
var parseDayPeriodPatterns43 = {
  any: {
    am: /^(A|ごぜん)/i,
    pm: /^(P|ごご)/i,
    midnight: /^しんや|まよなか/i,
    noon: /^しょうご/i,
    morning: /^あさ/i,
    afternoon: /^ごご/i,
    evening: /^よる/i,
    night: /^しんや/i
  }
};
var match43 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern43,
    parsePattern: parseOrdinalNumberPattern43,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns43,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns43,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns43,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns43,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns43,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns43,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns43,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns43,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns43,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns43,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ka/_lib/formatLong.js
var dateFormats53 = {
  full: "EEEE, do MMMM, y",
  long: "do, MMMM, y",
  medium: "d, MMM, y",
  short: "dd/MM/yyyy"
};
var timeFormats53 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats53 = {
  full: "{{date}} {{time}}'-ზე'",
  long: "{{date}} {{time}}'-ზე'",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong53 = {
  date: buildFormatLongFn({
    formats: dateFormats53,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats53,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats53,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ka/_lib/localize.js
var eraValues45 = {
  narrow: ["ჩ.წ-მდე", "ჩ.წ"],
  abbreviated: ["ჩვ.წ-მდე", "ჩვ.წ"],
  wide: ["ჩვენს წელთაღრიცხვამდე", "ჩვენი წელთაღრიცხვით"]
};
var quarterValues45 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-ლი კვ", "2-ე კვ", "3-ე კვ", "4-ე კვ"],
  wide: ["1-ლი კვარტალი", "2-ე კვარტალი", "3-ე კვარტალი", "4-ე კვარტალი"]
};
var monthValues45 = {
  narrow: [
    "ია",
    "თე",
    "მა",
    "აპ",
    "მს",
    "ვნ",
    "ვლ",
    "აგ",
    "სე",
    "ოქ",
    "ნო",
    "დე"
  ],
  abbreviated: [
    "იან",
    "თებ",
    "მარ",
    "აპრ",
    "მაი",
    "ივნ",
    "ივლ",
    "აგვ",
    "სექ",
    "ოქტ",
    "ნოე",
    "დეკ"
  ],
  wide: [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი"
  ]
};
var dayValues45 = {
  narrow: ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"],
  short: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
  abbreviated: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
  wide: [
    "კვირა",
    "ორშაბათი",
    "სამშაბათი",
    "ოთხშაბათი",
    "ხუთშაბათი",
    "პარასკევი",
    "შაბათი"
  ]
};
var dayPeriodValues45 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "შუაღამე",
    noon: "შუადღე",
    morning: "დილა",
    afternoon: "საღამო",
    evening: "საღამო",
    night: "ღამე"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "შუაღამე",
    noon: "შუადღე",
    morning: "დილა",
    afternoon: "საღამო",
    evening: "საღამო",
    night: "ღამე"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "შუაღამე",
    noon: "შუადღე",
    morning: "დილა",
    afternoon: "საღამო",
    evening: "საღამო",
    night: "ღამე"
  }
};
var formattingDayPeriodValues37 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "შუაღამით",
    noon: "შუადღისას",
    morning: "დილით",
    afternoon: "ნაშუადღევს",
    evening: "საღამოს",
    night: "ღამით"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "შუაღამით",
    noon: "შუადღისას",
    morning: "დილით",
    afternoon: "ნაშუადღევს",
    evening: "საღამოს",
    night: "ღამით"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "შუაღამით",
    noon: "შუადღისას",
    morning: "დილით",
    afternoon: "ნაშუადღევს",
    evening: "საღამოს",
    night: "ღამით"
  }
};
var ordinalNumber45 = (dirtyNumber) => {
  const number = Number(dirtyNumber);
  if (number === 1) {
    return number + "-ლი";
  }
  return number + "-ე";
};
var localize45 = {
  ordinalNumber: ordinalNumber45,
  era: buildLocalizeFn({
    values: eraValues45,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues45,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues45,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues45,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues45,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues37,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ka/_lib/match.js
var matchOrdinalNumberPattern44 = /^(\d+)(-ლი|-ე)?/i;
var parseOrdinalNumberPattern44 = /\d+/i;
var matchEraPatterns44 = {
  narrow: /^(ჩვ?\.წ)/i,
  abbreviated: /^(ჩვ?\.წ)/i,
  wide: /^(ჩვენს წელთაღრიცხვამდე|ქრისტეშობამდე|ჩვენი წელთაღრიცხვით|ქრისტეშობიდან)/i
};
var parseEraPatterns44 = {
  any: [
    /^(ჩვენს წელთაღრიცხვამდე|ქრისტეშობამდე)/i,
    /^(ჩვენი წელთაღრიცხვით|ქრისტეშობიდან)/i
  ]
};
var matchQuarterPatterns44 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]-(ლი|ე)? კვ/i,
  wide: /^[1234]-(ლი|ე)? კვარტალი/i
};
var parseQuarterPatterns44 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns44 = {
  any: /^(ია|თე|მა|აპ|მს|ვნ|ვლ|აგ|სე|ოქ|ნო|დე)/i
};
var parseMonthPatterns44 = {
  any: [
    /^ია/i,
    /^თ/i,
    /^მარ/i,
    /^აპ/i,
    /^მაი/i,
    /^ი?ვნ/i,
    /^ი?ვლ/i,
    /^აგ/i,
    /^ს/i,
    /^ო/i,
    /^ნ/i,
    /^დ/i
  ]
};
var matchDayPatterns44 = {
  narrow: /^(კვ|ორ|სა|ოთ|ხუ|პა|შა)/i,
  short: /^(კვი|ორშ|სამ|ოთხ|ხუთ|პარ|შაბ)/i,
  wide: /^(კვირა|ორშაბათი|სამშაბათი|ოთხშაბათი|ხუთშაბათი|პარასკევი|შაბათი)/i
};
var parseDayPatterns44 = {
  any: [/^კვ/i, /^ორ/i, /^სა/i, /^ოთ/i, /^ხუ/i, /^პა/i, /^შა/i]
};
var matchDayPeriodPatterns44 = {
  any: /^([ap]\.?\s?m\.?|შუაღ|დილ)/i
};
var parseDayPeriodPatterns44 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^შუაღ/i,
    noon: /^შუადღ/i,
    morning: /^დილ/i,
    afternoon: /ნაშუადღევს/i,
    evening: /საღამო/i,
    night: /ღამ/i
  }
};
var match44 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern44,
    parsePattern: parseOrdinalNumberPattern44,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns44,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns44,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns44,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns44,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns44,
    defaultMatchWidth: "any",
    parsePatterns: parseMonthPatterns44,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns44,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns44,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns44,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns44,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/kk/_lib/formatLong.js
var dateFormats54 = {
  full: "EEEE, do MMMM y 'ж.'",
  long: "do MMMM y 'ж.'",
  medium: "d MMM y 'ж.'",
  short: "dd.MM.yyyy"
};
var timeFormats54 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats54 = {
  any: "{{date}}, {{time}}"
};
var formatLong54 = {
  date: buildFormatLongFn({
    formats: dateFormats54,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats54,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats54,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/kk/_lib/localize.js
var eraValues46 = {
  narrow: ["б.з.д.", "б.з."],
  abbreviated: ["б.з.д.", "б.з."],
  wide: ["біздің заманымызға дейін", "біздің заманымыз"]
};
var quarterValues46 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-ші тоқ.", "2-ші тоқ.", "3-ші тоқ.", "4-ші тоқ."],
  wide: ["1-ші тоқсан", "2-ші тоқсан", "3-ші тоқсан", "4-ші тоқсан"]
};
var monthValues46 = {
  narrow: ["Қ", "А", "Н", "С", "М", "М", "Ш", "Т", "Қ", "Қ", "Қ", "Ж"],
  abbreviated: [
    "қаң",
    "ақп",
    "нау",
    "сәу",
    "мам",
    "мау",
    "шіл",
    "там",
    "қыр",
    "қаз",
    "қар",
    "жел"
  ],
  wide: [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан"
  ]
};
var formattingMonthValues10 = {
  narrow: ["Қ", "А", "Н", "С", "М", "М", "Ш", "Т", "Қ", "Қ", "Қ", "Ж"],
  abbreviated: [
    "қаң",
    "ақп",
    "нау",
    "сәу",
    "мам",
    "мау",
    "шіл",
    "там",
    "қыр",
    "қаз",
    "қар",
    "жел"
  ],
  wide: [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан"
  ]
};
var dayValues46 = {
  narrow: ["Ж", "Д", "С", "С", "Б", "Ж", "С"],
  short: ["жс", "дс", "сс", "ср", "бс", "жм", "сб"],
  abbreviated: ["жс", "дс", "сс", "ср", "бс", "жм", "сб"],
  wide: [
    "жексенбі",
    "дүйсенбі",
    "сейсенбі",
    "сәрсенбі",
    "бейсенбі",
    "жұма",
    "сенбі"
  ]
};
var dayPeriodValues46 = {
  narrow: {
    am: "ТД",
    pm: "ТК",
    midnight: "түн ортасы",
    noon: "түс",
    morning: "таң",
    afternoon: "күндіз",
    evening: "кеш",
    night: "түн"
  },
  wide: {
    am: "ТД",
    pm: "ТК",
    midnight: "түн ортасы",
    noon: "түс",
    morning: "таң",
    afternoon: "күндіз",
    evening: "кеш",
    night: "түн"
  }
};
var formattingDayPeriodValues38 = {
  narrow: {
    am: "ТД",
    pm: "ТК",
    midnight: "түн ортасында",
    noon: "түс",
    morning: "таң",
    afternoon: "күн",
    evening: "кеш",
    night: "түн"
  },
  wide: {
    am: "ТД",
    pm: "ТК",
    midnight: "түн ортасында",
    noon: "түсте",
    morning: "таңертең",
    afternoon: "күндіз",
    evening: "кеште",
    night: "түнде"
  }
};
var suffixes2 = {
  0: "-ші",
  1: "-ші",
  2: "-ші",
  3: "-ші",
  4: "-ші",
  5: "-ші",
  6: "-шы",
  7: "-ші",
  8: "-ші",
  9: "-шы",
  10: "-шы",
  20: "-шы",
  30: "-шы",
  40: "-шы",
  50: "-ші",
  60: "-шы",
  70: "-ші",
  80: "-ші",
  90: "-шы",
  100: "-ші"
};
var ordinalNumber46 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const mod10 = number % 10;
  const b = number >= 100 ? 100 : null;
  const suffix = suffixes2[number] || suffixes2[mod10] || b && suffixes2[b] || "";
  return number + suffix;
};
var localize46 = {
  ordinalNumber: ordinalNumber46,
  era: buildLocalizeFn({
    values: eraValues46,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues46,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues46,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues10,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues46,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues46,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues38,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/kk/_lib/match.js
var matchOrdinalNumberPattern45 = /^(\d+)(-?(ші|шы))?/i;
var parseOrdinalNumberPattern45 = /\d+/i;
var matchEraPatterns45 = {
  narrow: /^((б )?з\.?\s?д\.?)/i,
  abbreviated: /^((б )?з\.?\s?д\.?)/i,
  wide: /^(біздің заманымызға дейін|біздің заманымыз|біздің заманымыздан)/i
};
var parseEraPatterns45 = {
  any: [/^б/i, /^з/i]
};
var matchQuarterPatterns45 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?ші)? тоқ.?/i,
  wide: /^[1234](-?ші)? тоқсан/i
};
var parseQuarterPatterns45 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns45 = {
  narrow: /^(қ|а|н|с|м|мау|ш|т|қыр|қаз|қар|ж)/i,
  abbreviated: /^(қаң|ақп|нау|сәу|мам|мау|шіл|там|қыр|қаз|қар|жел)/i,
  wide: /^(қаңтар|ақпан|наурыз|сәуір|мамыр|маусым|шілде|тамыз|қыркүйек|қазан|қараша|желтоқсан)/i
};
var parseMonthPatterns45 = {
  narrow: [
    /^қ/i,
    /^а/i,
    /^н/i,
    /^с/i,
    /^м/i,
    /^м/i,
    /^ш/i,
    /^т/i,
    /^қ/i,
    /^қ/i,
    /^қ/i,
    /^ж/i
  ],
  abbreviated: [
    /^қаң/i,
    /^ақп/i,
    /^нау/i,
    /^сәу/i,
    /^мам/i,
    /^мау/i,
    /^шіл/i,
    /^там/i,
    /^қыр/i,
    /^қаз/i,
    /^қар/i,
    /^жел/i
  ],
  any: [
    /^қ/i,
    /^а/i,
    /^н/i,
    /^с/i,
    /^м/i,
    /^м/i,
    /^ш/i,
    /^т/i,
    /^қ/i,
    /^қ/i,
    /^қ/i,
    /^ж/i
  ]
};
var matchDayPatterns45 = {
  narrow: /^(ж|д|с|с|б|ж|с)/i,
  short: /^(жс|дс|сс|ср|бс|жм|сб)/i,
  wide: /^(жексенбі|дүйсенбі|сейсенбі|сәрсенбі|бейсенбі|жұма|сенбі)/i
};
var parseDayPatterns45 = {
  narrow: [/^ж/i, /^д/i, /^с/i, /^с/i, /^б/i, /^ж/i, /^с/i],
  short: [/^жс/i, /^дс/i, /^сс/i, /^ср/i, /^бс/i, /^жм/i, /^сб/i],
  any: [
    /^ж[ек]/i,
    /^д[үй]/i,
    /^сe[й]/i,
    /^сә[р]/i,
    /^б[ей]/i,
    /^ж[ұм]/i,
    /^се[н]/i
  ]
};
var matchDayPeriodPatterns45 = {
  narrow: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,
  wide: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,
  any: /^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i
};
var parseDayPeriodPatterns45 = {
  any: {
    am: /^ТД/i,
    pm: /^ТК/i,
    midnight: /^түн орта/i,
    noon: /^күндіз/i,
    morning: /таң/i,
    afternoon: /түс/i,
    evening: /кеш/i,
    night: /түн/i
  }
};
var match45 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern45,
    parsePattern: parseOrdinalNumberPattern45,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns45,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns45,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns45,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns45,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns45,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns45,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns45,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns45,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns45,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns45,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/km/_lib/formatLong.js
var dateFormats55 = {
  full: "EEEE do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "dd/MM/yyyy"
};
var timeFormats55 = {
  full: "h:mm:ss a",
  long: "h:mm:ss a",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats55 = {
  full: "{{date}} 'ម៉ោង' {{time}}",
  long: "{{date}} 'ម៉ោង' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong55 = {
  date: buildFormatLongFn({
    formats: dateFormats55,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats55,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats55,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/km/_lib/localize.js
var eraValues47 = {
  narrow: ["ម.គស", "គស"],
  abbreviated: ["មុនគ.ស", "គ.ស"],
  wide: ["មុនគ្រិស្តសករាជ", "នៃគ្រិស្តសករាជ"]
};
var quarterValues47 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["ត្រីមាសទី 1", "ត្រីមាសទី 2", "ត្រីមាសទី 3", "ត្រីមាសទី 4"]
};
var monthValues47 = {
  narrow: [
    "ម.ក",
    "ក.ម",
    "មិ",
    "ម.ស",
    "ឧ.ស",
    "ម.ថ",
    "ក.ដ",
    "សី",
    "កញ",
    "តុ",
    "វិ",
    "ធ"
  ],
  abbreviated: [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ],
  wide: [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ]
};
var dayValues47 = {
  narrow: ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"],
  short: ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"],
  abbreviated: ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"],
  wide: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"]
};
var dayPeriodValues47 = {
  narrow: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  },
  abbreviated: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  },
  wide: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  }
};
var formattingDayPeriodValues39 = {
  narrow: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  },
  abbreviated: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  },
  wide: {
    am: "ព្រឹក",
    pm: "ល្ងាច",
    midnight: "​ពេលកណ្ដាលអធ្រាត្រ",
    noon: "ពេលថ្ងៃត្រង់",
    morning: "ពេលព្រឹក",
    afternoon: "ពេលរសៀល",
    evening: "ពេលល្ងាច",
    night: "ពេលយប់"
  }
};
var ordinalNumber47 = (dirtyNumber, _) => {
  const number = Number(dirtyNumber);
  return number.toString();
};
var localize47 = {
  ordinalNumber: ordinalNumber47,
  era: buildLocalizeFn({
    values: eraValues47,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues47,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues47,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues47,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues47,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues39,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/km/_lib/match.js
var matchOrdinalNumberPattern46 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern46 = /\d+/i;
var matchEraPatterns46 = {
  narrow: /^(ម\.)?គស/i,
  abbreviated: /^(មុន)?គ\.ស/i,
  wide: /^(មុន|នៃ)គ្រិស្តសករាជ/i
};
var parseEraPatterns46 = {
  any: [/^(ម|មុន)គ\.?ស/i, /^(នៃ)?គ\.?ស/i]
};
var matchQuarterPatterns46 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^(ត្រីមាស)(ទី)?\s?[1234]/i
};
var parseQuarterPatterns46 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns46 = {
  narrow: /^(ម\.ក|ក\.ម|មិ|ម\.ស|ឧ\.ស|ម\.ថ|ក\.ដ|សី|កញ|តុ|វិ|ធ)/i,
  abbreviated: /^(មករា|កុម្ភៈ|មីនា|មេសា|ឧសភា|មិថុនា|កក្កដា|សីហា|កញ្ញា|តុលា|វិច្ឆិកា|ធ្នូ)/i,
  wide: /^(មករា|កុម្ភៈ|មីនា|មេសា|ឧសភា|មិថុនា|កក្កដា|សីហា|កញ្ញា|តុលា|វិច្ឆិកា|ធ្នូ)/i
};
var parseMonthPatterns46 = {
  narrow: [
    /^ម\.ក/i,
    /^ក\.ម/i,
    /^មិ/i,
    /^ម\.ស/i,
    /^ឧ\.ស/i,
    /^ម\.ថ/i,
    /^ក\.ដ/i,
    /^សី/i,
    /^កញ/i,
    /^តុ/i,
    /^វិ/i,
    /^ធ/i
  ],
  any: [
    /^មក/i,
    /^កុ/i,
    /^មីន/i,
    /^មេ/i,
    /^ឧស/i,
    /^មិថ/i,
    /^កក/i,
    /^សី/i,
    /^កញ/i,
    /^តុ/i,
    /^វិច/i,
    /^ធ/i
  ]
};
var matchDayPatterns46 = {
  narrow: /^(អា|ច|អ|ព|ព្រ|សុ|ស)/i,
  short: /^(អា|ច|អ|ព|ព្រ|សុ|ស)/i,
  abbreviated: /^(អា|ច|អ|ព|ព្រ|សុ|ស)/i,
  wide: /^(អាទិត្យ|ចន្ទ|អង្គារ|ពុធ|ព្រហស្បតិ៍|សុក្រ|សៅរ៍)/i
};
var parseDayPatterns46 = {
  narrow: [/^អា/i, /^ច/i, /^អ/i, /^ព/i, /^ព្រ/i, /^សុ/i, /^ស/i],
  any: [/^អា/i, /^ច/i, /^អ/i, /^ព/i, /^ព្រ/i, /^សុ/i, /^សៅ/i]
};
var matchDayPeriodPatterns46 = {
  narrow: /^(ព្រឹក|ល្ងាច|ពេលព្រឹក|ពេលថ្ងៃត្រង់|ពេលល្ងាច|ពេលរសៀល|ពេលយប់|ពេលកណ្ដាលអធ្រាត្រ)/i,
  any: /^(ព្រឹក|ល្ងាច|ពេលព្រឹក|ពេលថ្ងៃត្រង់|ពេលល្ងាច|ពេលរសៀល|ពេលយប់|ពេលកណ្ដាលអធ្រាត្រ)/i
};
var parseDayPeriodPatterns46 = {
  any: {
    am: /^ព្រឹក/i,
    pm: /^ល្ងាច/i,
    midnight: /^ពេលកណ្ដាលអធ្រាត្រ/i,
    noon: /^ពេលថ្ងៃត្រង់/i,
    morning: /ពេលព្រឹក/i,
    afternoon: /ពេលរសៀល/i,
    evening: /ពេលល្ងាច/i,
    night: /ពេលយប់/i
  }
};
var match46 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern46,
    parsePattern: parseOrdinalNumberPattern46,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns46,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns46,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns46,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns46,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns46,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns46,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns46,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns46,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns46,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns46,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/kn/_lib/formatLong.js
var dateFormats56 = {
  full: "EEEE, MMMM d, y",
  // CLDR 1816
  long: "MMMM d, y",
  // CLDR 1817
  medium: "MMM d, y",
  // CLDR 1818
  short: "d/M/yy"
  // CLDR 1819
};
var timeFormats56 = {
  full: "hh:mm:ss a zzzz",
  // CLDR 1820
  long: "hh:mm:ss a z",
  // CLDR 1821
  medium: "hh:mm:ss a",
  // CLDR 1822
  short: "hh:mm a"
  // CLDR 1823
};
var dateTimeFormats56 = {
  full: "{{date}} {{time}}",
  // CLDR 1824
  long: "{{date}} {{time}}",
  // CLDR 1825
  medium: "{{date}} {{time}}",
  // CLDR 1826
  short: "{{date}} {{time}}"
  // CLDR 1827
};
var formatLong56 = {
  date: buildFormatLongFn({
    formats: dateFormats56,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats56,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats56,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/kn/_lib/localize.js
var eraValues48 = {
  narrow: ["ಕ್ರಿ.ಪೂ", "ಕ್ರಿ.ಶ"],
  abbreviated: ["ಕ್ರಿ.ಪೂ", "ಕ್ರಿ.ಶ"],
  // CLDR #1618, #1620
  wide: ["ಕ್ರಿಸ್ತ ಪೂರ್ವ", "ಕ್ರಿಸ್ತ ಶಕ"]
  // CLDR #1614, #1616
};
var quarterValues48 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ತ್ರೈ 1", "ತ್ರೈ 2", "ತ್ರೈ 3", "ತ್ರೈ 4"],
  // CLDR #1630 - #1638
  wide: ["1ನೇ ತ್ರೈಮಾಸಿಕ", "2ನೇ ತ್ರೈಮಾಸಿಕ", "3ನೇ ತ್ರೈಮಾಸಿಕ", "4ನೇ ತ್ರೈಮಾಸಿಕ"]
  // CLDR #1622 - #1629
};
var monthValues48 = {
  narrow: ["ಜ", "ಫೆ", "ಮಾ", "ಏ", "ಮೇ", "ಜೂ", "ಜು", "ಆ", "ಸೆ", "ಅ", "ನ", "ಡಿ"],
  abbreviated: [
    "ಜನ",
    "ಫೆಬ್ರ",
    "ಮಾರ್ಚ್",
    "ಏಪ್ರಿ",
    "ಮೇ",
    "ಜೂನ್",
    "ಜುಲೈ",
    "ಆಗ",
    "ಸೆಪ್ಟೆಂ",
    "ಅಕ್ಟೋ",
    "ನವೆಂ",
    "ಡಿಸೆಂ"
  ],
  wide: [
    "ಜನವರಿ",
    "ಫೆಬ್ರವರಿ",
    "ಮಾರ್ಚ್",
    "ಏಪ್ರಿಲ್",
    "ಮೇ",
    "ಜೂನ್",
    "ಜುಲೈ",
    "ಆಗಸ್ಟ್",
    "ಸೆಪ್ಟೆಂಬರ್",
    "ಅಕ್ಟೋಬರ್",
    "ನವೆಂಬರ್",
    "ಡಿಸೆಂಬರ್"
  ]
};
var dayValues48 = {
  narrow: ["ಭಾ", "ಸೋ", "ಮಂ", "ಬು", "ಗು", "ಶು", "ಶ"],
  short: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
  abbreviated: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
  wide: [
    "ಭಾನುವಾರ",
    "ಸೋಮವಾರ",
    "ಮಂಗಳವಾರ",
    "ಬುಧವಾರ",
    "ಗುರುವಾರ",
    "ಶುಕ್ರವಾರ",
    "ಶನಿವಾರ"
  ]
};
var dayPeriodValues48 = {
  narrow: {
    am: "ಪೂರ್ವಾಹ್ನ",
    pm: "ಅಪರಾಹ್ನ",
    midnight: "ಮಧ್ಯರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾಹ್ನ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾಹ್ನ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  },
  abbreviated: {
    am: "ಪೂರ್ವಾಹ್ನ",
    pm: "ಅಪರಾಹ್ನ",
    midnight: "ಮಧ್ಯರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾನ್ಹ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾನ್ಹ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  },
  wide: {
    am: "ಪೂರ್ವಾಹ್ನ",
    pm: "ಅಪರಾಹ್ನ",
    midnight: "ಮಧ್ಯರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾನ್ಹ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾನ್ಹ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  }
};
var formattingDayPeriodValues40 = {
  narrow: {
    am: "ಪೂ",
    pm: "ಅ",
    midnight: "ಮಧ್ಯರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾನ್ಹ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾನ್ಹ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  },
  abbreviated: {
    am: "ಪೂರ್ವಾಹ್ನ",
    pm: "ಅಪರಾಹ್ನ",
    midnight: "ಮಧ್ಯ ರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾನ್ಹ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾನ್ಹ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  },
  wide: {
    am: "ಪೂರ್ವಾಹ್ನ",
    pm: "ಅಪರಾಹ್ನ",
    midnight: "ಮಧ್ಯ ರಾತ್ರಿ",
    noon: "ಮಧ್ಯಾನ್ಹ",
    morning: "ಬೆಳಗ್ಗೆ",
    afternoon: "ಮಧ್ಯಾನ್ಹ",
    evening: "ಸಂಜೆ",
    night: "ರಾತ್ರಿ"
  }
};
var ordinalNumber48 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "ನೇ";
};
var localize48 = {
  ordinalNumber: ordinalNumber48,
  era: buildLocalizeFn({
    values: eraValues48,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues48,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues48,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues48,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues48,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues40,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/kn/_lib/match.js
var matchOrdinalNumberPattern47 = /^(\d+)(ನೇ|ನೆ)?/i;
var parseOrdinalNumberPattern47 = /\d+/i;
var matchEraPatterns47 = {
  narrow: /^(ಕ್ರಿ.ಪೂ|ಕ್ರಿ.ಶ)/i,
  abbreviated: /^(ಕ್ರಿ\.?\s?ಪೂ\.?|ಕ್ರಿ\.?\s?ಶ\.?|ಪ್ರ\.?\s?ಶ\.?)/i,
  wide: /^(ಕ್ರಿಸ್ತ ಪೂರ್ವ|ಕ್ರಿಸ್ತ ಶಕ|ಪ್ರಸಕ್ತ ಶಕ)/i
};
var parseEraPatterns47 = {
  any: [/^ಪೂ/i, /^(ಶ|ಪ್ರ)/i]
};
var matchQuarterPatterns47 = {
  narrow: /^[1234]/i,
  abbreviated: /^ತ್ರೈ[1234]|ತ್ರೈ [1234]| [1234]ತ್ರೈ/i,
  wide: /^[1234](ನೇ)? ತ್ರೈಮಾಸಿಕ/i
};
var parseQuarterPatterns47 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns47 = {
  narrow: /^(ಜೂ|ಜು|ಜ|ಫೆ|ಮಾ|ಏ|ಮೇ|ಆ|ಸೆ|ಅ|ನ|ಡಿ)/i,
  abbreviated: /^(ಜನ|ಫೆಬ್ರ|ಮಾರ್ಚ್|ಏಪ್ರಿ|ಮೇ|ಜೂನ್|ಜುಲೈ|ಆಗ|ಸೆಪ್ಟೆಂ|ಅಕ್ಟೋ|ನವೆಂ|ಡಿಸೆಂ)/i,
  wide: /^(ಜನವರಿ|ಫೆಬ್ರವರಿ|ಮಾರ್ಚ್|ಏಪ್ರಿಲ್|ಮೇ|ಜೂನ್|ಜುಲೈ|ಆಗಸ್ಟ್|ಸೆಪ್ಟೆಂಬರ್|ಅಕ್ಟೋಬರ್|ನವೆಂಬರ್|ಡಿಸೆಂಬರ್)/i
};
var parseMonthPatterns47 = {
  narrow: [
    /^ಜ$/i,
    /^ಫೆ/i,
    /^ಮಾ/i,
    /^ಏ/i,
    /^ಮೇ/i,
    /^ಜೂ/i,
    /^ಜು$/i,
    /^ಆ/i,
    /^ಸೆ/i,
    /^ಅ/i,
    /^ನ/i,
    /^ಡಿ/i
  ],
  any: [
    /^ಜನ/i,
    /^ಫೆ/i,
    /^ಮಾ/i,
    /^ಏ/i,
    /^ಮೇ/i,
    /^ಜೂನ್/i,
    /^ಜುಲೈ/i,
    /^ಆ/i,
    /^ಸೆ/i,
    /^ಅ/i,
    /^ನ/i,
    /^ಡಿ/i
  ]
};
var matchDayPatterns47 = {
  narrow: /^(ಭಾ|ಸೋ|ಮ|ಬು|ಗು|ಶು|ಶ)/i,
  short: /^(ಭಾನು|ಸೋಮ|ಮಂಗಳ|ಬುಧ|ಗುರು|ಶುಕ್ರ|ಶನಿ)/i,
  abbreviated: /^(ಭಾನು|ಸೋಮ|ಮಂಗಳ|ಬುಧ|ಗುರು|ಶುಕ್ರ|ಶನಿ)/i,
  wide: /^(ಭಾನುವಾರ|ಸೋಮವಾರ|ಮಂಗಳವಾರ|ಬುಧವಾರ|ಗುರುವಾರ|ಶುಕ್ರವಾರ|ಶನಿವಾರ)/i
};
var parseDayPatterns47 = {
  narrow: [/^ಭಾ/i, /^ಸೋ/i, /^ಮ/i, /^ಬು/i, /^ಗು/i, /^ಶು/i, /^ಶ/i],
  any: [/^ಭಾ/i, /^ಸೋ/i, /^ಮ/i, /^ಬು/i, /^ಗು/i, /^ಶು/i, /^ಶ/i]
};
var matchDayPeriodPatterns47 = {
  narrow: /^(ಪೂ|ಅ|ಮಧ್ಯರಾತ್ರಿ|ಮಧ್ಯಾನ್ಹ|ಬೆಳಗ್ಗೆ|ಸಂಜೆ|ರಾತ್ರಿ)/i,
  any: /^(ಪೂರ್ವಾಹ್ನ|ಅಪರಾಹ್ನ|ಮಧ್ಯರಾತ್ರಿ|ಮಧ್ಯಾನ್ಹ|ಬೆಳಗ್ಗೆ|ಸಂಜೆ|ರಾತ್ರಿ)/i
};
var parseDayPeriodPatterns47 = {
  any: {
    am: /^ಪೂ/i,
    pm: /^ಅ/i,
    midnight: /ಮಧ್ಯರಾತ್ರಿ/i,
    noon: /ಮಧ್ಯಾನ್ಹ/i,
    morning: /ಬೆಳಗ್ಗೆ/i,
    afternoon: /ಮಧ್ಯಾನ್ಹ/i,
    evening: /ಸಂಜೆ/i,
    night: /ರಾತ್ರಿ/i
  }
};
var match47 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern47,
    parsePattern: parseOrdinalNumberPattern47,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns47,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns47,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns47,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns47,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns47,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns47,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns47,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns47,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns47,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns47,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ko/_lib/formatLong.js
var dateFormats57 = {
  full: "y년 M월 d일 EEEE",
  long: "y년 M월 d일",
  medium: "y.MM.dd",
  short: "y.MM.dd"
};
var timeFormats57 = {
  full: "a H시 mm분 ss초 zzzz",
  long: "a H:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats57 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong57 = {
  date: buildFormatLongFn({
    formats: dateFormats57,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats57,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats57,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ko/_lib/localize.js
var eraValues49 = {
  narrow: ["BC", "AD"],
  abbreviated: ["BC", "AD"],
  wide: ["기원전", "서기"]
};
var quarterValues49 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1분기", "2분기", "3분기", "4분기"]
};
var monthValues49 = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ],
  wide: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ]
};
var dayValues49 = {
  narrow: ["일", "월", "화", "수", "목", "금", "토"],
  short: ["일", "월", "화", "수", "목", "금", "토"],
  abbreviated: ["일", "월", "화", "수", "목", "금", "토"],
  wide: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
};
var dayPeriodValues49 = {
  narrow: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  },
  abbreviated: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  },
  wide: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  }
};
var formattingDayPeriodValues41 = {
  narrow: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  },
  abbreviated: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  },
  wide: {
    am: "오전",
    pm: "오후",
    midnight: "자정",
    noon: "정오",
    morning: "아침",
    afternoon: "오후",
    evening: "저녁",
    night: "밤"
  }
};
var ordinalNumber49 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = String(options == null ? void 0 : options.unit);
  switch (unit) {
    case "minute":
    case "second":
      return String(number);
    case "date":
      return number + "일";
    default:
      return number + "번째";
  }
};
var localize49 = {
  ordinalNumber: ordinalNumber49,
  era: buildLocalizeFn({
    values: eraValues49,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues49,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues49,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues49,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues49,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues41,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ko/_lib/match.js
var matchOrdinalNumberPattern48 = /^(\d+)(일|번째)?/i;
var parseOrdinalNumberPattern48 = /\d+/i;
var matchEraPatterns48 = {
  narrow: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(기원전|서기)/i
};
var parseEraPatterns48 = {
  any: [/^(bc|기원전)/i, /^(ad|서기)/i]
};
var matchQuarterPatterns48 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234]사?분기/i
};
var parseQuarterPatterns48 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns48 = {
  narrow: /^(1[012]|[123456789])/,
  abbreviated: /^(1[012]|[123456789])월/i,
  wide: /^(1[012]|[123456789])월/i
};
var parseMonthPatterns48 = {
  any: [
    /^1월?$/,
    /^2/,
    /^3/,
    /^4/,
    /^5/,
    /^6/,
    /^7/,
    /^8/,
    /^9/,
    /^10/,
    /^11/,
    /^12/
  ]
};
var matchDayPatterns48 = {
  narrow: /^[일월화수목금토]/,
  short: /^[일월화수목금토]/,
  abbreviated: /^[일월화수목금토]/,
  wide: /^[일월화수목금토]요일/
};
var parseDayPatterns48 = {
  any: [/^일/, /^월/, /^화/, /^수/, /^목/, /^금/, /^토/]
};
var matchDayPeriodPatterns48 = {
  any: /^(am|pm|오전|오후|자정|정오|아침|저녁|밤)/i
};
var parseDayPeriodPatterns48 = {
  any: {
    am: /^(am|오전)/i,
    pm: /^(pm|오후)/i,
    midnight: /^자정/i,
    noon: /^정오/i,
    morning: /^아침/i,
    afternoon: /^오후/i,
    evening: /^저녁/i,
    night: /^밤/i
  }
};
var match48 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern48,
    parsePattern: parseOrdinalNumberPattern48,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns48,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns48,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns48,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns48,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns48,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns48,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns48,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns48,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns48,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns48,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/lb/_lib/formatLong.js
var dateFormats58 = {
  full: "EEEE, do MMMM y",
  // Méindeg, 7. Januar 2018
  long: "do MMMM y",
  // 7. Januar 2018
  medium: "do MMM y",
  // 7. Jan 2018
  short: "dd.MM.yy"
  // 07.01.18
};
var timeFormats58 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats58 = {
  full: "{{date}} 'um' {{time}}",
  long: "{{date}} 'um' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong58 = {
  date: buildFormatLongFn({
    formats: dateFormats58,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats58,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats58,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/lb/_lib/localize.js
var eraValues50 = {
  narrow: ["v.Chr.", "n.Chr."],
  abbreviated: ["v.Chr.", "n.Chr."],
  wide: ["viru Christus", "no Christus"]
};
var quarterValues50 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"]
};
var monthValues50 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mäe",
    "Abr",
    "Mee",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez"
  ],
  wide: [
    "Januar",
    "Februar",
    "Mäerz",
    "Abrëll",
    "Mee",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ]
};
var dayValues50 = {
  narrow: ["S", "M", "D", "M", "D", "F", "S"],
  short: ["So", "Mé", "Dë", "Më", "Do", "Fr", "Sa"],
  abbreviated: ["So.", "Mé.", "Dë.", "Më.", "Do.", "Fr.", "Sa."],
  wide: [
    "Sonndeg",
    "Méindeg",
    "Dënschdeg",
    "Mëttwoch",
    "Donneschdeg",
    "Freideg",
    "Samschdeg"
  ]
};
var dayPeriodValues50 = {
  narrow: {
    am: "mo.",
    pm: "nomë.",
    midnight: "Mëtternuecht",
    noon: "Mëtteg",
    morning: "Moien",
    afternoon: "Nomëtteg",
    evening: "Owend",
    night: "Nuecht"
  },
  abbreviated: {
    am: "moies",
    pm: "nomëttes",
    midnight: "Mëtternuecht",
    noon: "Mëtteg",
    morning: "Moien",
    afternoon: "Nomëtteg",
    evening: "Owend",
    night: "Nuecht"
  },
  wide: {
    am: "moies",
    pm: "nomëttes",
    midnight: "Mëtternuecht",
    noon: "Mëtteg",
    morning: "Moien",
    afternoon: "Nomëtteg",
    evening: "Owend",
    night: "Nuecht"
  }
};
var formattingDayPeriodValues42 = {
  narrow: {
    am: "mo.",
    pm: "nom.",
    midnight: "Mëtternuecht",
    noon: "mëttes",
    morning: "moies",
    afternoon: "nomëttes",
    evening: "owes",
    night: "nuets"
  },
  abbreviated: {
    am: "moies",
    pm: "nomëttes",
    midnight: "Mëtternuecht",
    noon: "mëttes",
    morning: "moies",
    afternoon: "nomëttes",
    evening: "owes",
    night: "nuets"
  },
  wide: {
    am: "moies",
    pm: "nomëttes",
    midnight: "Mëtternuecht",
    noon: "mëttes",
    morning: "moies",
    afternoon: "nomëttes",
    evening: "owes",
    night: "nuets"
  }
};
var ordinalNumber50 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize50 = {
  ordinalNumber: ordinalNumber50,
  era: buildLocalizeFn({
    values: eraValues50,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues50,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues50,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues50,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues50,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues42,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/lb/_lib/match.js
var matchOrdinalNumberPattern49 = /^(\d+)(\.)?/i;
var parseOrdinalNumberPattern49 = /\d+/i;
var matchEraPatterns49 = {
  narrow: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
  abbreviated: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
  wide: /^(viru Christus|virun eiser Zäitrechnung|no Christus|eiser Zäitrechnung)/i
};
var parseEraPatterns49 = {
  any: [/^v/i, /^n/i]
};
var matchQuarterPatterns49 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](\.)? Quartal/i
};
var parseQuarterPatterns49 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns49 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mäe|abr|mee|jun|jul|aug|sep|okt|nov|dez)/i,
  wide: /^(januar|februar|mäerz|abrëll|mee|juni|juli|august|september|oktober|november|dezember)/i
};
var parseMonthPatterns49 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mä/i,
    /^ab/i,
    /^me/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns49 = {
  narrow: /^[smdf]/i,
  short: /^(so|mé|dë|më|do|fr|sa)/i,
  abbreviated: /^(son?|méi?|dën?|mët?|don?|fre?|sam?)\.?/i,
  wide: /^(sonndeg|méindeg|dënschdeg|mëttwoch|donneschdeg|freideg|samschdeg)/i
};
var parseDayPatterns49 = {
  any: [/^so/i, /^mé/i, /^dë/i, /^më/i, /^do/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns49 = {
  narrow: /^(mo\.?|nomë\.?|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i,
  abbreviated: /^(moi\.?|nomët\.?|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i,
  wide: /^(moies|nomëttes|Mëtternuecht|mëttes|moies|nomëttes|owes|nuets)/i
};
var parseDayPeriodPatterns49 = {
  any: {
    am: /^m/i,
    pm: /^n/i,
    midnight: /^Mëtter/i,
    noon: /^mëttes/i,
    morning: /moies/i,
    afternoon: /nomëttes/i,
    // will never be matched. Afternoon is matched by `pm`
    evening: /owes/i,
    night: /nuets/i
    // will never be matched. Night is matched by `pm`
  }
};
var match49 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern49,
    parsePattern: parseOrdinalNumberPattern49,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns49,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns49,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns49,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns49,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns49,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns49,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns49,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns49,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns49,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns49,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/lt/_lib/formatLong.js
var dateFormats59 = {
  full: "y 'm'. MMMM d 'd'., EEEE",
  long: "y 'm'. MMMM d 'd'.",
  medium: "y-MM-dd",
  short: "y-MM-dd"
};
var timeFormats59 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats59 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong59 = {
  date: buildFormatLongFn({
    formats: dateFormats59,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats59,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats59,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/lt/_lib/localize.js
var eraValues51 = {
  narrow: ["pr. Kr.", "po Kr."],
  abbreviated: ["pr. Kr.", "po Kr."],
  wide: ["prieš Kristų", "po Kristaus"]
};
var quarterValues51 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["I ketv.", "II ketv.", "III ketv.", "IV ketv."],
  wide: ["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"]
};
var formattingQuarterValues2 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["I k.", "II k.", "III k.", "IV k."],
  wide: ["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"]
};
var monthValues51 = {
  narrow: ["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"],
  abbreviated: [
    "saus.",
    "vas.",
    "kov.",
    "bal.",
    "geg.",
    "birž.",
    "liep.",
    "rugp.",
    "rugs.",
    "spal.",
    "lapkr.",
    "gruod."
  ],
  wide: [
    "sausis",
    "vasaris",
    "kovas",
    "balandis",
    "gegužė",
    "birželis",
    "liepa",
    "rugpjūtis",
    "rugsėjis",
    "spalis",
    "lapkritis",
    "gruodis"
  ]
};
var formattingMonthValues11 = {
  narrow: ["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"],
  abbreviated: [
    "saus.",
    "vas.",
    "kov.",
    "bal.",
    "geg.",
    "birž.",
    "liep.",
    "rugp.",
    "rugs.",
    "spal.",
    "lapkr.",
    "gruod."
  ],
  wide: [
    "sausio",
    "vasario",
    "kovo",
    "balandžio",
    "gegužės",
    "birželio",
    "liepos",
    "rugpjūčio",
    "rugsėjo",
    "spalio",
    "lapkričio",
    "gruodžio"
  ]
};
var dayValues51 = {
  narrow: ["S", "P", "A", "T", "K", "P", "Š"],
  short: ["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"],
  abbreviated: ["sk", "pr", "an", "tr", "kt", "pn", "št"],
  wide: [
    "sekmadienis",
    "pirmadienis",
    "antradienis",
    "trečiadienis",
    "ketvirtadienis",
    "penktadienis",
    "šeštadienis"
  ]
};
var formattingDayValues2 = {
  narrow: ["S", "P", "A", "T", "K", "P", "Š"],
  short: ["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"],
  abbreviated: ["sk", "pr", "an", "tr", "kt", "pn", "št"],
  wide: [
    "sekmadienį",
    "pirmadienį",
    "antradienį",
    "trečiadienį",
    "ketvirtadienį",
    "penktadienį",
    "šeštadienį"
  ]
};
var dayPeriodValues51 = {
  narrow: {
    am: "pr. p.",
    pm: "pop.",
    midnight: "vidurnaktis",
    noon: "vidurdienis",
    morning: "rytas",
    afternoon: "diena",
    evening: "vakaras",
    night: "naktis"
  },
  abbreviated: {
    am: "priešpiet",
    pm: "popiet",
    midnight: "vidurnaktis",
    noon: "vidurdienis",
    morning: "rytas",
    afternoon: "diena",
    evening: "vakaras",
    night: "naktis"
  },
  wide: {
    am: "priešpiet",
    pm: "popiet",
    midnight: "vidurnaktis",
    noon: "vidurdienis",
    morning: "rytas",
    afternoon: "diena",
    evening: "vakaras",
    night: "naktis"
  }
};
var formattingDayPeriodValues43 = {
  narrow: {
    am: "pr. p.",
    pm: "pop.",
    midnight: "vidurnaktis",
    noon: "perpiet",
    morning: "rytas",
    afternoon: "popietė",
    evening: "vakaras",
    night: "naktis"
  },
  abbreviated: {
    am: "priešpiet",
    pm: "popiet",
    midnight: "vidurnaktis",
    noon: "perpiet",
    morning: "rytas",
    afternoon: "popietė",
    evening: "vakaras",
    night: "naktis"
  },
  wide: {
    am: "priešpiet",
    pm: "popiet",
    midnight: "vidurnaktis",
    noon: "perpiet",
    morning: "rytas",
    afternoon: "popietė",
    evening: "vakaras",
    night: "naktis"
  }
};
var ordinalNumber51 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "-oji";
};
var localize51 = {
  ordinalNumber: ordinalNumber51,
  era: buildLocalizeFn({
    values: eraValues51,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues51,
    defaultWidth: "wide",
    formattingValues: formattingQuarterValues2,
    defaultFormattingWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues51,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues11,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues51,
    defaultWidth: "wide",
    formattingValues: formattingDayValues2,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues51,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues43,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/lt/_lib/match.js
var matchOrdinalNumberPattern50 = /^(\d+)(-oji)?/i;
var parseOrdinalNumberPattern50 = /\d+/i;
var matchEraPatterns50 = {
  narrow: /^p(r|o)\.?\s?(kr\.?|me)/i,
  abbreviated: /^(pr\.\s?(kr\.|m\.\s?e\.)|po\s?kr\.|mūsų eroje)/i,
  wide: /^(prieš Kristų|prieš mūsų erą|po Kristaus|mūsų eroje)/i
};
var parseEraPatterns50 = {
  wide: [/prieš/i, /(po|mūsų)/i],
  any: [/^pr/i, /^(po|m)/i]
};
var matchQuarterPatterns50 = {
  narrow: /^([1234])/i,
  abbreviated: /^(I|II|III|IV)\s?ketv?\.?/i,
  wide: /^(I|II|III|IV)\s?ketvirtis/i
};
var parseQuarterPatterns50 = {
  narrow: [/1/i, /2/i, /3/i, /4/i],
  any: [/I$/i, /II$/i, /III/i, /IV/i]
};
var matchMonthPatterns50 = {
  narrow: /^[svkbglr]/i,
  abbreviated: /^(saus\.|vas\.|kov\.|bal\.|geg\.|birž\.|liep\.|rugp\.|rugs\.|spal\.|lapkr\.|gruod\.)/i,
  wide: /^(sausi(s|o)|vasari(s|o)|kov(a|o)s|balandž?i(s|o)|gegužės?|birželi(s|o)|liep(a|os)|rugpjū(t|č)i(s|o)|rugsėj(is|o)|spali(s|o)|lapkri(t|č)i(s|o)|gruodž?i(s|o))/i
};
var parseMonthPatterns50 = {
  narrow: [
    /^s/i,
    /^v/i,
    /^k/i,
    /^b/i,
    /^g/i,
    /^b/i,
    /^l/i,
    /^r/i,
    /^r/i,
    /^s/i,
    /^l/i,
    /^g/i
  ],
  any: [
    /^saus/i,
    /^vas/i,
    /^kov/i,
    /^bal/i,
    /^geg/i,
    /^birž/i,
    /^liep/i,
    /^rugp/i,
    /^rugs/i,
    /^spal/i,
    /^lapkr/i,
    /^gruod/i
  ]
};
var matchDayPatterns50 = {
  narrow: /^[spatkš]/i,
  short: /^(sk|pr|an|tr|kt|pn|št)/i,
  abbreviated: /^(sk|pr|an|tr|kt|pn|št)/i,
  wide: /^(sekmadien(is|į)|pirmadien(is|į)|antradien(is|į)|trečiadien(is|į)|ketvirtadien(is|į)|penktadien(is|į)|šeštadien(is|į))/i
};
var parseDayPatterns50 = {
  narrow: [/^s/i, /^p/i, /^a/i, /^t/i, /^k/i, /^p/i, /^š/i],
  wide: [/^se/i, /^pi/i, /^an/i, /^tr/i, /^ke/i, /^pe/i, /^še/i],
  any: [/^sk/i, /^pr/i, /^an/i, /^tr/i, /^kt/i, /^pn/i, /^št/i]
};
var matchDayPeriodPatterns50 = {
  narrow: /^(pr.\s?p.|pop.|vidurnaktis|(vidurdienis|perpiet)|rytas|(diena|popietė)|vakaras|naktis)/i,
  any: /^(priešpiet|popiet$|vidurnaktis|(vidurdienis|perpiet)|rytas|(diena|popietė)|vakaras|naktis)/i
};
var parseDayPeriodPatterns50 = {
  narrow: {
    am: /^pr/i,
    pm: /^pop./i,
    midnight: /^vidurnaktis/i,
    noon: /^(vidurdienis|perp)/i,
    morning: /rytas/i,
    afternoon: /(die|popietė)/i,
    evening: /vakaras/i,
    night: /naktis/i
  },
  any: {
    am: /^pr/i,
    pm: /^popiet$/i,
    midnight: /^vidurnaktis/i,
    noon: /^(vidurdienis|perp)/i,
    morning: /rytas/i,
    afternoon: /(die|popietė)/i,
    evening: /vakaras/i,
    night: /naktis/i
  }
};
var match50 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern50,
    parsePattern: parseOrdinalNumberPattern50,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns50,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns50,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns50,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns50,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns50,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns50,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns50,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns50,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns50,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns50,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/lv/_lib/formatDistance.js
function buildLocalizeTokenFn3(schema) {
  return (count, options) => {
    if (count === 1) {
      if (options == null ? void 0 : options.addSuffix) {
        return schema.one[0].replace("{{time}}", schema.one[2]);
      } else {
        return schema.one[0].replace("{{time}}", schema.one[1]);
      }
    } else {
      const rem = count % 10 === 1 && count % 100 !== 11;
      if (options == null ? void 0 : options.addSuffix) {
        return schema.other[0].replace("{{time}}", rem ? schema.other[3] : schema.other[4]).replace("{{count}}", String(count));
      } else {
        return schema.other[0].replace("{{time}}", rem ? schema.other[1] : schema.other[2]).replace("{{count}}", String(count));
      }
    }
  };
}
var formatDistanceLocale4 = {
  lessThanXSeconds: buildLocalizeTokenFn3({
    one: ["mazāk par {{time}}", "sekundi", "sekundi"],
    other: [
      "mazāk nekā {{count}} {{time}}",
      "sekunde",
      "sekundes",
      "sekundes",
      "sekundēm"
    ]
  }),
  xSeconds: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "sekunde", "sekundes"],
    other: [
      "{{count}} {{time}}",
      "sekunde",
      "sekundes",
      "sekundes",
      "sekundēm"
    ]
  }),
  halfAMinute: (_count, options) => {
    if (options == null ? void 0 : options.addSuffix) {
      return "pusminūtes";
    } else {
      return "pusminūte";
    }
  },
  lessThanXMinutes: buildLocalizeTokenFn3({
    one: ["mazāk par {{time}}", "minūti", "minūti"],
    other: [
      "mazāk nekā {{count}} {{time}}",
      "minūte",
      "minūtes",
      "minūtes",
      "minūtēm"
    ]
  }),
  xMinutes: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "minūte", "minūtes"],
    other: ["{{count}} {{time}}", "minūte", "minūtes", "minūtes", "minūtēm"]
  }),
  aboutXHours: buildLocalizeTokenFn3({
    one: ["apmēram 1 {{time}}", "stunda", "stundas"],
    other: [
      "apmēram {{count}} {{time}}",
      "stunda",
      "stundas",
      "stundas",
      "stundām"
    ]
  }),
  xHours: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "stunda", "stundas"],
    other: ["{{count}} {{time}}", "stunda", "stundas", "stundas", "stundām"]
  }),
  xDays: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "diena", "dienas"],
    other: ["{{count}} {{time}}", "diena", "dienas", "dienas", "dienām"]
  }),
  aboutXWeeks: buildLocalizeTokenFn3({
    one: ["apmēram 1 {{time}}", "nedēļa", "nedēļas"],
    other: [
      "apmēram {{count}} {{time}}",
      "nedēļa",
      "nedēļu",
      "nedēļas",
      "nedēļām"
    ]
  }),
  xWeeks: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "nedēļa", "nedēļas"],
    other: [
      "{{count}} {{time}}",
      // TODO
      "nedēļa",
      "nedēļu",
      "nedēļas",
      "nedēļām"
    ]
  }),
  aboutXMonths: buildLocalizeTokenFn3({
    one: ["apmēram 1 {{time}}", "mēnesis", "mēneša"],
    other: [
      "apmēram {{count}} {{time}}",
      "mēnesis",
      "mēneši",
      "mēneša",
      "mēnešiem"
    ]
  }),
  xMonths: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "mēnesis", "mēneša"],
    other: ["{{count}} {{time}}", "mēnesis", "mēneši", "mēneša", "mēnešiem"]
  }),
  aboutXYears: buildLocalizeTokenFn3({
    one: ["apmēram 1 {{time}}", "gads", "gada"],
    other: ["apmēram {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
  }),
  xYears: buildLocalizeTokenFn3({
    one: ["1 {{time}}", "gads", "gada"],
    other: ["{{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
  }),
  overXYears: buildLocalizeTokenFn3({
    one: ["ilgāk par 1 {{time}}", "gadu", "gadu"],
    other: ["vairāk nekā {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
  }),
  almostXYears: buildLocalizeTokenFn3({
    one: ["gandrīz 1 {{time}}", "gads", "gada"],
    other: ["vairāk nekā {{count}} {{time}}", "gads", "gadi", "gada", "gadiem"]
  })
};

// node_modules/date-fns/locale/lv/_lib/formatLong.js
var dateFormats60 = {
  full: "EEEE, y. 'gada' d. MMMM",
  long: "y. 'gada' d. MMMM",
  medium: "dd.MM.y.",
  short: "dd.MM.y."
};
var timeFormats60 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats60 = {
  full: "{{date}} 'plkst.' {{time}}",
  long: "{{date}} 'plkst.' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong60 = {
  date: buildFormatLongFn({
    formats: dateFormats60,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats60,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats60,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/lv/_lib/localize.js
var eraValues52 = {
  narrow: ["p.m.ē", "m.ē"],
  abbreviated: ["p. m. ē.", "m. ē."],
  wide: ["pirms mūsu ēras", "mūsu ērā"]
};
var quarterValues52 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1. cet.", "2. cet.", "3. cet.", "4. cet."],
  wide: [
    "pirmais ceturksnis",
    "otrais ceturksnis",
    "trešais ceturksnis",
    "ceturtais ceturksnis"
  ]
};
var formattingQuarterValues3 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1. cet.", "2. cet.", "3. cet.", "4. cet."],
  wide: [
    "pirmajā ceturksnī",
    "otrajā ceturksnī",
    "trešajā ceturksnī",
    "ceturtajā ceturksnī"
  ]
};
var monthValues52 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "janv.",
    "febr.",
    "marts",
    "apr.",
    "maijs",
    "jūn.",
    "jūl.",
    "aug.",
    "sept.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "janvāris",
    "februāris",
    "marts",
    "aprīlis",
    "maijs",
    "jūnijs",
    "jūlijs",
    "augusts",
    "septembris",
    "oktobris",
    "novembris",
    "decembris"
  ]
};
var formattingMonthValues12 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "janv.",
    "febr.",
    "martā",
    "apr.",
    "maijs",
    "jūn.",
    "jūl.",
    "aug.",
    "sept.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "janvārī",
    "februārī",
    "martā",
    "aprīlī",
    "maijā",
    "jūnijā",
    "jūlijā",
    "augustā",
    "septembrī",
    "oktobrī",
    "novembrī",
    "decembrī"
  ]
};
var dayValues52 = {
  narrow: ["S", "P", "O", "T", "C", "P", "S"],
  short: ["Sv", "P", "O", "T", "C", "Pk", "S"],
  abbreviated: [
    "svētd.",
    "pirmd.",
    "otrd.",
    "trešd.",
    "ceturtd.",
    "piektd.",
    "sestd."
  ],
  wide: [
    "svētdiena",
    "pirmdiena",
    "otrdiena",
    "trešdiena",
    "ceturtdiena",
    "piektdiena",
    "sestdiena"
  ]
};
var formattingDayValues3 = {
  narrow: ["S", "P", "O", "T", "C", "P", "S"],
  short: ["Sv", "P", "O", "T", "C", "Pk", "S"],
  abbreviated: [
    "svētd.",
    "pirmd.",
    "otrd.",
    "trešd.",
    "ceturtd.",
    "piektd.",
    "sestd."
  ],
  wide: [
    "svētdienā",
    "pirmdienā",
    "otrdienā",
    "trešdienā",
    "ceturtdienā",
    "piektdienā",
    "sestdienā"
  ]
};
var dayPeriodValues52 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "pusn.",
    noon: "pusd.",
    morning: "rīts",
    afternoon: "diena",
    evening: "vakars",
    night: "nakts"
  },
  abbreviated: {
    am: "am",
    pm: "pm",
    midnight: "pusn.",
    noon: "pusd.",
    morning: "rīts",
    afternoon: "pēcpusd.",
    evening: "vakars",
    night: "nakts"
  },
  wide: {
    am: "am",
    pm: "pm",
    midnight: "pusnakts",
    noon: "pusdienlaiks",
    morning: "rīts",
    afternoon: "pēcpusdiena",
    evening: "vakars",
    night: "nakts"
  }
};
var formattingDayPeriodValues44 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "pusn.",
    noon: "pusd.",
    morning: "rītā",
    afternoon: "dienā",
    evening: "vakarā",
    night: "naktī"
  },
  abbreviated: {
    am: "am",
    pm: "pm",
    midnight: "pusn.",
    noon: "pusd.",
    morning: "rītā",
    afternoon: "pēcpusd.",
    evening: "vakarā",
    night: "naktī"
  },
  wide: {
    am: "am",
    pm: "pm",
    midnight: "pusnaktī",
    noon: "pusdienlaikā",
    morning: "rītā",
    afternoon: "pēcpusdienā",
    evening: "vakarā",
    night: "naktī"
  }
};
var ordinalNumber52 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize52 = {
  ordinalNumber: ordinalNumber52,
  era: buildLocalizeFn({
    values: eraValues52,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues52,
    defaultWidth: "wide",
    formattingValues: formattingQuarterValues3,
    defaultFormattingWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues52,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues12,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues52,
    defaultWidth: "wide",
    formattingValues: formattingDayValues3,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues52,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues44,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/lv/_lib/match.js
var matchOrdinalNumberPattern51 = /^(\d+)\./i;
var parseOrdinalNumberPattern51 = /\d+/i;
var matchEraPatterns51 = {
  narrow: /^(p\.m\.ē|m\.ē)/i,
  abbreviated: /^(p\. m\. ē\.|m\. ē\.)/i,
  wide: /^(pirms mūsu ēras|mūsu ērā)/i
};
var parseEraPatterns51 = {
  any: [/^p/i, /^m/i]
};
var matchQuarterPatterns51 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](\. cet\.)/i,
  wide: /^(pirma(is|jā)|otra(is|jā)|treša(is|jā)|ceturta(is|jā)) ceturksn(is|ī)/i
};
var parseQuarterPatterns51 = {
  narrow: [/^1/i, /^2/i, /^3/i, /^4/i],
  abbreviated: [/^1/i, /^2/i, /^3/i, /^4/i],
  wide: [/^p/i, /^o/i, /^t/i, /^c/i]
};
var matchMonthPatterns51 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(janv\.|febr\.|marts|apr\.|maijs|jūn\.|jūl\.|aug\.|sept\.|okt\.|nov\.|dec\.)/i,
  wide: /^(janvār(is|ī)|februār(is|ī)|mart[sā]|aprīl(is|ī)|maij[sā]|jūnij[sā]|jūlij[sā]|august[sā]|septembr(is|ī)|oktobr(is|ī)|novembr(is|ī)|decembr(is|ī))/i
};
var parseMonthPatterns51 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mai/i,
    /^jūn/i,
    /^jūl/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns51 = {
  narrow: /^[spotc]/i,
  short: /^(sv|pi|o|t|c|pk|s)/i,
  abbreviated: /^(svētd\.|pirmd\.|otrd.\|trešd\.|ceturtd\.|piektd\.|sestd\.)/i,
  wide: /^(svētdien(a|ā)|pirmdien(a|ā)|otrdien(a|ā)|trešdien(a|ā)|ceturtdien(a|ā)|piektdien(a|ā)|sestdien(a|ā))/i
};
var parseDayPatterns51 = {
  narrow: [/^s/i, /^p/i, /^o/i, /^t/i, /^c/i, /^p/i, /^s/i],
  any: [/^sv/i, /^pi/i, /^o/i, /^t/i, /^c/i, /^p/i, /^se/i]
};
var matchDayPeriodPatterns51 = {
  narrow: /^(am|pm|pusn\.|pusd\.|rīt(s|ā)|dien(a|ā)|vakar(s|ā)|nakt(s|ī))/,
  abbreviated: /^(am|pm|pusn\.|pusd\.|rīt(s|ā)|pēcpusd\.|vakar(s|ā)|nakt(s|ī))/,
  wide: /^(am|pm|pusnakt(s|ī)|pusdienlaik(s|ā)|rīt(s|ā)|pēcpusdien(a|ā)|vakar(s|ā)|nakt(s|ī))/i
};
var parseDayPeriodPatterns51 = {
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /^pusn/i,
    noon: /^pusd/i,
    morning: /^r/i,
    afternoon: /^(d|pēc)/i,
    evening: /^v/i,
    night: /^n/i
  }
};
var match51 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern51,
    parsePattern: parseOrdinalNumberPattern51,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns51,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns51,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns51,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns51,
    defaultParseWidth: "wide",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns51,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns51,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns51,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns51,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns51,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns51,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/mk/_lib/formatLong.js
var dateFormats61 = {
  full: "EEEE, dd MMMM yyyy",
  long: "dd MMMM yyyy",
  medium: "dd MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats61 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "H:mm"
};
var dateTimeFormats61 = {
  any: "{{date}} {{time}}"
};
var formatLong61 = {
  date: buildFormatLongFn({
    formats: dateFormats61,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats61,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats61,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/mk/_lib/localize.js
var eraValues53 = {
  narrow: ["пр.н.е.", "н.е."],
  abbreviated: ["пред н. е.", "н. е."],
  wide: ["пред нашата ера", "нашата ера"]
};
var quarterValues53 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-ви кв.", "2-ри кв.", "3-ти кв.", "4-ти кв."],
  wide: ["1-ви квартал", "2-ри квартал", "3-ти квартал", "4-ти квартал"]
};
var monthValues53 = {
  abbreviated: [
    "јан",
    "фев",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "септ",
    "окт",
    "ноем",
    "дек"
  ],
  wide: [
    "јануари",
    "февруари",
    "март",
    "април",
    "мај",
    "јуни",
    "јули",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември"
  ]
};
var dayValues53 = {
  narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
  short: ["не", "по", "вт", "ср", "че", "пе", "са"],
  abbreviated: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
  wide: [
    "недела",
    "понеделник",
    "вторник",
    "среда",
    "четврток",
    "петок",
    "сабота"
  ]
};
var dayPeriodValues53 = {
  wide: {
    am: "претпладне",
    pm: "попладне",
    midnight: "полноќ",
    noon: "напладне",
    morning: "наутро",
    afternoon: "попладне",
    evening: "навечер",
    night: "ноќе"
  }
};
var ordinalNumber53 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "-ви";
      case 2:
        return number + "-ри";
      case 7:
      case 8:
        return number + "-ми";
    }
  }
  return number + "-ти";
};
var localize53 = {
  ordinalNumber: ordinalNumber53,
  era: buildLocalizeFn({
    values: eraValues53,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues53,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues53,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues53,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues53,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/mk/_lib/match.js
var matchOrdinalNumberPattern52 = /^(\d+)(-?[врмт][и])?/i;
var parseOrdinalNumberPattern52 = /\d+/i;
var matchEraPatterns52 = {
  narrow: /^((пр)?н\.?\s?е\.?)/i,
  abbreviated: /^((пр)?н\.?\s?е\.?)/i,
  wide: /^(пред нашата ера|нашата ера)/i
};
var parseEraPatterns52 = {
  any: [/^п/i, /^н/i]
};
var matchQuarterPatterns52 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[врт]?и?)? кв.?/i,
  wide: /^[1234](-?[врт]?и?)? квартал/i
};
var parseQuarterPatterns52 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchDayPatterns52 = {
  narrow: /^[нпвсч]/i,
  short: /^(не|по|вт|ср|че|пе|са)/i,
  abbreviated: /^(нед|пон|вто|сре|чет|пет|саб)/i,
  wide: /^(недела|понеделник|вторник|среда|четврток|петок|сабота)/i
};
var parseDayPatterns52 = {
  narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^н[ед]/i, /^п[он]/i, /^вт/i, /^ср/i, /^ч[ет]/i, /^п[ет]/i, /^с[аб]/i]
};
var matchMonthPatterns52 = {
  abbreviated: /^(јан|фев|мар|апр|мај|јун|јул|авг|сеп|окт|ноем|дек)/i,
  wide: /^(јануари|февруари|март|април|мај|јуни|јули|август|септември|октомври|ноември|декември)/i
};
var parseMonthPatterns52 = {
  any: [
    /^ја/i,
    /^Ф/i,
    /^мар/i,
    /^ап/i,
    /^мај/i,
    /^јун/i,
    /^јул/i,
    /^ав/i,
    /^се/i,
    /^окт/i,
    /^но/i,
    /^де/i
  ]
};
var matchDayPeriodPatterns52 = {
  any: /^(претп|попл|полноќ|утро|пладне|вечер|ноќ)/i
};
var parseDayPeriodPatterns52 = {
  any: {
    am: /претпладне/i,
    pm: /попладне/i,
    midnight: /полноќ/i,
    noon: /напладне/i,
    morning: /наутро/i,
    afternoon: /попладне/i,
    evening: /навечер/i,
    night: /ноќе/i
  }
};
var match52 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern52,
    parsePattern: parseOrdinalNumberPattern52,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns52,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns52,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns52,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns52,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns52,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns52,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns52,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns52,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns52,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns52,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/mn/_lib/formatLong.js
var dateFormats62 = {
  full: "y 'оны' MMMM'ын' d, EEEE 'гараг'",
  long: "y 'оны' MMMM'ын' d",
  medium: "y 'оны' MMM'ын' d",
  short: "y.MM.dd"
};
var timeFormats62 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats62 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong62 = {
  date: buildFormatLongFn({
    formats: dateFormats62,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats62,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats62,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/mn/_lib/localize.js
var eraValues54 = {
  narrow: ["НТӨ", "НТ"],
  abbreviated: ["НТӨ", "НТ"],
  wide: ["нийтийн тооллын өмнөх", "нийтийн тооллын"]
};
var quarterValues54 = {
  narrow: ["I", "II", "III", "IV"],
  abbreviated: ["I улирал", "II улирал", "III улирал", "IV улирал"],
  wide: ["1-р улирал", "2-р улирал", "3-р улирал", "4-р улирал"]
};
var monthValues54 = {
  narrow: [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII"
  ],
  abbreviated: [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар"
  ],
  wide: [
    "Нэгдүгээр сар",
    "Хоёрдугаар сар",
    "Гуравдугаар сар",
    "Дөрөвдүгээр сар",
    "Тавдугаар сар",
    "Зургаадугаар сар",
    "Долоодугаар сар",
    "Наймдугаар сар",
    "Есдүгээр сар",
    "Аравдугаар сар",
    "Арваннэгдүгээр сар",
    "Арван хоёрдугаар сар"
  ]
};
var formattingMonthValues13 = {
  narrow: [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII"
  ],
  abbreviated: [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар"
  ],
  wide: [
    "нэгдүгээр сар",
    "хоёрдугаар сар",
    "гуравдугаар сар",
    "дөрөвдүгээр сар",
    "тавдугаар сар",
    "зургаадугаар сар",
    "долоодугаар сар",
    "наймдугаар сар",
    "есдүгээр сар",
    "аравдугаар сар",
    "арваннэгдүгээр сар",
    "арван хоёрдугаар сар"
  ]
};
var dayValues54 = {
  narrow: ["Н", "Д", "М", "Л", "П", "Б", "Б"],
  short: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"],
  abbreviated: ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"],
  wide: ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]
};
var formattingDayValues4 = {
  narrow: ["Н", "Д", "М", "Л", "П", "Б", "Б"],
  short: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"],
  abbreviated: ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"],
  wide: ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба"]
};
var dayPeriodValues54 = {
  narrow: {
    am: "ү.ө.",
    pm: "ү.х.",
    midnight: "шөнө дунд",
    noon: "үд дунд",
    morning: "өглөө",
    afternoon: "өдөр",
    evening: "орой",
    night: "шөнө"
  },
  abbreviated: {
    am: "ү.ө.",
    pm: "ү.х.",
    midnight: "шөнө дунд",
    noon: "үд дунд",
    morning: "өглөө",
    afternoon: "өдөр",
    evening: "орой",
    night: "шөнө"
  },
  wide: {
    am: "ү.ө.",
    pm: "ү.х.",
    midnight: "шөнө дунд",
    noon: "үд дунд",
    morning: "өглөө",
    afternoon: "өдөр",
    evening: "орой",
    night: "шөнө"
  }
};
var ordinalNumber54 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize54 = {
  ordinalNumber: ordinalNumber54,
  era: buildLocalizeFn({
    values: eraValues54,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues54,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues54,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues13,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues54,
    defaultWidth: "wide",
    formattingValues: formattingDayValues4,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues54,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/mn/_lib/match.js
var matchOrdinalNumberPattern53 = /\d+/i;
var parseOrdinalNumberPattern53 = /\d+/i;
var matchEraPatterns53 = {
  narrow: /^(нтө|нт)/i,
  abbreviated: /^(нтө|нт)/i,
  wide: /^(нийтийн тооллын өмнө|нийтийн тооллын)/i
};
var parseEraPatterns53 = {
  any: [/^(нтө|нийтийн тооллын өмнө)/i, /^(нт|нийтийн тооллын)/i]
};
var matchQuarterPatterns53 = {
  narrow: /^(iv|iii|ii|i)/i,
  abbreviated: /^(iv|iii|ii|i) улирал/i,
  wide: /^[1-4]-р улирал/i
};
var parseQuarterPatterns53 = {
  any: [/^(i(\s|$)|1)/i, /^(ii(\s|$)|2)/i, /^(iii(\s|$)|3)/i, /^(iv(\s|$)|4)/i]
};
var matchMonthPatterns53 = {
  narrow: /^(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)/i,
  abbreviated: /^(1-р сар|2-р сар|3-р сар|4-р сар|5-р сар|6-р сар|7-р сар|8-р сар|9-р сар|10-р сар|11-р сар|12-р сар)/i,
  wide: /^(нэгдүгээр сар|хоёрдугаар сар|гуравдугаар сар|дөрөвдүгээр сар|тавдугаар сар|зургаадугаар сар|долоодугаар сар|наймдугаар сар|есдүгээр сар|аравдугаар сар|арван нэгдүгээр сар|арван хоёрдугаар сар)/i
};
var parseMonthPatterns53 = {
  narrow: [
    /^i$/i,
    /^ii$/i,
    /^iii$/i,
    /^iv$/i,
    /^v$/i,
    /^vi$/i,
    /^vii$/i,
    /^viii$/i,
    /^ix$/i,
    /^x$/i,
    /^xi$/i,
    /^xii$/i
  ],
  any: [
    /^(1|нэгдүгээр)/i,
    /^(2|хоёрдугаар)/i,
    /^(3|гуравдугаар)/i,
    /^(4|дөрөвдүгээр)/i,
    /^(5|тавдугаар)/i,
    /^(6|зургаадугаар)/i,
    /^(7|долоодугаар)/i,
    /^(8|наймдугаар)/i,
    /^(9|есдүгээр)/i,
    /^(10|аравдугаар)/i,
    /^(11|арван нэгдүгээр)/i,
    /^(12|арван хоёрдугаар)/i
  ]
};
var matchDayPatterns53 = {
  narrow: /^[ндмлпбб]/i,
  short: /^(ня|да|мя|лх|пү|ба|бя)/i,
  abbreviated: /^(ням|дав|мяг|лха|пүр|баа|бям)/i,
  wide: /^(ням|даваа|мягмар|лхагва|пүрэв|баасан|бямба)/i
};
var parseDayPatterns53 = {
  narrow: [/^н/i, /^д/i, /^м/i, /^л/i, /^п/i, /^б/i, /^б/i],
  any: [/^ня/i, /^да/i, /^мя/i, /^лх/i, /^пү/i, /^ба/i, /^бя/i]
};
var matchDayPeriodPatterns53 = {
  narrow: /^(ү\.ө\.|ү\.х\.|шөнө дунд|үд дунд|өглөө|өдөр|орой|шөнө)/i,
  any: /^(ү\.ө\.|ү\.х\.|шөнө дунд|үд дунд|өглөө|өдөр|орой|шөнө)/i
};
var parseDayPeriodPatterns53 = {
  any: {
    am: /^ү\.ө\./i,
    pm: /^ү\.х\./i,
    midnight: /^шөнө дунд/i,
    noon: /^үд дунд/i,
    morning: /өглөө/i,
    afternoon: /өдөр/i,
    evening: /орой/i,
    night: /шөнө/i
  }
};
var match53 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern53,
    parsePattern: parseOrdinalNumberPattern53,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns53,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns53,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns53,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns53,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns53,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns53,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns53,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns53,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns53,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns53,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ms/_lib/formatLong.js
var dateFormats63 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "d/M/yyyy"
};
var timeFormats63 = {
  full: "HH.mm.ss",
  long: "HH.mm.ss",
  medium: "HH.mm",
  short: "HH.mm"
};
var dateTimeFormats63 = {
  full: "{{date}} 'pukul' {{time}}",
  long: "{{date}} 'pukul' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong63 = {
  date: buildFormatLongFn({
    formats: dateFormats63,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats63,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats63,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ms/_lib/localize.js
var eraValues55 = {
  narrow: ["SM", "M"],
  abbreviated: ["SM", "M"],
  wide: ["Sebelum Masihi", "Masihi"]
};
var quarterValues55 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["S1", "S2", "S3", "S4"],
  wide: ["Suku pertama", "Suku kedua", "Suku ketiga", "Suku keempat"]
};
var monthValues55 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "O", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mac",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ogo",
    "Sep",
    "Okt",
    "Nov",
    "Dis"
  ],
  wide: [
    "Januari",
    "Februari",
    "Mac",
    "April",
    "Mei",
    "Jun",
    "Julai",
    "Ogos",
    "September",
    "Oktober",
    "November",
    "Disember"
  ]
};
var dayValues55 = {
  narrow: ["A", "I", "S", "R", "K", "J", "S"],
  short: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
  abbreviated: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
  wide: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"]
};
var dayPeriodValues55 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "tgh malam",
    noon: "tgh hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  }
};
var formattingDayPeriodValues45 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "tengah malam",
    noon: "tengah hari",
    morning: "pagi",
    afternoon: "tengah hari",
    evening: "petang",
    night: "malam"
  }
};
var ordinalNumber55 = (dirtyNumber, _options) => {
  return "ke-" + Number(dirtyNumber);
};
var localize55 = {
  ordinalNumber: ordinalNumber55,
  era: buildLocalizeFn({
    values: eraValues55,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues55,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues55,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues55,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues55,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues45,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ms/_lib/match.js
var matchOrdinalNumberPattern54 = /^ke-(\d+)?/i;
var parseOrdinalNumberPattern54 = /petama|\d+/i;
var matchEraPatterns54 = {
  narrow: /^(sm|m)/i,
  abbreviated: /^(s\.?\s?m\.?|m\.?)/i,
  wide: /^(sebelum masihi|masihi)/i
};
var parseEraPatterns54 = {
  any: [/^s/i, /^(m)/i]
};
var matchQuarterPatterns54 = {
  narrow: /^[1234]/i,
  abbreviated: /^S[1234]/i,
  wide: /Suku (pertama|kedua|ketiga|keempat)/i
};
var parseQuarterPatterns54 = {
  any: [/pertama|1/i, /kedua|2/i, /ketiga|3/i, /keempat|4/i]
};
var matchMonthPatterns54 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mac|apr|mei|jun|jul|ogo|sep|okt|nov|dis)/i,
  wide: /^(januari|februari|mac|april|mei|jun|julai|ogos|september|oktober|november|disember)/i
};
var parseMonthPatterns54 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^o/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^ma/i,
    /^ap/i,
    /^me/i,
    /^jun/i,
    /^jul/i,
    /^og/i,
    /^s/i,
    /^ok/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns54 = {
  narrow: /^[aisrkj]/i,
  short: /^(ahd|isn|sel|rab|kha|jum|sab)/i,
  abbreviated: /^(ahd|isn|sel|rab|kha|jum|sab)/i,
  wide: /^(ahad|isnin|selasa|rabu|khamis|jumaat|sabtu)/i
};
var parseDayPatterns54 = {
  narrow: [/^a/i, /^i/i, /^s/i, /^r/i, /^k/i, /^j/i, /^s/i],
  any: [/^a/i, /^i/i, /^se/i, /^r/i, /^k/i, /^j/i, /^sa/i]
};
var matchDayPeriodPatterns54 = {
  narrow: /^(am|pm|tengah malam|tengah hari|pagi|petang|malam)/i,
  any: /^([ap]\.?\s?m\.?|tengah malam|tengah hari|pagi|petang|malam)/i
};
var parseDayPeriodPatterns54 = {
  any: {
    am: /^a/i,
    pm: /^pm/i,
    midnight: /^tengah m/i,
    noon: /^tengah h/i,
    morning: /pa/i,
    afternoon: /tengah h/i,
    evening: /pe/i,
    night: /m/i
  }
};
var match54 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern54,
    parsePattern: parseOrdinalNumberPattern54,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns54,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns54,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns54,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns54,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns54,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns54,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns54,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns54,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns54,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns54,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/mt/_lib/formatLong.js
var dateFormats64 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd/MM/yyyy"
};
var timeFormats64 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats64 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong64 = {
  date: buildFormatLongFn({
    formats: dateFormats64,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats64,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats64,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/mt/_lib/localize.js
var eraValues56 = {
  narrow: ["Q", "W"],
  abbreviated: ["QK", "WK"],
  wide: ["qabel Kristu", "wara Kristu"]
};
var quarterValues56 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1. kwart", "2. kwart", "3. kwart", "4. kwart"]
};
var monthValues56 = {
  narrow: ["J", "F", "M", "A", "M", "Ġ", "L", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Fra",
    "Mar",
    "Apr",
    "Mej",
    "Ġun",
    "Lul",
    "Aww",
    "Set",
    "Ott",
    "Nov",
    "Diċ"
  ],
  wide: [
    "Jannar",
    "Frar",
    "Marzu",
    "April",
    "Mejju",
    "Ġunju",
    "Lulju",
    "Awwissu",
    "Settembru",
    "Ottubru",
    "Novembru",
    "Diċembru"
  ]
};
var dayValues56 = {
  narrow: ["Ħ", "T", "T", "E", "Ħ", "Ġ", "S"],
  short: ["Ħa", "Tn", "Tl", "Er", "Ħa", "Ġi", "Si"],
  abbreviated: ["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib"],
  wide: [
    "Il-Ħadd",
    "It-Tnejn",
    "It-Tlieta",
    "L-Erbgħa",
    "Il-Ħamis",
    "Il-Ġimgħa",
    "Is-Sibt"
  ]
};
var dayPeriodValues56 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "nofsillejl",
    noon: "nofsinhar",
    morning: "għodwa",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "lejl"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "nofsillejl",
    noon: "nofsinhar",
    morning: "għodwa",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "lejl"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "nofsillejl",
    noon: "nofsinhar",
    morning: "għodwa",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "lejl"
  }
};
var formattingDayPeriodValues46 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "f'nofsillejl",
    noon: "f'nofsinhar",
    morning: "filgħodu",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "billejl"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "f'nofsillejl",
    noon: "f'nofsinhar",
    morning: "filgħodu",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "billejl"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "f'nofsillejl",
    noon: "f'nofsinhar",
    morning: "filgħodu",
    afternoon: "wara nofsinhar",
    evening: "filgħaxija",
    night: "billejl"
  }
};
var ordinalNumber56 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "º";
};
var localize56 = {
  ordinalNumber: ordinalNumber56,
  era: buildLocalizeFn({
    values: eraValues56,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues56,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues56,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues56,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues56,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues46,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/mt/_lib/match.js
var matchOrdinalNumberPattern55 = /^(\d+)(º)?/i;
var parseOrdinalNumberPattern55 = /\d+/i;
var matchEraPatterns55 = {
  narrow: /^(q|w)/i,
  abbreviated: /^(q\.?\s?k\.?|b\.?\s?c\.?\s?e\.?|w\.?\s?k\.?)/i,
  wide: /^(qabel kristu|before common era|wara kristu|common era)/i
};
var parseEraPatterns55 = {
  any: [/^(q|b)/i, /^(w|c)/i]
};
var matchQuarterPatterns55 = {
  narrow: /^[1234]/i,
  abbreviated: /^k[1234]/i,
  wide: /^[1234](\.)? kwart/i
};
var parseQuarterPatterns55 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns55 = {
  narrow: /^[jfmaglsond]/i,
  abbreviated: /^(jan|fra|mar|apr|mej|ġun|lul|aww|set|ott|nov|diċ)/i,
  wide: /^(jannar|frar|marzu|april|mejju|ġunju|lulju|awwissu|settembru|ottubru|novembru|diċembru)/i
};
var parseMonthPatterns55 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^ġ/i,
    /^l/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mej/i,
    /^ġ/i,
    /^l/i,
    /^aw/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns55 = {
  narrow: /^[ħteġs]/i,
  short: /^(ħa|tn|tl|er|ħa|ġi|si)/i,
  abbreviated: /^(ħad|tne|tli|erb|ħam|ġim|sib)/i,
  wide: /^(il-ħadd|it-tnejn|it-tlieta|l-erbgħa|il-ħamis|il-ġimgħa|is-sibt)/i
};
var parseDayPatterns55 = {
  narrow: [/^ħ/i, /^t/i, /^t/i, /^e/i, /^ħ/i, /^ġ/i, /^s/i],
  any: [
    /^(il-)?ħad/i,
    /^(it-)?tn/i,
    /^(it-)?tl/i,
    /^(l-)?er/i,
    /^(il-)?ham/i,
    /^(il-)?ġi/i,
    /^(is-)?si/i
  ]
};
var matchDayPeriodPatterns55 = {
  narrow: /^(a|p|f'nofsillejl|f'nofsinhar|(ta') (għodwa|wara nofsinhar|filgħaxija|lejl))/i,
  any: /^([ap]\.?\s?m\.?|f'nofsillejl|f'nofsinhar|(ta') (għodwa|wara nofsinhar|filgħaxija|lejl))/i
};
var parseDayPeriodPatterns55 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^f'nofsillejl/i,
    noon: /^f'nofsinhar/i,
    morning: /għodwa/i,
    afternoon: /wara(\s.*)nofsinhar/i,
    evening: /filgħaxija/i,
    night: /lejl/i
  }
};
var match55 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern55,
    parsePattern: parseOrdinalNumberPattern55,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns55,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns55,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns55,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns55,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns55,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns55,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns55,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns55,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns55,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns55,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/nb/_lib/formatLong.js
var dateFormats65 = {
  full: "EEEE d. MMMM y",
  long: "d. MMMM y",
  medium: "d. MMM y",
  short: "dd.MM.y"
};
var timeFormats65 = {
  full: "'kl'. HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats65 = {
  full: "{{date}} 'kl.' {{time}}",
  long: "{{date}} 'kl.' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong65 = {
  date: buildFormatLongFn({
    formats: dateFormats65,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats65,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats65,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/nb/_lib/localize.js
var eraValues57 = {
  narrow: ["f.Kr.", "e.Kr."],
  abbreviated: ["f.Kr.", "e.Kr."],
  wide: ["før Kristus", "etter Kristus"]
};
var quarterValues57 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues57 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mars",
    "apr.",
    "mai",
    "juni",
    "juli",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "des."
  ],
  wide: [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember"
  ]
};
var dayValues57 = {
  narrow: ["S", "M", "T", "O", "T", "F", "L"],
  short: ["sø", "ma", "ti", "on", "to", "fr", "lø"],
  abbreviated: ["søn", "man", "tir", "ons", "tor", "fre", "lør"],
  wide: [
    "søndag",
    "mandag",
    "tirsdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lørdag"
  ]
};
var dayPeriodValues57 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på etterm.",
    evening: "på kvelden",
    night: "på natten"
  },
  abbreviated: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på etterm.",
    evening: "på kvelden",
    night: "på natten"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morgenen",
    afternoon: "på ettermiddagen",
    evening: "på kvelden",
    night: "på natten"
  }
};
var ordinalNumber57 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize57 = {
  ordinalNumber: ordinalNumber57,
  era: buildLocalizeFn({
    values: eraValues57,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues57,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues57,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues57,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues57,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/nb/_lib/match.js
var matchOrdinalNumberPattern56 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern56 = /\d+/i;
var matchEraPatterns56 = {
  narrow: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
  abbreviated: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
  wide: /^(før Kristus|før vår tid|etter Kristus|vår tid)/i
};
var parseEraPatterns56 = {
  any: [/^f/i, /^e/i]
};
var matchQuarterPatterns56 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](\.)? kvartal/i
};
var parseQuarterPatterns56 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns56 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mars?|apr|mai|juni?|juli?|aug|sep|okt|nov|des)\.?/i,
  wide: /^(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)/i
};
var parseMonthPatterns56 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^aug/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns56 = {
  narrow: /^[smtofl]/i,
  short: /^(sø|ma|ti|on|to|fr|lø)/i,
  abbreviated: /^(søn|man|tir|ons|tor|fre|lør)/i,
  wide: /^(søndag|mandag|tirsdag|onsdag|torsdag|fredag|lørdag)/i
};
var parseDayPatterns56 = {
  any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
};
var matchDayPeriodPatterns56 = {
  narrow: /^(midnatt|middag|(på) (morgenen|ettermiddagen|kvelden|natten)|[ap])/i,
  any: /^([ap]\.?\s?m\.?|midnatt|middag|(på) (morgenen|ettermiddagen|kvelden|natten))/i
};
var parseDayPeriodPatterns56 = {
  any: {
    am: /^a(\.?\s?m\.?)?$/i,
    pm: /^p(\.?\s?m\.?)?$/i,
    midnight: /^midn/i,
    noon: /^midd/i,
    morning: /morgen/i,
    afternoon: /ettermiddag/i,
    evening: /kveld/i,
    night: /natt/i
  }
};
var match56 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern56,
    parsePattern: parseOrdinalNumberPattern56,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns56,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns56,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns56,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns56,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns56,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns56,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns56,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns56,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns56,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns56,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/nl/_lib/formatLong.js
var dateFormats66 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd-MM-y"
};
var timeFormats66 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats66 = {
  full: "{{date}} 'om' {{time}}",
  long: "{{date}} 'om' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong66 = {
  date: buildFormatLongFn({
    formats: dateFormats66,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats66,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats66,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/nl/_lib/localize.js
var eraValues58 = {
  narrow: ["v.C.", "n.C."],
  abbreviated: ["v.Chr.", "n.Chr."],
  wide: ["voor Christus", "na Christus"]
};
var quarterValues58 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1e kwartaal", "2e kwartaal", "3e kwartaal", "4e kwartaal"]
};
var monthValues58 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mrt.",
    "apr.",
    "mei",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
  ]
};
var dayValues58 = {
  narrow: ["Z", "M", "D", "W", "D", "V", "Z"],
  short: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  abbreviated: ["zon", "maa", "din", "woe", "don", "vri", "zat"],
  wide: [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag"
  ]
};
var dayPeriodValues58 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middaguur",
    morning: "'s ochtends",
    afternoon: "'s middags",
    evening: "'s avonds",
    night: "'s nachts"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middaguur",
    morning: "'s ochtends",
    afternoon: "'s middags",
    evening: "'s avonds",
    night: "'s nachts"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middaguur",
    morning: "'s ochtends",
    afternoon: "'s middags",
    evening: "'s avonds",
    night: "'s nachts"
  }
};
var ordinalNumber58 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "e";
};
var localize58 = {
  ordinalNumber: ordinalNumber58,
  era: buildLocalizeFn({
    values: eraValues58,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues58,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues58,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues58,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues58,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/nl/_lib/match.js
var matchOrdinalNumberPattern57 = /^(\d+)e?/i;
var parseOrdinalNumberPattern57 = /\d+/i;
var matchEraPatterns57 = {
  narrow: /^([vn]\.? ?C\.?)/,
  abbreviated: /^([vn]\. ?Chr\.?)/,
  wide: /^((voor|na) Christus)/
};
var parseEraPatterns57 = {
  any: [/^v/, /^n/]
};
var matchQuarterPatterns57 = {
  narrow: /^[1234]/i,
  abbreviated: /^K[1234]/i,
  wide: /^[1234]e kwartaal/i
};
var parseQuarterPatterns57 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns57 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan.|feb.|mrt.|apr.|mei|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
  wide: /^(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/i
};
var parseMonthPatterns57 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^jan/i,
    /^feb/i,
    /^m(r|a)/i,
    /^apr/i,
    /^mei/i,
    /^jun/i,
    /^jul/i,
    /^aug/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^dec/i
  ]
};
var matchDayPatterns57 = {
  narrow: /^[zmdwv]/i,
  short: /^(zo|ma|di|wo|do|vr|za)/i,
  abbreviated: /^(zon|maa|din|woe|don|vri|zat)/i,
  wide: /^(zondag|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag)/i
};
var parseDayPatterns57 = {
  narrow: [/^z/i, /^m/i, /^d/i, /^w/i, /^d/i, /^v/i, /^z/i],
  any: [/^zo/i, /^ma/i, /^di/i, /^wo/i, /^do/i, /^vr/i, /^za/i]
};
var matchDayPeriodPatterns57 = {
  any: /^(am|pm|middernacht|het middaguur|'s (ochtends|middags|avonds|nachts))/i
};
var parseDayPeriodPatterns57 = {
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /^middernacht/i,
    noon: /^het middaguur/i,
    morning: /ochtend/i,
    afternoon: /middag/i,
    evening: /avond/i,
    night: /nacht/i
  }
};
var match57 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern57,
    parsePattern: parseOrdinalNumberPattern57,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns57,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns57,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns57,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns57,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns57,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns57,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns57,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns57,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns57,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns57,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/nl-BE/_lib/formatLong.js
var dateFormats67 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd.MM.y"
};
var timeFormats67 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats67 = {
  full: "{{date}} 'om' {{time}}",
  long: "{{date}} 'om' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong67 = {
  date: buildFormatLongFn({
    formats: dateFormats67,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats67,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats67,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/nl-BE/_lib/localize.js
var eraValues59 = {
  narrow: ["v.C.", "n.C."],
  abbreviated: ["v.Chr.", "n.Chr."],
  wide: ["voor Christus", "na Christus"]
};
var quarterValues59 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["K1", "K2", "K3", "K4"],
  wide: ["1e kwartaal", "2e kwartaal", "3e kwartaal", "4e kwartaal"]
};
var monthValues59 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mrt.",
    "apr.",
    "mei",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
  ]
};
var dayValues59 = {
  narrow: ["Z", "M", "D", "W", "D", "V", "Z"],
  short: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  abbreviated: ["zon", "maa", "din", "woe", "don", "vri", "zat"],
  wide: [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag"
  ]
};
var dayPeriodValues59 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middag",
    morning: "'s ochtends",
    afternoon: "'s namiddags",
    evening: "'s avonds",
    night: "'s nachts"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middag",
    morning: "'s ochtends",
    afternoon: "'s namiddags",
    evening: "'s avonds",
    night: "'s nachts"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "middernacht",
    noon: "het middag",
    morning: "'s ochtends",
    afternoon: "'s namiddags",
    evening: "'s avonds",
    night: "'s nachts"
  }
};
var ordinalNumber59 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "e";
};
var localize59 = {
  ordinalNumber: ordinalNumber59,
  era: buildLocalizeFn({
    values: eraValues59,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues59,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues59,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues59,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues59,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/nl-BE/_lib/match.js
var matchOrdinalNumberPattern58 = /^(\d+)e?/i;
var parseOrdinalNumberPattern58 = /\d+/i;
var matchEraPatterns58 = {
  narrow: /^([vn]\.? ?C\.?)/,
  abbreviated: /^([vn]\. ?Chr\.?)/,
  wide: /^((voor|na) Christus)/
};
var parseEraPatterns58 = {
  any: [/^v/, /^n/]
};
var matchQuarterPatterns58 = {
  narrow: /^[1234]/i,
  abbreviated: /^K[1234]/i,
  wide: /^[1234]e kwartaal/i
};
var parseQuarterPatterns58 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns58 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan.|feb.|mrt.|apr.|mei|jun.|jul.|aug.|sep.|okt.|nov.|dec.)/i,
  wide: /^(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/i
};
var parseMonthPatterns58 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^jan/i,
    /^feb/i,
    /^m(r|a)/i,
    /^apr/i,
    /^mei/i,
    /^jun/i,
    /^jul/i,
    /^aug/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^dec/i
  ]
};
var matchDayPatterns58 = {
  narrow: /^[zmdwv]/i,
  short: /^(zo|ma|di|wo|do|vr|za)/i,
  abbreviated: /^(zon|maa|din|woe|don|vri|zat)/i,
  wide: /^(zondag|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag)/i
};
var parseDayPatterns58 = {
  narrow: [/^z/i, /^m/i, /^d/i, /^w/i, /^d/i, /^v/i, /^z/i],
  any: [/^zo/i, /^ma/i, /^di/i, /^wo/i, /^do/i, /^vr/i, /^za/i]
};
var matchDayPeriodPatterns58 = {
  any: /^(am|pm|middernacht|het middaguur|'s (ochtends|middags|avonds|nachts))/i
};
var parseDayPeriodPatterns58 = {
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /^middernacht/i,
    noon: /^het middaguur/i,
    morning: /ochtend/i,
    afternoon: /middag/i,
    evening: /avond/i,
    night: /nacht/i
  }
};
var match58 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern58,
    parsePattern: parseOrdinalNumberPattern58,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns58,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns58,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns58,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns58,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns58,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns58,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns58,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns58,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns58,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns58,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/nn/_lib/formatLong.js
var dateFormats68 = {
  full: "EEEE d. MMMM y",
  long: "d. MMMM y",
  medium: "d. MMM y",
  short: "dd.MM.y"
};
var timeFormats68 = {
  full: "'kl'. HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats68 = {
  full: "{{date}} 'kl.' {{time}}",
  long: "{{date}} 'kl.' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong68 = {
  date: buildFormatLongFn({
    formats: dateFormats68,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats68,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats68,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/nn/_lib/localize.js
var eraValues60 = {
  narrow: ["f.Kr.", "e.Kr."],
  abbreviated: ["f.Kr.", "e.Kr."],
  wide: ["før Kristus", "etter Kristus"]
};
var quarterValues60 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues60 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mars",
    "apr.",
    "mai",
    "juni",
    "juli",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "des."
  ],
  wide: [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember"
  ]
};
var dayValues60 = {
  narrow: ["S", "M", "T", "O", "T", "F", "L"],
  short: ["su", "må", "ty", "on", "to", "fr", "lau"],
  abbreviated: ["sun", "mån", "tys", "ons", "tor", "fre", "laur"],
  wide: [
    "sundag",
    "måndag",
    "tysdag",
    "onsdag",
    "torsdag",
    "fredag",
    "laurdag"
  ]
};
var dayPeriodValues60 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på etterm.",
    evening: "på kvelden",
    night: "på natta"
  },
  abbreviated: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på etterm.",
    evening: "på kvelden",
    night: "på natta"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morgonen",
    afternoon: "på ettermiddagen",
    evening: "på kvelden",
    night: "på natta"
  }
};
var ordinalNumber60 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize60 = {
  ordinalNumber: ordinalNumber60,
  era: buildLocalizeFn({
    values: eraValues60,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues60,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues60,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues60,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues60,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/nn/_lib/match.js
var matchOrdinalNumberPattern59 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern59 = /\d+/i;
var matchEraPatterns59 = {
  narrow: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
  abbreviated: /^(f\.? ?Kr\.?|fvt\.?|e\.? ?Kr\.?|evt\.?)/i,
  wide: /^(før Kristus|før vår tid|etter Kristus|vår tid)/i
};
var parseEraPatterns59 = {
  any: [/^f/i, /^e/i]
};
var matchQuarterPatterns59 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](\.)? kvartal/i
};
var parseQuarterPatterns59 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns59 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mars?|apr|mai|juni?|juli?|aug|sep|okt|nov|des)\.?/i,
  wide: /^(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)/i
};
var parseMonthPatterns59 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^aug/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns59 = {
  narrow: /^[smtofl]/i,
  short: /^(su|må|ty|on|to|fr|la)/i,
  abbreviated: /^(sun|mån|tys|ons|tor|fre|laur)/i,
  wide: /^(sundag|måndag|tysdag|onsdag|torsdag|fredag|laurdag)/i
};
var parseDayPatterns59 = {
  any: [/^s/i, /^m/i, /^ty/i, /^o/i, /^to/i, /^f/i, /^l/i]
};
var matchDayPeriodPatterns59 = {
  narrow: /^(midnatt|middag|(på) (morgonen|ettermiddagen|kvelden|natta)|[ap])/i,
  any: /^([ap]\.?\s?m\.?|midnatt|middag|(på) (morgonen|ettermiddagen|kvelden|natta))/i
};
var parseDayPeriodPatterns59 = {
  any: {
    am: /^a(\.?\s?m\.?)?$/i,
    pm: /^p(\.?\s?m\.?)?$/i,
    midnight: /^midn/i,
    noon: /^midd/i,
    morning: /morgon/i,
    afternoon: /ettermiddag/i,
    evening: /kveld/i,
    night: /natt/i
  }
};
var match59 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern59,
    parsePattern: parseOrdinalNumberPattern59,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns59,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns59,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns59,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns59,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns59,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns59,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns59,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns59,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns59,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns59,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/oc/_lib/formatLong.js
var dateFormats69 = {
  full: "EEEE d 'de' MMMM y",
  long: "d 'de' MMMM y",
  medium: "d MMM y",
  short: "dd/MM/y"
};
var timeFormats69 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats69 = {
  full: "{{date}} 'a' {{time}}",
  long: "{{date}} 'a' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong69 = {
  date: buildFormatLongFn({
    formats: dateFormats69,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats69,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats69,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/oc/_lib/localize.js
var eraValues61 = {
  narrow: ["ab. J.C.", "apr. J.C."],
  abbreviated: ["ab. J.C.", "apr. J.C."],
  wide: ["abans Jèsus-Crist", "après Jèsus-Crist"]
};
var quarterValues61 = {
  narrow: ["T1", "T2", "T3", "T4"],
  abbreviated: ["1èr trim.", "2nd trim.", "3en trim.", "4en trim."],
  wide: ["1èr trimèstre", "2nd trimèstre", "3en trimèstre", "4en trimèstre"]
};
var monthValues61 = {
  narrow: [
    "GN",
    "FB",
    "MÇ",
    "AB",
    "MA",
    "JN",
    "JL",
    "AG",
    "ST",
    "OC",
    "NV",
    "DC"
  ],
  abbreviated: [
    "gen.",
    "febr.",
    "març",
    "abr.",
    "mai",
    "junh",
    "jul.",
    "ag.",
    "set.",
    "oct.",
    "nov.",
    "dec."
  ],
  wide: [
    "genièr",
    "febrièr",
    "març",
    "abril",
    "mai",
    "junh",
    "julhet",
    "agost",
    "setembre",
    "octòbre",
    "novembre",
    "decembre"
  ]
};
var dayValues61 = {
  narrow: ["dg.", "dl.", "dm.", "dc.", "dj.", "dv.", "ds."],
  short: ["dg.", "dl.", "dm.", "dc.", "dj.", "dv.", "ds."],
  abbreviated: ["dg.", "dl.", "dm.", "dc.", "dj.", "dv.", "ds."],
  wide: [
    "dimenge",
    "diluns",
    "dimars",
    "dimècres",
    "dijòus",
    "divendres",
    "dissabte"
  ]
};
var dayPeriodValues61 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "matin",
    afternoon: "aprèp-miègjorn",
    evening: "vèspre",
    night: "nuèch"
  },
  abbreviated: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "matin",
    afternoon: "aprèp-miègjorn",
    evening: "vèspre",
    night: "nuèch"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "matin",
    afternoon: "aprèp-miègjorn",
    evening: "vèspre",
    night: "nuèch"
  }
};
var formattingDayPeriodValues47 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "del matin",
    afternoon: "de l’aprèp-miègjorn",
    evening: "del ser",
    night: "de la nuèch"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "del matin",
    afternoon: "de l’aprèp-miègjorn",
    evening: "del ser",
    night: "de la nuèch"
  },
  wide: {
    am: "ante meridiem",
    pm: "post meridiem",
    midnight: "mièjanuèch",
    noon: "miègjorn",
    morning: "del matin",
    afternoon: "de l’aprèp-miègjorn",
    evening: "del ser",
    night: "de la nuèch"
  }
};
var ordinalNumber61 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  let ordinal;
  switch (number) {
    case 1:
      ordinal = "èr";
      break;
    case 2:
      ordinal = "nd";
      break;
    default:
      ordinal = "en";
  }
  if (unit === "year" || unit === "week" || unit === "hour" || unit === "minute" || unit === "second") {
    ordinal += "a";
  }
  return number + ordinal;
};
var localize61 = {
  ordinalNumber: ordinalNumber61,
  era: buildLocalizeFn({
    values: eraValues61,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues61,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues61,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues61,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues61,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues47,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/oc/_lib/match.js
var matchOrdinalNumberPattern60 = /^(\d+)(èr|nd|en)?[a]?/i;
var parseOrdinalNumberPattern60 = /\d+/i;
var matchEraPatterns60 = {
  narrow: /^(ab\.J\.C|apr\.J\.C|apr\.J\.-C)/i,
  abbreviated: /^(ab\.J\.-C|ab\.J-C|apr\.J\.-C|apr\.J-C|ap\.J-C)/i,
  wide: /^(abans Jèsus-Crist|après Jèsus-Crist)/i
};
var parseEraPatterns60 = {
  any: [/^ab/i, /^ap/i]
};
var matchQuarterPatterns60 = {
  narrow: /^T[1234]/i,
  abbreviated: /^[1234](èr|nd|en)? trim\.?/i,
  wide: /^[1234](èr|nd|en)? trimèstre/i
};
var parseQuarterPatterns60 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns60 = {
  narrow: /^(GN|FB|MÇ|AB|MA|JN|JL|AG|ST|OC|NV|DC)/i,
  abbreviated: /^(gen|febr|març|abr|mai|junh|jul|ag|set|oct|nov|dec)\.?/i,
  wide: /^(genièr|febrièr|març|abril|mai|junh|julhet|agost|setembre|octòbre|novembre|decembre)/i
};
var parseMonthPatterns60 = {
  any: [
    /^g/i,
    /^f/i,
    /^ma[r?]|MÇ/i,
    /^ab/i,
    /^ma[i?]/i,
    /^ju[n?]|JN/i,
    /^ju[l?]|JL/i,
    /^ag/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns60 = {
  narrow: /^d[glmcjvs]\.?/i,
  short: /^d[glmcjvs]\.?/i,
  abbreviated: /^d[glmcjvs]\.?/i,
  wide: /^(dimenge|diluns|dimars|dimècres|dijòus|divendres|dissabte)/i
};
var parseDayPatterns60 = {
  narrow: [/^dg/i, /^dl/i, /^dm/i, /^dc/i, /^dj/i, /^dv/i, /^ds/i],
  short: [/^dg/i, /^dl/i, /^dm/i, /^dc/i, /^dj/i, /^dv/i, /^ds/i],
  abbreviated: [/^dg/i, /^dl/i, /^dm/i, /^dc/i, /^dj/i, /^dv/i, /^ds/i],
  any: [
    /^dg|dime/i,
    /^dl|dil/i,
    /^dm|dima/i,
    /^dc|dimè/i,
    /^dj|dij/i,
    /^dv|div/i,
    /^ds|dis/i
  ]
};
var matchDayPeriodPatterns60 = {
  any: /(^(a\.?m|p\.?m))|(ante meridiem|post meridiem)|((del |de la |de l’)(matin|aprèp-miègjorn|vèspre|ser|nuèch))/i
};
var parseDayPeriodPatterns60 = {
  any: {
    am: /(^a)|ante meridiem/i,
    pm: /(^p)|post meridiem/i,
    midnight: /^mièj/i,
    noon: /^mièg/i,
    morning: /matin/i,
    afternoon: /aprèp-miègjorn/i,
    evening: /vèspre|ser/i,
    night: /nuèch/i
  }
};
var match60 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern60,
    parsePattern: parseOrdinalNumberPattern60,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns60,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns60,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns60,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns60,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns60,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns60,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns60,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns60,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns60,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns60,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/pl/_lib/formatLong.js
var dateFormats70 = {
  full: "EEEE, do MMMM y",
  long: "do MMMM y",
  medium: "do MMM y",
  short: "dd.MM.y"
};
var timeFormats70 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats70 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong70 = {
  date: buildFormatLongFn({
    formats: dateFormats70,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats70,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats70,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/pl/_lib/localize.js
var eraValues62 = {
  narrow: ["p.n.e.", "n.e."],
  abbreviated: ["p.n.e.", "n.e."],
  wide: ["przed naszą erą", "naszej ery"]
};
var quarterValues62 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["I kw.", "II kw.", "III kw.", "IV kw."],
  wide: ["I kwartał", "II kwartał", "III kwartał", "IV kwartał"]
};
var monthValues62 = {
  narrow: ["S", "L", "M", "K", "M", "C", "L", "S", "W", "P", "L", "G"],
  abbreviated: [
    "sty",
    "lut",
    "mar",
    "kwi",
    "maj",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru"
  ],
  wide: [
    "styczeń",
    "luty",
    "marzec",
    "kwiecień",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpień",
    "wrzesień",
    "październik",
    "listopad",
    "grudzień"
  ]
};
var monthFormattingValues = {
  narrow: ["s", "l", "m", "k", "m", "c", "l", "s", "w", "p", "l", "g"],
  abbreviated: [
    "sty",
    "lut",
    "mar",
    "kwi",
    "maj",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru"
  ],
  wide: [
    "stycznia",
    "lutego",
    "marca",
    "kwietnia",
    "maja",
    "czerwca",
    "lipca",
    "sierpnia",
    "września",
    "października",
    "listopada",
    "grudnia"
  ]
};
var dayValues62 = {
  narrow: ["N", "P", "W", "Ś", "C", "P", "S"],
  short: ["nie", "pon", "wto", "śro", "czw", "pią", "sob"],
  abbreviated: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."],
  wide: [
    "niedziela",
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota"
  ]
};
var dayFormattingValues = {
  narrow: ["n", "p", "w", "ś", "c", "p", "s"],
  short: ["nie", "pon", "wto", "śro", "czw", "pią", "sob"],
  abbreviated: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."],
  wide: [
    "niedziela",
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota"
  ]
};
var dayPeriodValues62 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "półn.",
    noon: "poł",
    morning: "rano",
    afternoon: "popoł.",
    evening: "wiecz.",
    night: "noc"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "północ",
    noon: "południe",
    morning: "rano",
    afternoon: "popołudnie",
    evening: "wieczór",
    night: "noc"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "północ",
    noon: "południe",
    morning: "rano",
    afternoon: "popołudnie",
    evening: "wieczór",
    night: "noc"
  }
};
var dayPeriodFormattingValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "o półn.",
    noon: "w poł.",
    morning: "rano",
    afternoon: "po poł.",
    evening: "wiecz.",
    night: "w nocy"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "o północy",
    noon: "w południe",
    morning: "rano",
    afternoon: "po południu",
    evening: "wieczorem",
    night: "w nocy"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "o północy",
    noon: "w południe",
    morning: "rano",
    afternoon: "po południu",
    evening: "wieczorem",
    night: "w nocy"
  }
};
var ordinalNumber62 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize62 = {
  ordinalNumber: ordinalNumber62,
  era: buildLocalizeFn({
    values: eraValues62,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues62,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues62,
    defaultWidth: "wide",
    formattingValues: monthFormattingValues,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues62,
    defaultWidth: "wide",
    formattingValues: dayFormattingValues,
    defaultFormattingWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues62,
    defaultWidth: "wide",
    formattingValues: dayPeriodFormattingValues,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/pl/_lib/match.js
var matchOrdinalNumberPattern61 = /^(\d+)?/i;
var parseOrdinalNumberPattern61 = /\d+/i;
var matchEraPatterns61 = {
  narrow: /^(p\.?\s*n\.?\s*e\.?\s*|n\.?\s*e\.?\s*)/i,
  abbreviated: /^(p\.?\s*n\.?\s*e\.?\s*|n\.?\s*e\.?\s*)/i,
  wide: /^(przed\s*nasz(ą|a)\s*er(ą|a)|naszej\s*ery)/i
};
var parseEraPatterns61 = {
  any: [/^p/i, /^n/i]
};
var matchQuarterPatterns61 = {
  narrow: /^[1234]/i,
  abbreviated: /^(I|II|III|IV)\s*kw\.?/i,
  wide: /^(I|II|III|IV)\s*kwarta(ł|l)/i
};
var parseQuarterPatterns61 = {
  narrow: [/1/i, /2/i, /3/i, /4/i],
  any: [/^I kw/i, /^II kw/i, /^III kw/i, /^IV kw/i]
};
var matchMonthPatterns61 = {
  narrow: /^[slmkcwpg]/i,
  abbreviated: /^(sty|lut|mar|kwi|maj|cze|lip|sie|wrz|pa(ź|z)|lis|gru)/i,
  wide: /^(stycznia|stycze(ń|n)|lutego|luty|marca|marzec|kwietnia|kwiecie(ń|n)|maja|maj|czerwca|czerwiec|lipca|lipiec|sierpnia|sierpie(ń|n)|wrze(ś|s)nia|wrzesie(ń|n)|pa(ź|z)dziernika|pa(ź|z)dziernik|listopada|listopad|grudnia|grudzie(ń|n))/i
};
var parseMonthPatterns61 = {
  narrow: [
    /^s/i,
    /^l/i,
    /^m/i,
    /^k/i,
    /^m/i,
    /^c/i,
    /^l/i,
    /^s/i,
    /^w/i,
    /^p/i,
    /^l/i,
    /^g/i
  ],
  any: [
    /^st/i,
    /^lu/i,
    /^mar/i,
    /^k/i,
    /^maj/i,
    /^c/i,
    /^lip/i,
    /^si/i,
    /^w/i,
    /^p/i,
    /^lis/i,
    /^g/i
  ]
};
var matchDayPatterns61 = {
  narrow: /^[npwścs]/i,
  short: /^(nie|pon|wto|(ś|s)ro|czw|pi(ą|a)|sob)/i,
  abbreviated: /^(niedz|pon|wt|(ś|s)r|czw|pt|sob)\.?/i,
  wide: /^(niedziela|poniedzia(ł|l)ek|wtorek|(ś|s)roda|czwartek|pi(ą|a)tek|sobota)/i
};
var parseDayPatterns61 = {
  narrow: [/^n/i, /^p/i, /^w/i, /^ś/i, /^c/i, /^p/i, /^s/i],
  abbreviated: [/^n/i, /^po/i, /^w/i, /^(ś|s)r/i, /^c/i, /^pt/i, /^so/i],
  any: [/^n/i, /^po/i, /^w/i, /^(ś|s)r/i, /^c/i, /^pi/i, /^so/i]
};
var matchDayPeriodPatterns61 = {
  narrow: /^(^a$|^p$|pó(ł|l)n\.?|o\s*pó(ł|l)n\.?|po(ł|l)\.?|w\s*po(ł|l)\.?|po\s*po(ł|l)\.?|rano|wiecz\.?|noc|w\s*nocy)/i,
  any: /^(am|pm|pó(ł|l)noc|o\s*pó(ł|l)nocy|po(ł|l)udnie|w\s*po(ł|l)udnie|popo(ł|l)udnie|po\s*po(ł|l)udniu|rano|wieczór|wieczorem|noc|w\s*nocy)/i
};
var parseDayPeriodPatterns61 = {
  narrow: {
    am: /^a$/i,
    pm: /^p$/i,
    midnight: /pó(ł|l)n/i,
    noon: /po(ł|l)/i,
    morning: /rano/i,
    afternoon: /po\s*po(ł|l)/i,
    evening: /wiecz/i,
    night: /noc/i
  },
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /pó(ł|l)n/i,
    noon: /po(ł|l)/i,
    morning: /rano/i,
    afternoon: /po\s*po(ł|l)/i,
    evening: /wiecz/i,
    night: /noc/i
  }
};
var match61 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern61,
    parsePattern: parseOrdinalNumberPattern61,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns61,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns61,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns61,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns61,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns61,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns61,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns61,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns61,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns61,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns61,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/pt/_lib/formatLong.js
var dateFormats71 = {
  full: "EEEE, d 'de' MMMM 'de' y",
  long: "d 'de' MMMM 'de' y",
  medium: "d 'de' MMM 'de' y",
  short: "dd/MM/y"
};
var timeFormats71 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats71 = {
  full: "{{date}} 'às' {{time}}",
  long: "{{date}} 'às' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong71 = {
  date: buildFormatLongFn({
    formats: dateFormats71,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats71,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats71,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/pt/_lib/localize.js
var eraValues63 = {
  narrow: ["aC", "dC"],
  abbreviated: ["a.C.", "d.C."],
  wide: ["antes de Cristo", "depois de Cristo"]
};
var quarterValues63 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
};
var monthValues63 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
  ],
  wide: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ]
};
var dayValues63 = {
  narrow: ["d", "s", "t", "q", "q", "s", "s"],
  short: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  abbreviated: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  wide: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado"
  ]
};
var dayPeriodValues63 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "manhã",
    afternoon: "tarde",
    evening: "noite",
    night: "madrugada"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "manhã",
    afternoon: "tarde",
    evening: "noite",
    night: "madrugada"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "manhã",
    afternoon: "tarde",
    evening: "noite",
    night: "madrugada"
  }
};
var formattingDayPeriodValues48 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da noite",
    night: "da madrugada"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da noite",
    night: "da madrugada"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da noite",
    night: "da madrugada"
  }
};
var ordinalNumber63 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "º";
};
var localize63 = {
  ordinalNumber: ordinalNumber63,
  era: buildLocalizeFn({
    values: eraValues63,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues63,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues63,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues63,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues63,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues48,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/pt/_lib/match.js
var matchOrdinalNumberPattern62 = /^(\d+)(º|ª)?/i;
var parseOrdinalNumberPattern62 = /\d+/i;
var matchEraPatterns62 = {
  narrow: /^(ac|dc|a|d)/i,
  abbreviated: /^(a\.?\s?c\.?|a\.?\s?e\.?\s?c\.?|d\.?\s?c\.?|e\.?\s?c\.?)/i,
  wide: /^(antes de cristo|antes da era comum|depois de cristo|era comum)/i
};
var parseEraPatterns62 = {
  any: [/^ac/i, /^dc/i],
  wide: [
    /^(antes de cristo|antes da era comum)/i,
    /^(depois de cristo|era comum)/i
  ]
};
var matchQuarterPatterns62 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^[1234](º|ª)? trimestre/i
};
var parseQuarterPatterns62 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns62 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i,
  wide: /^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i
};
var parseMonthPatterns62 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ab/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^ag/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns62 = {
  narrow: /^[dstq]/i,
  short: /^(dom|seg|ter|qua|qui|sex|s[áa]b)/i,
  abbreviated: /^(dom|seg|ter|qua|qui|sex|s[áa]b)/i,
  wide: /^(domingo|segunda-?\s?feira|terça-?\s?feira|quarta-?\s?feira|quinta-?\s?feira|sexta-?\s?feira|s[áa]bado)/i
};
var parseDayPatterns62 = {
  narrow: [/^d/i, /^s/i, /^t/i, /^q/i, /^q/i, /^s/i, /^s/i],
  any: [/^d/i, /^seg/i, /^t/i, /^qua/i, /^qui/i, /^sex/i, /^s[áa]/i]
};
var matchDayPeriodPatterns62 = {
  narrow: /^(a|p|meia-?\s?noite|meio-?\s?dia|(da) (manh[ãa]|tarde|noite|madrugada))/i,
  any: /^([ap]\.?\s?m\.?|meia-?\s?noite|meio-?\s?dia|(da) (manh[ãa]|tarde|noite|madrugada))/i
};
var parseDayPeriodPatterns62 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^meia/i,
    noon: /^meio/i,
    morning: /manh[ãa]/i,
    afternoon: /tarde/i,
    evening: /noite/i,
    night: /madrugada/i
  }
};
var match62 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern62,
    parsePattern: parseOrdinalNumberPattern62,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns62,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns62,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns62,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns62,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns62,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns62,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns62,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns62,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns62,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns62,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/pt-BR/_lib/formatLong.js
var dateFormats72 = {
  full: "EEEE, d 'de' MMMM 'de' y",
  long: "d 'de' MMMM 'de' y",
  medium: "d MMM y",
  short: "dd/MM/yyyy"
};
var timeFormats72 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats72 = {
  full: "{{date}} 'às' {{time}}",
  long: "{{date}} 'às' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong72 = {
  date: buildFormatLongFn({
    formats: dateFormats72,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats72,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats72,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/pt-BR/_lib/localize.js
var eraValues64 = {
  narrow: ["AC", "DC"],
  abbreviated: ["AC", "DC"],
  wide: ["antes de cristo", "depois de cristo"]
};
var quarterValues64 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"]
};
var monthValues64 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
  ],
  wide: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ]
};
var dayValues64 = {
  narrow: ["D", "S", "T", "Q", "Q", "S", "S"],
  short: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],
  abbreviated: [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado"
  ],
  wide: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado"
  ]
};
var dayPeriodValues64 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "manhã",
    afternoon: "tarde",
    evening: "tarde",
    night: "noite"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "manhã",
    afternoon: "tarde",
    evening: "tarde",
    night: "noite"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "manhã",
    afternoon: "tarde",
    evening: "tarde",
    night: "noite"
  }
};
var formattingDayPeriodValues49 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "md",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da tarde",
    night: "da noite"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da tarde",
    night: "da noite"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "meia-noite",
    noon: "meio-dia",
    morning: "da manhã",
    afternoon: "da tarde",
    evening: "da tarde",
    night: "da noite"
  }
};
var ordinalNumber64 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  if ((options == null ? void 0 : options.unit) === "week") {
    return number + "ª";
  }
  return number + "º";
};
var localize64 = {
  ordinalNumber: ordinalNumber64,
  era: buildLocalizeFn({
    values: eraValues64,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues64,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues64,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues64,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues64,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues49,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/pt-BR/_lib/match.js
var matchOrdinalNumberPattern63 = /^(\d+)[ºªo]?/i;
var parseOrdinalNumberPattern63 = /\d+/i;
var matchEraPatterns63 = {
  narrow: /^(ac|dc|a|d)/i,
  abbreviated: /^(a\.?\s?c\.?|d\.?\s?c\.?)/i,
  wide: /^(antes de cristo|depois de cristo)/i
};
var parseEraPatterns63 = {
  any: [/^ac/i, /^dc/i],
  wide: [/^antes de cristo/i, /^depois de cristo/i]
};
var matchQuarterPatterns63 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^[1234](º)? trimestre/i
};
var parseQuarterPatterns63 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns63 = {
  narrow: /^[jfmajsond]/i,
  abbreviated: /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i,
  wide: /^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i
};
var parseMonthPatterns63 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^fev/i,
    /^mar/i,
    /^abr/i,
    /^mai/i,
    /^jun/i,
    /^jul/i,
    /^ago/i,
    /^set/i,
    /^out/i,
    /^nov/i,
    /^dez/i
  ]
};
var matchDayPatterns63 = {
  narrow: /^(dom|[23456]ª?|s[aá]b)/i,
  short: /^(dom|[23456]ª?|s[aá]b)/i,
  abbreviated: /^(dom|seg|ter|qua|qui|sex|s[aá]b)/i,
  wide: /^(domingo|(segunda|ter[cç]a|quarta|quinta|sexta)([- ]feira)?|s[aá]bado)/i
};
var parseDayPatterns63 = {
  short: [/^d/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^s[aá]/i],
  narrow: [/^d/i, /^2/i, /^3/i, /^4/i, /^5/i, /^6/i, /^s[aá]/i],
  any: [/^d/i, /^seg/i, /^t/i, /^qua/i, /^qui/i, /^sex/i, /^s[aá]b/i]
};
var matchDayPeriodPatterns63 = {
  narrow: /^(a|p|mn|md|(da) (manhã|tarde|noite))/i,
  any: /^([ap]\.?\s?m\.?|meia[-\s]noite|meio[-\s]dia|(da) (manhã|tarde|noite))/i
};
var parseDayPeriodPatterns63 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mn|^meia[-\s]noite/i,
    noon: /^md|^meio[-\s]dia/i,
    morning: /manhã/i,
    afternoon: /tarde/i,
    evening: /tarde/i,
    night: /noite/i
  }
};
var match63 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern63,
    parsePattern: parseOrdinalNumberPattern63,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns63,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns63,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns63,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns63,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns63,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns63,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns63,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns63,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns63,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns63,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ro/_lib/formatLong.js
var dateFormats73 = {
  full: "EEEE, d MMMM yyyy",
  long: "d MMMM yyyy",
  medium: "d MMM yyyy",
  short: "dd.MM.yyyy"
};
var timeFormats73 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats73 = {
  full: "{{date}} 'la' {{time}}",
  long: "{{date}} 'la' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong73 = {
  date: buildFormatLongFn({
    formats: dateFormats73,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats73,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats73,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ro/_lib/localize.js
var eraValues65 = {
  narrow: ["Î", "D"],
  abbreviated: ["Î.d.C.", "D.C."],
  wide: ["Înainte de Cristos", "După Cristos"]
};
var quarterValues65 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["T1", "T2", "T3", "T4"],
  wide: [
    "primul trimestru",
    "al doilea trimestru",
    "al treilea trimestru",
    "al patrulea trimestru"
  ]
};
var monthValues65 = {
  narrow: ["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
  abbreviated: [
    "ian",
    "feb",
    "mar",
    "apr",
    "mai",
    "iun",
    "iul",
    "aug",
    "sep",
    "oct",
    "noi",
    "dec"
  ],
  wide: [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie"
  ]
};
var dayValues65 = {
  narrow: ["d", "l", "m", "m", "j", "v", "s"],
  short: ["du", "lu", "ma", "mi", "jo", "vi", "sâ"],
  abbreviated: ["dum", "lun", "mar", "mie", "joi", "vin", "sâm"],
  wide: ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"]
};
var dayPeriodValues65 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "ami",
    morning: "dim",
    afternoon: "da",
    evening: "s",
    night: "n"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "miezul nopții",
    noon: "amiază",
    morning: "dimineață",
    afternoon: "după-amiază",
    evening: "seară",
    night: "noapte"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "miezul nopții",
    noon: "amiază",
    morning: "dimineață",
    afternoon: "după-amiază",
    evening: "seară",
    night: "noapte"
  }
};
var formattingDayPeriodValues50 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mn",
    noon: "amiază",
    morning: "dimineață",
    afternoon: "după-amiază",
    evening: "seară",
    night: "noapte"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "miezul nopții",
    noon: "amiază",
    morning: "dimineață",
    afternoon: "după-amiază",
    evening: "seară",
    night: "noapte"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "miezul nopții",
    noon: "amiază",
    morning: "dimineață",
    afternoon: "după-amiază",
    evening: "seară",
    night: "noapte"
  }
};
var ordinalNumber65 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize65 = {
  ordinalNumber: ordinalNumber65,
  era: buildLocalizeFn({
    values: eraValues65,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues65,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues65,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues65,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues65,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues50,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ro/_lib/match.js
var matchOrdinalNumberPattern64 = /^(\d+)?/i;
var parseOrdinalNumberPattern64 = /\d+/i;
var matchEraPatterns64 = {
  narrow: /^(Î|D)/i,
  abbreviated: /^(Î\.?\s?d\.?\s?C\.?|Î\.?\s?e\.?\s?n\.?|D\.?\s?C\.?|e\.?\s?n\.?)/i,
  wide: /^(Înainte de Cristos|Înaintea erei noastre|După Cristos|Era noastră)/i
};
var parseEraPatterns64 = {
  any: [/^ÎC/i, /^DC/i],
  wide: [
    /^(Înainte de Cristos|Înaintea erei noastre)/i,
    /^(După Cristos|Era noastră)/i
  ]
};
var matchQuarterPatterns64 = {
  narrow: /^[1234]/i,
  abbreviated: /^T[1234]/i,
  wide: /^trimestrul [1234]/i
};
var parseQuarterPatterns64 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns64 = {
  narrow: /^[ifmaasond]/i,
  abbreviated: /^(ian|feb|mar|apr|mai|iun|iul|aug|sep|oct|noi|dec)/i,
  wide: /^(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)/i
};
var parseMonthPatterns64 = {
  narrow: [
    /^i/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^i/i,
    /^i/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ia/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^mai/i,
    /^iun/i,
    /^iul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns64 = {
  narrow: /^[dlmjvs]/i,
  short: /^(d|l|ma|mi|j|v|s)/i,
  abbreviated: /^(dum|lun|mar|mie|jo|vi|sâ)/i,
  wide: /^(duminica|luni|marţi|miercuri|joi|vineri|sâmbătă)/i
};
var parseDayPatterns64 = {
  narrow: [/^d/i, /^l/i, /^m/i, /^m/i, /^j/i, /^v/i, /^s/i],
  any: [/^d/i, /^l/i, /^ma/i, /^mi/i, /^j/i, /^v/i, /^s/i]
};
var matchDayPeriodPatterns64 = {
  narrow: /^(a|p|mn|a|(dimineaţa|după-amiaza|seara|noaptea))/i,
  any: /^([ap]\.?\s?m\.?|miezul nopții|amiaza|(dimineaţa|după-amiaza|seara|noaptea))/i
};
var parseDayPeriodPatterns64 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mn/i,
    noon: /amiaza/i,
    morning: /dimineaţa/i,
    afternoon: /după-amiaza/i,
    evening: /seara/i,
    night: /noaptea/i
  }
};
var match64 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern64,
    parsePattern: parseOrdinalNumberPattern64,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns64,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns64,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns64,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns64,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns64,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns64,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns64,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns64,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns64,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns64,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ru/_lib/formatDistance.js
function declension3(scheme, count) {
  if (scheme.one !== void 0 && count === 1) {
    return scheme.one;
  }
  const rem10 = count % 10;
  const rem100 = count % 100;
  if (rem10 === 1 && rem100 !== 11) {
    return scheme.singularNominative.replace("{{count}}", String(count));
  } else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 > 20)) {
    return scheme.singularGenitive.replace("{{count}}", String(count));
  } else {
    return scheme.pluralGenitive.replace("{{count}}", String(count));
  }
}
function buildLocalizeTokenFn4(scheme) {
  return (count, options) => {
    if (options == null ? void 0 : options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        if (scheme.future) {
          return declension3(scheme.future, count);
        } else {
          return "через " + declension3(scheme.regular, count);
        }
      } else {
        if (scheme.past) {
          return declension3(scheme.past, count);
        } else {
          return declension3(scheme.regular, count) + " назад";
        }
      }
    } else {
      return declension3(scheme.regular, count);
    }
  };
}
var formatDistanceLocale5 = {
  lessThanXSeconds: buildLocalizeTokenFn4({
    regular: {
      one: "меньше секунды",
      singularNominative: "меньше {{count}} секунды",
      singularGenitive: "меньше {{count}} секунд",
      pluralGenitive: "меньше {{count}} секунд"
    },
    future: {
      one: "меньше, чем через секунду",
      singularNominative: "меньше, чем через {{count}} секунду",
      singularGenitive: "меньше, чем через {{count}} секунды",
      pluralGenitive: "меньше, чем через {{count}} секунд"
    }
  }),
  xSeconds: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} секунда",
      singularGenitive: "{{count}} секунды",
      pluralGenitive: "{{count}} секунд"
    },
    past: {
      singularNominative: "{{count}} секунду назад",
      singularGenitive: "{{count}} секунды назад",
      pluralGenitive: "{{count}} секунд назад"
    },
    future: {
      singularNominative: "через {{count}} секунду",
      singularGenitive: "через {{count}} секунды",
      pluralGenitive: "через {{count}} секунд"
    }
  }),
  halfAMinute: (_count, options) => {
    if (options == null ? void 0 : options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "через полминуты";
      } else {
        return "полминуты назад";
      }
    }
    return "полминуты";
  },
  lessThanXMinutes: buildLocalizeTokenFn4({
    regular: {
      one: "меньше минуты",
      singularNominative: "меньше {{count}} минуты",
      singularGenitive: "меньше {{count}} минут",
      pluralGenitive: "меньше {{count}} минут"
    },
    future: {
      one: "меньше, чем через минуту",
      singularNominative: "меньше, чем через {{count}} минуту",
      singularGenitive: "меньше, чем через {{count}} минуты",
      pluralGenitive: "меньше, чем через {{count}} минут"
    }
  }),
  xMinutes: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} минута",
      singularGenitive: "{{count}} минуты",
      pluralGenitive: "{{count}} минут"
    },
    past: {
      singularNominative: "{{count}} минуту назад",
      singularGenitive: "{{count}} минуты назад",
      pluralGenitive: "{{count}} минут назад"
    },
    future: {
      singularNominative: "через {{count}} минуту",
      singularGenitive: "через {{count}} минуты",
      pluralGenitive: "через {{count}} минут"
    }
  }),
  aboutXHours: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "около {{count}} часа",
      singularGenitive: "около {{count}} часов",
      pluralGenitive: "около {{count}} часов"
    },
    future: {
      singularNominative: "приблизительно через {{count}} час",
      singularGenitive: "приблизительно через {{count}} часа",
      pluralGenitive: "приблизительно через {{count}} часов"
    }
  }),
  xHours: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} час",
      singularGenitive: "{{count}} часа",
      pluralGenitive: "{{count}} часов"
    }
  }),
  xDays: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} день",
      singularGenitive: "{{count}} дня",
      pluralGenitive: "{{count}} дней"
    }
  }),
  aboutXWeeks: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "около {{count}} недели",
      singularGenitive: "около {{count}} недель",
      pluralGenitive: "около {{count}} недель"
    },
    future: {
      singularNominative: "приблизительно через {{count}} неделю",
      singularGenitive: "приблизительно через {{count}} недели",
      pluralGenitive: "приблизительно через {{count}} недель"
    }
  }),
  xWeeks: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} неделя",
      singularGenitive: "{{count}} недели",
      pluralGenitive: "{{count}} недель"
    }
  }),
  aboutXMonths: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "около {{count}} месяца",
      singularGenitive: "около {{count}} месяцев",
      pluralGenitive: "около {{count}} месяцев"
    },
    future: {
      singularNominative: "приблизительно через {{count}} месяц",
      singularGenitive: "приблизительно через {{count}} месяца",
      pluralGenitive: "приблизительно через {{count}} месяцев"
    }
  }),
  xMonths: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} месяц",
      singularGenitive: "{{count}} месяца",
      pluralGenitive: "{{count}} месяцев"
    }
  }),
  aboutXYears: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "около {{count}} года",
      singularGenitive: "около {{count}} лет",
      pluralGenitive: "около {{count}} лет"
    },
    future: {
      singularNominative: "приблизительно через {{count}} год",
      singularGenitive: "приблизительно через {{count}} года",
      pluralGenitive: "приблизительно через {{count}} лет"
    }
  }),
  xYears: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "{{count}} год",
      singularGenitive: "{{count}} года",
      pluralGenitive: "{{count}} лет"
    }
  }),
  overXYears: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "больше {{count}} года",
      singularGenitive: "больше {{count}} лет",
      pluralGenitive: "больше {{count}} лет"
    },
    future: {
      singularNominative: "больше, чем через {{count}} год",
      singularGenitive: "больше, чем через {{count}} года",
      pluralGenitive: "больше, чем через {{count}} лет"
    }
  }),
  almostXYears: buildLocalizeTokenFn4({
    regular: {
      singularNominative: "почти {{count}} год",
      singularGenitive: "почти {{count}} года",
      pluralGenitive: "почти {{count}} лет"
    },
    future: {
      singularNominative: "почти через {{count}} год",
      singularGenitive: "почти через {{count}} года",
      pluralGenitive: "почти через {{count}} лет"
    }
  })
};

// node_modules/date-fns/locale/ru/_lib/formatLong.js
var dateFormats74 = {
  full: "EEEE, d MMMM y 'г.'",
  long: "d MMMM y 'г.'",
  medium: "d MMM y 'г.'",
  short: "dd.MM.y"
};
var timeFormats74 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats74 = {
  any: "{{date}}, {{time}}"
};
var formatLong74 = {
  date: buildFormatLongFn({
    formats: dateFormats74,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats74,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats74,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/ru/_lib/localize.js
var eraValues66 = {
  narrow: ["до н.э.", "н.э."],
  abbreviated: ["до н. э.", "н. э."],
  wide: ["до нашей эры", "нашей эры"]
};
var quarterValues66 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-й кв.", "2-й кв.", "3-й кв.", "4-й кв."],
  wide: ["1-й квартал", "2-й квартал", "3-й квартал", "4-й квартал"]
};
var monthValues66 = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв.",
    "фев.",
    "март",
    "апр.",
    "май",
    "июнь",
    "июль",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек."
  ],
  wide: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ]
};
var formattingMonthValues14 = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв.",
    "фев.",
    "мар.",
    "апр.",
    "мая",
    "июн.",
    "июл.",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек."
  ],
  wide: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ]
};
var dayValues66 = {
  narrow: ["В", "П", "В", "С", "Ч", "П", "С"],
  short: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  abbreviated: ["вск", "пнд", "втр", "срд", "чтв", "птн", "суб"],
  wide: [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота"
  ]
};
var dayPeriodValues66 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утро",
    afternoon: "день",
    evening: "веч.",
    night: "ночь"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утро",
    afternoon: "день",
    evening: "веч.",
    night: "ночь"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "полночь",
    noon: "полдень",
    morning: "утро",
    afternoon: "день",
    evening: "вечер",
    night: "ночь"
  }
};
var formattingDayPeriodValues51 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утра",
    afternoon: "дня",
    evening: "веч.",
    night: "ночи"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утра",
    afternoon: "дня",
    evening: "веч.",
    night: "ночи"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "полночь",
    noon: "полдень",
    morning: "утра",
    afternoon: "дня",
    evening: "вечера",
    night: "ночи"
  }
};
var ordinalNumber66 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  let suffix;
  if (unit === "date") {
    suffix = "-е";
  } else if (unit === "week" || unit === "minute" || unit === "second") {
    suffix = "-я";
  } else {
    suffix = "-й";
  }
  return number + suffix;
};
var localize66 = {
  ordinalNumber: ordinalNumber66,
  era: buildLocalizeFn({
    values: eraValues66,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues66,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues66,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues14,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues66,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues66,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues51,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ru/_lib/match.js
var matchOrdinalNumberPattern65 = /^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i;
var parseOrdinalNumberPattern65 = /\d+/i;
var matchEraPatterns65 = {
  narrow: /^((до )?н\.?\s?э\.?)/i,
  abbreviated: /^((до )?н\.?\s?э\.?)/i,
  wide: /^(до нашей эры|нашей эры|наша эра)/i
};
var parseEraPatterns65 = {
  any: [/^д/i, /^н/i]
};
var matchQuarterPatterns65 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[ыои]?й?)? кв.?/i,
  wide: /^[1234](-?[ыои]?й?)? квартал/i
};
var parseQuarterPatterns65 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns65 = {
  narrow: /^[яфмаисонд]/i,
  abbreviated: /^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,
  wide: /^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i
};
var parseMonthPatterns65 = {
  narrow: [
    /^я/i,
    /^ф/i,
    /^м/i,
    /^а/i,
    /^м/i,
    /^и/i,
    /^и/i,
    /^а/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^я/i
  ],
  any: [
    /^я/i,
    /^ф/i,
    /^мар/i,
    /^ап/i,
    /^ма[йя]/i,
    /^июн/i,
    /^июл/i,
    /^ав/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^д/i
  ]
};
var matchDayPatterns65 = {
  narrow: /^[впсч]/i,
  short: /^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,
  abbreviated: /^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,
  wide: /^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i
};
var parseDayPatterns65 = {
  narrow: [/^в/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^в[ос]/i, /^п[он]/i, /^в/i, /^ср/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
};
var matchDayPeriodPatterns65 = {
  narrow: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
  abbreviated: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
  wide: /^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i
};
var parseDayPeriodPatterns65 = {
  any: {
    am: /^дп/i,
    pm: /^пп/i,
    midnight: /^полн/i,
    noon: /^полд/i,
    morning: /^у/i,
    afternoon: /^д[ен]/i,
    evening: /^в/i,
    night: /^н/i
  }
};
var match65 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern65,
    parsePattern: parseOrdinalNumberPattern65,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns65,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns65,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns65,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns65,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns65,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns65,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns65,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns65,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns65,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns65,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/se/_lib/formatLong.js
var dateFormats75 = {
  full: "EEEE MMMM d. 'b.' y",
  long: "MMMM d. 'b.' y",
  medium: "MMM d. 'b.' y",
  short: "dd.MM.y"
};
var timeFormats75 = {
  full: "'dii.' HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats75 = {
  full: "{{date}} 'dii.' {{time}}",
  long: "{{date}} 'dii.' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong75 = {
  date: buildFormatLongFn({
    formats: dateFormats75,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats75,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats75,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/se/_lib/localize.js
var eraValues67 = {
  narrow: ["o.Kr.", "m.Kr."],
  abbreviated: ["o.Kr.", "m.Kr."],
  wide: ["ovdal Kristusa", "maŋŋel Kristusa"]
};
var quarterValues67 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. kvartála", "2. kvartála", "3. kvartála", "4. kvartála"]
};
var monthValues67 = {
  narrow: ["O", "G", "N", "C", "M", "G", "S", "B", "Č", "G", "S", "J"],
  abbreviated: [
    "ođđa",
    "guov",
    "njuk",
    "cuo",
    "mies",
    "geas",
    "suoi",
    "borg",
    "čakč",
    "golg",
    "skáb",
    "juov"
  ],
  wide: [
    "ođđajagemánnu",
    "guovvamánnu",
    "njukčamánnu",
    "cuoŋománnu",
    "miessemánnu",
    "geassemánnu",
    "suoidnemánnu",
    "borgemánnu",
    "čakčamánnu",
    "golggotmánnu",
    "skábmamánnu",
    "juovlamánnu"
  ]
};
var dayValues67 = {
  narrow: ["S", "V", "M", "G", "D", "B", "L"],
  short: ["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"],
  abbreviated: ["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"],
  wide: [
    "sotnabeaivi",
    "vuossárga",
    "maŋŋebárga",
    "gaskavahkku",
    "duorastat",
    "bearjadat",
    "lávvardat"
  ]
};
var dayPeriodValues67 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "gaskaidja",
    noon: "gaskabeaivi",
    morning: "iđđes",
    afternoon: "maŋŋel gaska.",
    evening: "eahkes",
    night: "ihkku"
  },
  abbreviated: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gaskaidja",
    noon: "gaskabeaivvi",
    morning: "iđđes",
    afternoon: "maŋŋel gaskabea.",
    evening: "eahkes",
    night: "ihkku"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "gaskaidja",
    noon: "gaskabeavvi",
    morning: "iđđes",
    afternoon: "maŋŋel gaskabeaivvi",
    evening: "eahkes",
    night: "ihkku"
  }
};
var ordinalNumber67 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize67 = {
  ordinalNumber: ordinalNumber67,
  era: buildLocalizeFn({
    values: eraValues67,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues67,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues67,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues67,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues67,
    defaultWidth: "wide"
  })
};

// node_modules/date-fns/locale/se/_lib/match.js
var matchOrdinalNumberPattern66 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern66 = /\d+/i;
var matchEraPatterns66 = {
  narrow: /^(o\.? ?Kr\.?|m\.? ?Kr\.?)/i,
  abbreviated: /^(o\.? ?Kr\.?|m\.? ?Kr\.?)/i,
  wide: /^(ovdal Kristusa|ovdal min áiggi|maŋŋel Kristusa|min áigi)/i
};
var parseEraPatterns66 = {
  any: [/^o/i, /^m/i]
};
var matchQuarterPatterns66 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](\.)? kvartála/i
};
var parseQuarterPatterns66 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns66 = {
  narrow: /^[ogncmsbčj]/i,
  abbreviated: /^(ođđa|guov|njuk|cuo|mies|geas|suoi|borg|čakč|golg|skáb|juov)\.?/i,
  wide: /^(ođđajagemánnu|guovvamánnu|njukčamánnu|cuoŋománnu|miessemánnu|geassemánnu|suoidnemánnu|borgemánnu|čakčamánnu|golggotmánnu|skábmamánnu|juovlamánnu)/i
};
var parseMonthPatterns66 = {
  narrow: [
    /^o/i,
    /^g/i,
    /^n/i,
    /^c/i,
    /^m/i,
    /^g/i,
    /^s/i,
    /^b/i,
    /^č/i,
    /^g/i,
    /^s/i,
    /^j/i
  ],
  any: [
    /^o/i,
    /^gu/i,
    /^n/i,
    /^c/i,
    /^m/i,
    /^ge/i,
    /^su/i,
    /^b/i,
    /^č/i,
    /^go/i,
    /^sk/i,
    /^j/i
  ]
};
var matchDayPatterns66 = {
  narrow: /^[svmgdbl]/i,
  short: /^(sotn|vuos|maŋ|gask|duor|bear|láv)/i,
  abbreviated: /^(sotn|vuos|maŋ|gask|duor|bear|láv)/i,
  wide: /^(sotnabeaivi|vuossárga|maŋŋebárga|gaskavahkku|duorastat|bearjadat|lávvardat)/i
};
var parseDayPatterns66 = {
  any: [/^s/i, /^v/i, /^m/i, /^g/i, /^d/i, /^b/i, /^l/i]
};
var matchDayPeriodPatterns66 = {
  narrow: /^(gaskaidja|gaskabeaivvi|(på) (iđđes|maŋŋel gaskabeaivvi|eahkes|ihkku)|[ap])/i,
  any: /^([ap]\.?\s?m\.?|gaskaidja|gaskabeaivvi|(på) (iđđes|maŋŋel gaskabeaivvi|eahkes|ihkku))/i
};
var parseDayPeriodPatterns66 = {
  any: {
    am: /^a(\.?\s?m\.?)?$/i,
    pm: /^p(\.?\s?m\.?)?$/i,
    midnight: /^gaskai/i,
    noon: /^gaskab/i,
    morning: /iđđes/i,
    afternoon: /maŋŋel gaskabeaivvi/i,
    evening: /eahkes/i,
    night: /ihkku/i
  }
};
var match66 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern66,
    parsePattern: parseOrdinalNumberPattern66,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns66,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns66,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns66,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns66,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns66,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns66,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns66,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns66,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns66,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns66,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sk/_lib/formatLong.js
var dateFormats76 = {
  full: "EEEE d. MMMM y",
  long: "d. MMMM y",
  medium: "d. M. y",
  short: "d. M. y"
};
var timeFormats76 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats76 = {
  full: "{{date}}, {{time}}",
  long: "{{date}}, {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong76 = {
  date: buildFormatLongFn({
    formats: dateFormats76,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats76,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats76,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sk/_lib/localize.js
var eraValues68 = {
  narrow: ["pred Kr.", "po Kr."],
  abbreviated: ["pred Kr.", "po Kr."],
  wide: ["pred Kristom", "po Kristovi"]
};
var quarterValues68 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1. štvrťrok", "2. štvrťrok", "3. štvrťrok", "4. štvrťrok"]
};
var monthValues68 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "máj",
    "jún",
    "júl",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "január",
    "február",
    "marec",
    "apríl",
    "máj",
    "jún",
    "júl",
    "august",
    "september",
    "október",
    "november",
    "december"
  ]
};
var formattingMonthValues15 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "máj",
    "jún",
    "júl",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januára",
    "februára",
    "marca",
    "apríla",
    "mája",
    "júna",
    "júla",
    "augusta",
    "septembra",
    "októbra",
    "novembra",
    "decembra"
  ]
};
var dayValues68 = {
  narrow: ["n", "p", "u", "s", "š", "p", "s"],
  short: ["ne", "po", "ut", "st", "št", "pi", "so"],
  abbreviated: ["ne", "po", "ut", "st", "št", "pi", "so"],
  wide: [
    "nedeľa",
    "pondelok",
    "utorok",
    "streda",
    "štvrtok",
    "piatok",
    "sobota"
  ]
};
var dayPeriodValues68 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "poln.",
    noon: "pol.",
    morning: "ráno",
    afternoon: "pop.",
    evening: "več.",
    night: "noc"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "poln.",
    noon: "pol.",
    morning: "ráno",
    afternoon: "popol.",
    evening: "večer",
    night: "noc"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "polnoc",
    noon: "poludnie",
    morning: "ráno",
    afternoon: "popoludnie",
    evening: "večer",
    night: "noc"
  }
};
var formattingDayPeriodValues52 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "o poln.",
    noon: "nap.",
    morning: "ráno",
    afternoon: "pop.",
    evening: "več.",
    night: "v n."
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "o poln.",
    noon: "napol.",
    morning: "ráno",
    afternoon: "popol.",
    evening: "večer",
    night: "v noci"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "o polnoci",
    noon: "napoludnie",
    morning: "ráno",
    afternoon: "popoludní",
    evening: "večer",
    night: "v noci"
  }
};
var ordinalNumber68 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize68 = {
  ordinalNumber: ordinalNumber68,
  era: buildLocalizeFn({
    values: eraValues68,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues68,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues68,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues15,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues68,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues68,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues52,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sk/_lib/match.js
var matchOrdinalNumberPattern67 = /^(\d+)\.?/i;
var parseOrdinalNumberPattern67 = /\d+/i;
var matchEraPatterns67 = {
  narrow: /^(pred Kr\.|pred n\. l\.|po Kr\.|n\. l\.)/i,
  abbreviated: /^(pred Kr\.|pred n\. l\.|po Kr\.|n\. l\.)/i,
  wide: /^(pred Kristom|pred na[šs][íi]m letopo[čc]tom|po Kristovi|n[áa][šs]ho letopo[čc]tu)/i
};
var parseEraPatterns67 = {
  any: [/^pr/i, /^(po|n)/i]
};
var matchQuarterPatterns67 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234]\. [šs]tvr[ťt]rok/i
};
var parseQuarterPatterns67 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns67 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|m[áa]j|j[úu]n|j[úu]l|aug|sep|okt|nov|dec)/i,
  wide: /^(janu[áa]ra?|febru[áa]ra?|(marec|marca)|apr[íi]la?|m[áa]ja?|j[úu]na?|j[úu]la?|augusta?|(september|septembra)|(okt[óo]ber|okt[óo]bra)|(november|novembra)|(december|decembra))/i
};
var parseMonthPatterns67 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^m[áa]j/i,
    /^j[úu]n/i,
    /^j[úu]l/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns67 = {
  narrow: /^[npusšp]/i,
  short: /^(ne|po|ut|st|št|pi|so)/i,
  abbreviated: /^(ne|po|ut|st|št|pi|so)/i,
  wide: /^(nede[ľl]a|pondelok|utorok|streda|[šs]tvrtok|piatok|sobota])/i
};
var parseDayPatterns67 = {
  narrow: [/^n/i, /^p/i, /^u/i, /^s/i, /^š/i, /^p/i, /^s/i],
  any: [/^n/i, /^po/i, /^u/i, /^st/i, /^(št|stv)/i, /^pi/i, /^so/i]
};
var matchDayPeriodPatterns67 = {
  narrow: /^(am|pm|(o )?poln\.?|(nap\.?|pol\.?)|r[áa]no|pop\.?|ve[čc]\.?|(v n\.?|noc))/i,
  abbreviated: /^(am|pm|(o )?poln\.?|(napol\.?|pol\.?)|r[áa]no|pop\.?|ve[čc]er|(v )?noci?)/i,
  any: /^(am|pm|(o )?polnoci?|(na)?poludnie|r[áa]no|popoludn(ie|í|i)|ve[čc]er|(v )?noci?)/i
};
var parseDayPeriodPatterns67 = {
  any: {
    am: /^am/i,
    pm: /^pm/i,
    midnight: /poln/i,
    noon: /^(nap|(na)?pol(\.|u))/i,
    morning: /^r[áa]no/i,
    afternoon: /^pop/i,
    evening: /^ve[čc]/i,
    night: /^(noc|v n\.)/i
  }
};
var match67 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern67,
    parsePattern: parseOrdinalNumberPattern67,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns67,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns67,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns67,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns67,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns67,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns67,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns67,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns67,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns67,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns67,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sl/_lib/formatLong.js
var dateFormats77 = {
  full: "EEEE, dd. MMMM y",
  long: "dd. MMMM y",
  medium: "d. MMM y",
  short: "d. MM. yy"
};
var timeFormats77 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats77 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong77 = {
  date: buildFormatLongFn({
    formats: dateFormats77,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats77,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats77,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sl/_lib/localize.js
var eraValues69 = {
  narrow: ["pr. n. št.", "po n. št."],
  abbreviated: ["pr. n. št.", "po n. št."],
  wide: ["pred našim štetjem", "po našem štetju"]
};
var quarterValues69 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1. čet.", "2. čet.", "3. čet.", "4. čet."],
  wide: ["1. četrtletje", "2. četrtletje", "3. četrtletje", "4. četrtletje"]
};
var monthValues69 = {
  narrow: ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
  abbreviated: [
    "jan.",
    "feb.",
    "mar.",
    "apr.",
    "maj",
    "jun.",
    "jul.",
    "avg.",
    "sep.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "januar",
    "februar",
    "marec",
    "april",
    "maj",
    "junij",
    "julij",
    "avgust",
    "september",
    "oktober",
    "november",
    "december"
  ]
};
var dayValues69 = {
  narrow: ["n", "p", "t", "s", "č", "p", "s"],
  short: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."],
  abbreviated: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."],
  wide: [
    "nedelja",
    "ponedeljek",
    "torek",
    "sreda",
    "četrtek",
    "petek",
    "sobota"
  ]
};
var dayPeriodValues69 = {
  narrow: {
    am: "d",
    pm: "p",
    midnight: "24.00",
    noon: "12.00",
    morning: "j",
    afternoon: "p",
    evening: "v",
    night: "n"
  },
  abbreviated: {
    am: "dop.",
    pm: "pop.",
    midnight: "poln.",
    noon: "pold.",
    morning: "jut.",
    afternoon: "pop.",
    evening: "več.",
    night: "noč"
  },
  wide: {
    am: "dop.",
    pm: "pop.",
    midnight: "polnoč",
    noon: "poldne",
    morning: "jutro",
    afternoon: "popoldne",
    evening: "večer",
    night: "noč"
  }
};
var formattingDayPeriodValues53 = {
  narrow: {
    am: "d",
    pm: "p",
    midnight: "24.00",
    noon: "12.00",
    morning: "zj",
    afternoon: "p",
    evening: "zv",
    night: "po"
  },
  abbreviated: {
    am: "dop.",
    pm: "pop.",
    midnight: "opoln.",
    noon: "opold.",
    morning: "zjut.",
    afternoon: "pop.",
    evening: "zveč.",
    night: "ponoči"
  },
  wide: {
    am: "dop.",
    pm: "pop.",
    midnight: "opolnoči",
    noon: "opoldne",
    morning: "zjutraj",
    afternoon: "popoldan",
    evening: "zvečer",
    night: "ponoči"
  }
};
var ordinalNumber69 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize69 = {
  ordinalNumber: ordinalNumber69,
  era: buildLocalizeFn({
    values: eraValues69,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues69,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues69,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues69,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues69,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues53,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sl/_lib/match.js
var matchOrdinalNumberPattern68 = /^(\d+)\./i;
var parseOrdinalNumberPattern68 = /\d+/i;
var matchEraPatterns68 = {
  abbreviated: /^(pr\. n\. št\.|po n\. št\.)/i,
  wide: /^(pred Kristusom|pred na[sš]im [sš]tetjem|po Kristusu|po na[sš]em [sš]tetju|na[sš]ega [sš]tetja)/i
};
var parseEraPatterns68 = {
  any: [/^pr/i, /^(po|na[sš]em)/i]
};
var matchQuarterPatterns68 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\.\s?[čc]et\.?/i,
  wide: /^[1234]\. [čc]etrtletje/i
};
var parseQuarterPatterns68 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns68 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan\.|feb\.|mar\.|apr\.|maj|jun\.|jul\.|avg\.|sep\.|okt\.|nov\.|dec\.)/i,
  wide: /^(januar|februar|marec|april|maj|junij|julij|avgust|september|oktober|november|december)/i
};
var parseMonthPatterns68 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  abbreviated: [
    /^ja/i,
    /^fe/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^av/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  wide: [
    /^ja/i,
    /^fe/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^av/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns68 = {
  narrow: /^[nptsčc]/i,
  short: /^(ned\.|pon\.|tor\.|sre\.|[cč]et\.|pet\.|sob\.)/i,
  abbreviated: /^(ned\.|pon\.|tor\.|sre\.|[cč]et\.|pet\.|sob\.)/i,
  wide: /^(nedelja|ponedeljek|torek|sreda|[cč]etrtek|petek|sobota)/i
};
var parseDayPatterns68 = {
  narrow: [/^n/i, /^p/i, /^t/i, /^s/i, /^[cč]/i, /^p/i, /^s/i],
  any: [/^n/i, /^po/i, /^t/i, /^sr/i, /^[cč]/i, /^pe/i, /^so/i]
};
var matchDayPeriodPatterns68 = {
  narrow: /^(d|po?|z?v|n|z?j|24\.00|12\.00)/i,
  any: /^(dop\.|pop\.|o?poln(\.|o[cč]i?)|o?pold(\.|ne)|z?ve[cč](\.|er)|(po)?no[cč]i?|popold(ne|an)|jut(\.|ro)|zjut(\.|raj))/i
};
var parseDayPeriodPatterns68 = {
  narrow: {
    am: /^d/i,
    pm: /^p/i,
    midnight: /^24/i,
    noon: /^12/i,
    morning: /^(z?j)/i,
    afternoon: /^p/i,
    evening: /^(z?v)/i,
    night: /^(n|po)/i
  },
  any: {
    am: /^dop\./i,
    pm: /^pop\./i,
    midnight: /^o?poln/i,
    noon: /^o?pold/i,
    morning: /j/i,
    afternoon: /^pop\./i,
    evening: /^z?ve/i,
    night: /(po)?no/i
  }
};
var match68 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern68,
    parsePattern: parseOrdinalNumberPattern68,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns68,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns68,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns68,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns68,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns68,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns68,
    defaultParseWidth: "wide"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns68,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns68,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns68,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns68,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sq/_lib/formatLong.js
var dateFormats78 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats78 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats78 = {
  full: "{{date}} 'në' {{time}}",
  long: "{{date}} 'në' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong78 = {
  date: buildFormatLongFn({
    formats: dateFormats78,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats78,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats78,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sq/_lib/localize.js
var eraValues70 = {
  narrow: ["P", "M"],
  abbreviated: ["PK", "MK"],
  wide: ["Para Krishtit", "Mbas Krishtit"]
};
var quarterValues70 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["4-mujori I", "4-mujori II", "4-mujori III", "4-mujori IV"]
};
var monthValues70 = {
  narrow: ["J", "S", "M", "P", "M", "Q", "K", "G", "S", "T", "N", "D"],
  abbreviated: [
    "Jan",
    "Shk",
    "Mar",
    "Pri",
    "Maj",
    "Qer",
    "Kor",
    "Gus",
    "Sht",
    "Tet",
    "Nën",
    "Dhj"
  ],
  wide: [
    "Janar",
    "Shkurt",
    "Mars",
    "Prill",
    "Maj",
    "Qershor",
    "Korrik",
    "Gusht",
    "Shtator",
    "Tetor",
    "Nëntor",
    "Dhjetor"
  ]
};
var dayValues70 = {
  narrow: ["D", "H", "M", "M", "E", "P", "S"],
  short: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"],
  abbreviated: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"],
  wide: ["Dielë", "Hënë", "Martë", "Mërkurë", "Enjte", "Premte", "Shtunë"]
};
var dayPeriodValues70 = {
  narrow: {
    am: "p",
    pm: "m",
    midnight: "m",
    noon: "d",
    morning: "mëngjes",
    afternoon: "dite",
    evening: "mbrëmje",
    night: "natë"
  },
  abbreviated: {
    am: "PD",
    pm: "MD",
    midnight: "mesnëtë",
    noon: "drek",
    morning: "mëngjes",
    afternoon: "mbasdite",
    evening: "mbrëmje",
    night: "natë"
  },
  wide: {
    am: "p.d.",
    pm: "m.d.",
    midnight: "mesnëtë",
    noon: "drek",
    morning: "mëngjes",
    afternoon: "mbasdite",
    evening: "mbrëmje",
    night: "natë"
  }
};
var formattingDayPeriodValues54 = {
  narrow: {
    am: "p",
    pm: "m",
    midnight: "m",
    noon: "d",
    morning: "në mëngjes",
    afternoon: "në mbasdite",
    evening: "në mbrëmje",
    night: "në mesnatë"
  },
  abbreviated: {
    am: "PD",
    pm: "MD",
    midnight: "mesnatë",
    noon: "drek",
    morning: "në mëngjes",
    afternoon: "në mbasdite",
    evening: "në mbrëmje",
    night: "në mesnatë"
  },
  wide: {
    am: "p.d.",
    pm: "m.d.",
    midnight: "mesnatë",
    noon: "drek",
    morning: "në mëngjes",
    afternoon: "në mbasdite",
    evening: "në mbrëmje",
    night: "në mesnatë"
  }
};
var ordinalNumber70 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  if ((options == null ? void 0 : options.unit) === "hour") return String(number);
  if (number === 1) return number + "-rë";
  if (number === 4) return number + "t";
  return number + "-të";
};
var localize70 = {
  ordinalNumber: ordinalNumber70,
  era: buildLocalizeFn({
    values: eraValues70,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues70,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues70,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues70,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues70,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues54,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sq/_lib/match.js
var matchOrdinalNumberPattern69 = /^(\d+)(-rë|-të|t|)?/i;
var parseOrdinalNumberPattern69 = /\d+/i;
var matchEraPatterns69 = {
  narrow: /^(p|m)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(para krishtit|mbas krishtit)/i
};
var parseEraPatterns69 = {
  any: [/^b/i, /^(p|m)/i]
};
var matchQuarterPatterns69 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234]-mujori (i{1,3}|iv)/i
};
var parseQuarterPatterns69 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns69 = {
  narrow: /^[jsmpqkftnd]/i,
  abbreviated: /^(jan|shk|mar|pri|maj|qer|kor|gus|sht|tet|nën|dhj)/i,
  wide: /^(janar|shkurt|mars|prill|maj|qershor|korrik|gusht|shtator|tetor|nëntor|dhjetor)/i
};
var parseMonthPatterns69 = {
  narrow: [
    /^j/i,
    /^s/i,
    /^m/i,
    /^p/i,
    /^m/i,
    /^q/i,
    /^k/i,
    /^g/i,
    /^s/i,
    /^t/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^shk/i,
    /^mar/i,
    /^pri/i,
    /^maj/i,
    /^qer/i,
    /^kor/i,
    /^gu/i,
    /^sht/i,
    /^tet/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns69 = {
  narrow: /^[dhmeps]/i,
  short: /^(di|hë|ma|më|en|pr|sh)/i,
  abbreviated: /^(die|hën|mar|mër|enj|pre|sht)/i,
  wide: /^(dielë|hënë|martë|mërkurë|enjte|premte|shtunë)/i
};
var parseDayPatterns69 = {
  narrow: [/^d/i, /^h/i, /^m/i, /^m/i, /^e/i, /^p/i, /^s/i],
  any: [/^d/i, /^h/i, /^ma/i, /^më/i, /^e/i, /^p/i, /^s/i]
};
var matchDayPeriodPatterns69 = {
  narrow: /^(p|m|me|në (mëngjes|mbasdite|mbrëmje|mesnatë))/i,
  any: /^([pm]\.?\s?d\.?|drek|në (mëngjes|mbasdite|mbrëmje|mesnatë))/i
};
var parseDayPeriodPatterns69 = {
  any: {
    am: /^p/i,
    pm: /^m/i,
    midnight: /^me/i,
    noon: /^dr/i,
    morning: /mëngjes/i,
    afternoon: /mbasdite/i,
    evening: /mbrëmje/i,
    night: /natë/i
  }
};
var match69 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern69,
    parsePattern: parseOrdinalNumberPattern69,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns69,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns69,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns69,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns69,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns69,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns69,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns69,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns69,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns69,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns69,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sr/_lib/formatLong.js
var dateFormats79 = {
  full: "EEEE, d. MMMM yyyy.",
  long: "d. MMMM yyyy.",
  medium: "d. MMM yy.",
  short: "dd. MM. yy."
};
var timeFormats79 = {
  full: "HH:mm:ss (zzzz)",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats79 = {
  full: "{{date}} 'у' {{time}}",
  long: "{{date}} 'у' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong79 = {
  date: buildFormatLongFn({
    formats: dateFormats79,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats79,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats79,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sr/_lib/localize.js
var eraValues71 = {
  narrow: ["пр.н.е.", "АД"],
  abbreviated: ["пр. Хр.", "по. Хр."],
  wide: ["Пре Христа", "После Христа"]
};
var quarterValues71 = {
  narrow: ["1.", "2.", "3.", "4."],
  abbreviated: ["1. кв.", "2. кв.", "3. кв.", "4. кв."],
  wide: ["1. квартал", "2. квартал", "3. квартал", "4. квартал"]
};
var monthValues71 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "јан",
    "феб",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "сеп",
    "окт",
    "нов",
    "дец"
  ],
  wide: [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар"
  ]
};
var formattingMonthValues16 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "јан",
    "феб",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "сеп",
    "окт",
    "нов",
    "дец"
  ],
  wide: [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар"
  ]
};
var dayValues71 = {
  narrow: ["Н", "П", "У", "С", "Ч", "П", "С"],
  short: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
  abbreviated: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
  wide: [
    "недеља",
    "понедељак",
    "уторак",
    "среда",
    "четвртак",
    "петак",
    "субота"
  ]
};
var formattingDayPeriodValues55 = {
  narrow: {
    am: "АМ",
    pm: "ПМ",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "поподне",
    evening: "увече",
    night: "ноћу"
  },
  abbreviated: {
    am: "АМ",
    pm: "ПМ",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "поподне",
    evening: "увече",
    night: "ноћу"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "после подне",
    evening: "увече",
    night: "ноћу"
  }
};
var dayPeriodValues71 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "поподне",
    evening: "увече",
    night: "ноћу"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "поподне",
    evening: "увече",
    night: "ноћу"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "поноћ",
    noon: "подне",
    morning: "ујутру",
    afternoon: "после подне",
    evening: "увече",
    night: "ноћу"
  }
};
var ordinalNumber71 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize71 = {
  ordinalNumber: ordinalNumber71,
  era: buildLocalizeFn({
    values: eraValues71,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues71,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues71,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues16,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues71,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues71,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues55,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sr/_lib/match.js
var matchOrdinalNumberPattern70 = /^(\d+)\./i;
var parseOrdinalNumberPattern70 = /\d+/i;
var matchEraPatterns70 = {
  narrow: /^(пр\.н\.е\.|АД)/i,
  abbreviated: /^(пр\.\s?Хр\.|по\.\s?Хр\.)/i,
  wide: /^(Пре Христа|пре нове ере|После Христа|нова ера)/i
};
var parseEraPatterns70 = {
  any: [/^пр/i, /^(по|нова)/i]
};
var matchQuarterPatterns70 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\.\s?кв\.?/i,
  wide: /^[1234]\. квартал/i
};
var parseQuarterPatterns70 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns70 = {
  narrow: /^(10|11|12|[123456789])\./i,
  abbreviated: /^(јан|феб|мар|апр|мај|јун|јул|авг|сеп|окт|нов|дец)/i,
  wide: /^((јануар|јануара)|(фебруар|фебруара)|(март|марта)|(април|априла)|(мја|маја)|(јун|јуна)|(јул|јула)|(август|августа)|(септембар|септембра)|(октобар|октобра)|(новембар|новембра)|(децембар|децембра))/i
};
var parseMonthPatterns70 = {
  narrow: [
    /^1/i,
    /^2/i,
    /^3/i,
    /^4/i,
    /^5/i,
    /^6/i,
    /^7/i,
    /^8/i,
    /^9/i,
    /^10/i,
    /^11/i,
    /^12/i
  ],
  any: [
    /^ја/i,
    /^ф/i,
    /^мар/i,
    /^ап/i,
    /^мај/i,
    /^јун/i,
    /^јул/i,
    /^авг/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^д/i
  ]
};
var matchDayPatterns70 = {
  narrow: /^[пусчн]/i,
  short: /^(нед|пон|уто|сре|чет|пет|суб)/i,
  abbreviated: /^(нед|пон|уто|сре|чет|пет|суб)/i,
  wide: /^(недеља|понедељак|уторак|среда|четвртак|петак|субота)/i
};
var parseDayPatterns70 = {
  narrow: [/^п/i, /^у/i, /^с/i, /^ч/i, /^п/i, /^с/i, /^н/i],
  any: [/^нед/i, /^пон/i, /^уто/i, /^сре/i, /^чет/i, /^пет/i, /^суб/i]
};
var matchDayPeriodPatterns70 = {
  any: /^(ам|пм|поноћ|(по)?подне|увече|ноћу|после подне|ујутру)/i
};
var parseDayPeriodPatterns70 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^поно/i,
    noon: /^под/i,
    morning: /ујутру/i,
    afternoon: /(после\s|по)+подне/i,
    evening: /(увече)/i,
    night: /(ноћу)/i
  }
};
var match70 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern70,
    parsePattern: parseOrdinalNumberPattern70,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns70,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns70,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns70,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns70,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns70,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns70,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns70,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns70,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns70,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns70,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sr-Latn/_lib/formatLong.js
var dateFormats80 = {
  full: "EEEE, d. MMMM yyyy.",
  long: "d. MMMM yyyy.",
  medium: "d. MMM yy.",
  short: "dd. MM. yy."
};
var timeFormats80 = {
  full: "HH:mm:ss (zzzz)",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats80 = {
  full: "{{date}} 'u' {{time}}",
  long: "{{date}} 'u' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong80 = {
  date: buildFormatLongFn({
    formats: dateFormats80,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats80,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats80,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sr-Latn/_lib/localize.js
var eraValues72 = {
  narrow: ["pr.n.e.", "AD"],
  abbreviated: ["pr. Hr.", "po. Hr."],
  wide: ["Pre Hrista", "Posle Hrista"]
};
var quarterValues72 = {
  narrow: ["1.", "2.", "3.", "4."],
  abbreviated: ["1. kv.", "2. kv.", "3. kv.", "4. kv."],
  wide: ["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"]
};
var monthValues72 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar"
  ]
};
var formattingMonthValues17 = {
  narrow: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12."
  ],
  abbreviated: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec"
  ],
  wide: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar"
  ]
};
var dayValues72 = {
  narrow: ["N", "P", "U", "S", "Č", "P", "S"],
  short: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  abbreviated: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  wide: [
    "nedelja",
    "ponedeljak",
    "utorak",
    "sreda",
    "četvrtak",
    "petak",
    "subota"
  ]
};
var formattingDayPeriodValues56 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "posle podne",
    evening: "uveče",
    night: "noću"
  }
};
var dayPeriodValues72 = {
  narrow: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "popodne",
    evening: "uveče",
    night: "noću"
  },
  wide: {
    am: "AM",
    pm: "PM",
    midnight: "ponoć",
    noon: "podne",
    morning: "ujutru",
    afternoon: "posle podne",
    evening: "uveče",
    night: "noću"
  }
};
var ordinalNumber72 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize72 = {
  ordinalNumber: ordinalNumber72,
  era: buildLocalizeFn({
    values: eraValues72,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues72,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues72,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues17,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues72,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues72,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues56,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sr-Latn/_lib/match.js
var matchOrdinalNumberPattern71 = /^(\d+)\./i;
var parseOrdinalNumberPattern71 = /\d+/i;
var matchEraPatterns71 = {
  narrow: /^(pr\.n\.e\.|AD)/i,
  abbreviated: /^(pr\.\s?Hr\.|po\.\s?Hr\.)/i,
  wide: /^(Pre Hrista|pre nove ere|Posle Hrista|nova era)/i
};
var parseEraPatterns71 = {
  any: [/^pr/i, /^(po|nova)/i]
};
var matchQuarterPatterns71 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]\.\s?kv\.?/i,
  wide: /^[1234]\. kvartal/i
};
var parseQuarterPatterns71 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns71 = {
  narrow: /^(10|11|12|[123456789])\./i,
  abbreviated: /^(jan|feb|mar|apr|maj|jun|jul|avg|sep|okt|nov|dec)/i,
  wide: /^((januar|januara)|(februar|februara)|(mart|marta)|(april|aprila)|(maj|maja)|(jun|juna)|(jul|jula)|(avgust|avgusta)|(septembar|septembra)|(oktobar|oktobra)|(novembar|novembra)|(decembar|decembra))/i
};
var parseMonthPatterns71 = {
  narrow: [
    /^1/i,
    /^2/i,
    /^3/i,
    /^4/i,
    /^5/i,
    /^6/i,
    /^7/i,
    /^8/i,
    /^9/i,
    /^10/i,
    /^11/i,
    /^12/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^avg/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns71 = {
  narrow: /^[npusčc]/i,
  short: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
  abbreviated: /^(ned|pon|uto|sre|(čet|cet)|pet|sub)/i,
  wide: /^(nedelja|ponedeljak|utorak|sreda|(četvrtak|cetvrtak)|petak|subota)/i
};
var parseDayPatterns71 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns71 = {
  any: /^(am|pm|ponoc|ponoć|(po)?podne|uvece|uveče|noću|posle podne|ujutru)/i
};
var parseDayPeriodPatterns71 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^pono/i,
    noon: /^pod/i,
    morning: /jutro/i,
    afternoon: /(posle\s|po)+podne/i,
    evening: /(uvece|uveče)/i,
    night: /(nocu|noću)/i
  }
};
var match71 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern71,
    parsePattern: parseOrdinalNumberPattern71,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns71,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns71,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns71,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns71,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns71,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns71,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns71,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns71,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns71,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns71,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/sv/_lib/formatLong.js
var dateFormats81 = {
  full: "EEEE d MMMM y",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "y-MM-dd"
};
var timeFormats81 = {
  full: "'kl'. HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats81 = {
  full: "{{date}} 'kl.' {{time}}",
  long: "{{date}} 'kl.' {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong81 = {
  date: buildFormatLongFn({
    formats: dateFormats81,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats81,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats81,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/sv/_lib/localize.js
var eraValues73 = {
  narrow: ["f.Kr.", "e.Kr."],
  abbreviated: ["f.Kr.", "e.Kr."],
  wide: ["före Kristus", "efter Kristus"]
};
var quarterValues73 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1:a kvartalet", "2:a kvartalet", "3:e kvartalet", "4:e kvartalet"]
};
var monthValues73 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "jan.",
    "feb.",
    "mars",
    "apr.",
    "maj",
    "juni",
    "juli",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec."
  ],
  wide: [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december"
  ]
};
var dayValues73 = {
  narrow: ["S", "M", "T", "O", "T", "F", "L"],
  short: ["sö", "må", "ti", "on", "to", "fr", "lö"],
  abbreviated: ["sön", "mån", "tis", "ons", "tors", "fre", "lör"],
  wide: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"]
};
var dayPeriodValues73 = {
  narrow: {
    am: "fm",
    pm: "em",
    midnight: "midnatt",
    noon: "middag",
    morning: "morg.",
    afternoon: "efterm.",
    evening: "kväll",
    night: "natt"
  },
  abbreviated: {
    am: "f.m.",
    pm: "e.m.",
    midnight: "midnatt",
    noon: "middag",
    morning: "morgon",
    afternoon: "efterm.",
    evening: "kväll",
    night: "natt"
  },
  wide: {
    am: "förmiddag",
    pm: "eftermiddag",
    midnight: "midnatt",
    noon: "middag",
    morning: "morgon",
    afternoon: "eftermiddag",
    evening: "kväll",
    night: "natt"
  }
};
var formattingDayPeriodValues57 = {
  narrow: {
    am: "fm",
    pm: "em",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på efterm.",
    evening: "på kvällen",
    night: "på natten"
  },
  abbreviated: {
    am: "fm",
    pm: "em",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morg.",
    afternoon: "på efterm.",
    evening: "på kvällen",
    night: "på natten"
  },
  wide: {
    am: "fm",
    pm: "em",
    midnight: "midnatt",
    noon: "middag",
    morning: "på morgonen",
    afternoon: "på eftermiddagen",
    evening: "på kvällen",
    night: "på natten"
  }
};
var ordinalNumber73 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
      case 2:
        return number + ":a";
    }
  }
  return number + ":e";
};
var localize73 = {
  ordinalNumber: ordinalNumber73,
  era: buildLocalizeFn({
    values: eraValues73,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues73,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues73,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues73,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues73,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues57,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/sv/_lib/match.js
var matchOrdinalNumberPattern72 = /^(\d+)(:a|:e)?/i;
var parseOrdinalNumberPattern72 = /\d+/i;
var matchEraPatterns72 = {
  narrow: /^(f\.? ?Kr\.?|f\.? ?v\.? ?t\.?|e\.? ?Kr\.?|v\.? ?t\.?)/i,
  abbreviated: /^(f\.? ?Kr\.?|f\.? ?v\.? ?t\.?|e\.? ?Kr\.?|v\.? ?t\.?)/i,
  wide: /^(före Kristus|före vår tid|efter Kristus|vår tid)/i
};
var parseEraPatterns72 = {
  any: [/^f/i, /^[ev]/i]
};
var matchQuarterPatterns72 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](:a|:e)? kvartalet/i
};
var parseQuarterPatterns72 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns72 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar[s]?|apr|maj|jun[i]?|jul[i]?|aug|sep|okt|nov|dec)\.?/i,
  wide: /^(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)/i
};
var parseMonthPatterns72 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^maj/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns72 = {
  narrow: /^[smtofl]/i,
  short: /^(sö|må|ti|on|to|fr|lö)/i,
  abbreviated: /^(sön|mån|tis|ons|tors|fre|lör)/i,
  wide: /^(söndag|måndag|tisdag|onsdag|torsdag|fredag|lördag)/i
};
var parseDayPatterns72 = {
  any: [/^s/i, /^m/i, /^ti/i, /^o/i, /^to/i, /^f/i, /^l/i]
};
var matchDayPeriodPatterns72 = {
  any: /^([fe]\.?\s?m\.?|midn(att)?|midd(ag)?|(på) (morgonen|eftermiddagen|kvällen|natten))/i
};
var parseDayPeriodPatterns72 = {
  any: {
    am: /^f/i,
    pm: /^e/i,
    midnight: /^midn/i,
    noon: /^midd/i,
    morning: /morgon/i,
    afternoon: /eftermiddag/i,
    evening: /kväll/i,
    night: /natt/i
  }
};
var match72 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern72,
    parsePattern: parseOrdinalNumberPattern72,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns72,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns72,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns72,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns72,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns72,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns72,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns72,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns72,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns72,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns72,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ta/_lib/formatLong.js
var dateFormats82 = {
  full: "EEEE, d MMMM, y",
  long: "d MMMM, y",
  medium: "d MMM, y",
  short: "d/M/yy"
};
var timeFormats82 = {
  full: "a h:mm:ss zzzz",
  long: "a h:mm:ss z",
  medium: "a h:mm:ss",
  short: "a h:mm"
};
var dateTimeFormats82 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong82 = {
  date: buildFormatLongFn({
    formats: dateFormats82,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats82,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats82,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ta/_lib/localize.js
var eraValues74 = {
  narrow: ["கி.மு.", "கி.பி."],
  abbreviated: ["கி.மு.", "கி.பி."],
  // CLDR #1624, #1626
  wide: ["கிறிஸ்துவுக்கு முன்", "அன்னோ டோமினி"]
  // CLDR #1620, #1622
};
var quarterValues74 = {
  // CLDR #1644 - #1647
  narrow: ["1", "2", "3", "4"],
  // CLDR #1636 - #1639
  abbreviated: ["காலா.1", "காலா.2", "காலா.3", "காலா.4"],
  // CLDR #1628 - #1631
  wide: [
    "ஒன்றாம் காலாண்டு",
    "இரண்டாம் காலாண்டு",
    "மூன்றாம் காலாண்டு",
    "நான்காம் காலாண்டு"
  ]
};
var monthValues74 = {
  // CLDR #700 - #711
  narrow: ["ஜ", "பி", "மா", "ஏ", "மே", "ஜூ", "ஜூ", "ஆ", "செ", "அ", "ந", "டி"],
  // CLDR #1676 - #1687
  abbreviated: [
    "ஜன.",
    "பிப்.",
    "மார்.",
    "ஏப்.",
    "மே",
    "ஜூன்",
    "ஜூலை",
    "ஆக.",
    "செப்.",
    "அக்.",
    "நவ.",
    "டிச."
  ],
  // CLDR #1652 - #1663
  wide: [
    "ஜனவரி",
    // January
    "பிப்ரவரி",
    // February
    "மார்ச்",
    // March
    "ஏப்ரல்",
    // April
    "மே",
    // May
    "ஜூன்",
    // June
    "ஜூலை",
    // July
    "ஆகஸ்ட்",
    // August
    "செப்டம்பர்",
    // September
    "அக்டோபர்",
    // October
    "நவம்பர்",
    // November
    "டிசம்பர்"
    // December
  ]
};
var dayValues74 = {
  // CLDR #1766 - #1772
  narrow: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
  // CLDR #1752 - #1758
  short: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
  // CLDR #1738 - #1744
  abbreviated: ["ஞாயி.", "திங்.", "செவ்.", "புத.", "வியா.", "வெள்.", "சனி"],
  // CLDR #1724 - #1730
  wide: [
    "ஞாயிறு",
    // Sunday
    "திங்கள்",
    // Monday
    "செவ்வாய்",
    // Tuesday
    "புதன்",
    // Wednesday
    "வியாழன்",
    // Thursday
    "வெள்ளி",
    // Friday
    "சனி"
    // Saturday
  ]
};
var dayPeriodValues74 = {
  narrow: {
    am: "மு.ப",
    pm: "பி.ப",
    midnight: "நள்.",
    noon: "நண்.",
    morning: "கா.",
    afternoon: "மதி.",
    evening: "மா.",
    night: "இர."
  },
  abbreviated: {
    am: "முற்பகல்",
    pm: "பிற்பகல்",
    midnight: "நள்ளிரவு",
    noon: "நண்பகல்",
    morning: "காலை",
    afternoon: "மதியம்",
    evening: "மாலை",
    night: "இரவு"
  },
  wide: {
    am: "முற்பகல்",
    pm: "பிற்பகல்",
    midnight: "நள்ளிரவு",
    noon: "நண்பகல்",
    morning: "காலை",
    afternoon: "மதியம்",
    evening: "மாலை",
    night: "இரவு"
  }
};
var formattingDayPeriodValues58 = {
  narrow: {
    am: "மு.ப",
    pm: "பி.ப",
    midnight: "நள்.",
    noon: "நண்.",
    morning: "கா.",
    afternoon: "மதி.",
    evening: "மா.",
    night: "இர."
  },
  abbreviated: {
    am: "முற்பகல்",
    pm: "பிற்பகல்",
    midnight: "நள்ளிரவு",
    noon: "நண்பகல்",
    morning: "காலை",
    afternoon: "மதியம்",
    evening: "மாலை",
    night: "இரவு"
  },
  wide: {
    am: "முற்பகல்",
    pm: "பிற்பகல்",
    midnight: "நள்ளிரவு",
    noon: "நண்பகல்",
    morning: "காலை",
    afternoon: "மதியம்",
    evening: "மாலை",
    night: "இரவு"
  }
};
var ordinalNumber74 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize74 = {
  ordinalNumber: ordinalNumber74,
  era: buildLocalizeFn({
    values: eraValues74,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues74,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues74,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues74,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues74,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues58,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ta/_lib/match.js
var matchOrdinalNumberPattern73 = /^(\d+)(வது)?/i;
var parseOrdinalNumberPattern73 = /\d+/i;
var matchEraPatterns73 = {
  narrow: /^(கி.மு.|கி.பி.)/i,
  abbreviated: /^(கி\.?\s?மு\.?|கி\.?\s?பி\.?)/,
  wide: /^(கிறிஸ்துவுக்கு\sமுன்|அன்னோ\sடோமினி)/i
};
var parseEraPatterns73 = {
  any: [/கி\.?\s?மு\.?/, /கி\.?\s?பி\.?/]
};
var matchQuarterPatterns73 = {
  narrow: /^[1234]/i,
  abbreviated: /^காலா.[1234]/i,
  wide: /^(ஒன்றாம்|இரண்டாம்|மூன்றாம்|நான்காம்) காலாண்டு/i
};
var parseQuarterPatterns73 = {
  narrow: [/1/i, /2/i, /3/i, /4/i],
  any: [
    /(1|காலா.1|ஒன்றாம்)/i,
    /(2|காலா.2|இரண்டாம்)/i,
    /(3|காலா.3|மூன்றாம்)/i,
    /(4|காலா.4|நான்காம்)/i
  ]
};
var matchMonthPatterns73 = {
  narrow: /^(ஜ|பி|மா|ஏ|மே|ஜூ|ஆ|செ|அ|ந|டி)$/i,
  abbreviated: /^(ஜன.|பிப்.|மார்.|ஏப்.|மே|ஜூன்|ஜூலை|ஆக.|செப்.|அக்.|நவ.|டிச.)/i,
  wide: /^(ஜனவரி|பிப்ரவரி|மார்ச்|ஏப்ரல்|மே|ஜூன்|ஜூலை|ஆகஸ்ட்|செப்டம்பர்|அக்டோபர்|நவம்பர்|டிசம்பர்)/i
};
var parseMonthPatterns73 = {
  narrow: [
    /^ஜ$/i,
    /^பி/i,
    /^மா/i,
    /^ஏ/i,
    /^மே/i,
    /^ஜூ/i,
    /^ஜூ/i,
    /^ஆ/i,
    /^செ/i,
    /^அ/i,
    /^ந/i,
    /^டி/i
  ],
  any: [
    /^ஜன/i,
    /^பி/i,
    /^மா/i,
    /^ஏ/i,
    /^மே/i,
    /^ஜூன்/i,
    /^ஜூலை/i,
    /^ஆ/i,
    /^செ/i,
    /^அ/i,
    /^ந/i,
    /^டி/i
  ]
};
var matchDayPatterns73 = {
  narrow: /^(ஞா|தி|செ|பு|வி|வெ|ச)/i,
  short: /^(ஞா|தி|செ|பு|வி|வெ|ச)/i,
  abbreviated: /^(ஞாயி.|திங்.|செவ்.|புத.|வியா.|வெள்.|சனி)/i,
  wide: /^(ஞாயிறு|திங்கள்|செவ்வாய்|புதன்|வியாழன்|வெள்ளி|சனி)/i
};
var parseDayPatterns73 = {
  narrow: [/^ஞா/i, /^தி/i, /^செ/i, /^பு/i, /^வி/i, /^வெ/i, /^ச/i],
  any: [/^ஞா/i, /^தி/i, /^செ/i, /^பு/i, /^வி/i, /^வெ/i, /^ச/i]
};
var matchDayPeriodPatterns73 = {
  narrow: /^(மு.ப|பி.ப|நள்|நண்|காலை|மதியம்|மாலை|இரவு)/i,
  any: /^(மு.ப|பி.ப|முற்பகல்|பிற்பகல்|நள்ளிரவு|நண்பகல்|காலை|மதியம்|மாலை|இரவு)/i
};
var parseDayPeriodPatterns73 = {
  any: {
    am: /^மு/i,
    pm: /^பி/i,
    midnight: /^நள்/i,
    noon: /^நண்/i,
    morning: /காலை/i,
    afternoon: /மதியம்/i,
    evening: /மாலை/i,
    night: /இரவு/i
  }
};
var match73 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern73,
    parsePattern: parseOrdinalNumberPattern73,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns73,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns73,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns73,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns73,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns73,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns73,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns73,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns73,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns73,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns73,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/te/_lib/formatLong.js
var dateFormats83 = {
  full: "d, MMMM y, EEEE",
  long: "d MMMM, y",
  medium: "d MMM, y",
  short: "dd-MM-yy"
};
var timeFormats83 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats83 = {
  full: "{{date}} {{time}}'కి'",
  long: "{{date}} {{time}}'కి'",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong83 = {
  date: buildFormatLongFn({
    formats: dateFormats83,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats83,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats83,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/te/_lib/localize.js
var eraValues75 = {
  narrow: ["క్రీ.పూ.", "క్రీ.శ."],
  abbreviated: ["క్రీ.పూ.", "క్రీ.శ."],
  wide: ["క్రీస్తు పూర్వం", "క్రీస్తుశకం"]
};
var quarterValues75 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["త్రై1", "త్రై2", "త్రై3", "త్రై4"],
  wide: ["1వ త్రైమాసికం", "2వ త్రైమాసికం", "3వ త్రైమాసికం", "4వ త్రైమాసికం"]
};
var monthValues75 = {
  narrow: ["జ", "ఫి", "మా", "ఏ", "మే", "జూ", "జు", "ఆ", "సె", "అ", "న", "డి"],
  abbreviated: [
    "జన",
    "ఫిబ్ర",
    "మార్చి",
    "ఏప్రి",
    "మే",
    "జూన్",
    "జులై",
    "ఆగ",
    "సెప్టెం",
    "అక్టో",
    "నవం",
    "డిసెం"
  ],
  wide: [
    "జనవరి",
    "ఫిబ్రవరి",
    "మార్చి",
    "ఏప్రిల్",
    "మే",
    "జూన్",
    "జులై",
    "ఆగస్టు",
    "సెప్టెంబర్",
    "అక్టోబర్",
    "నవంబర్",
    "డిసెంబర్"
  ]
};
var dayValues75 = {
  narrow: ["ఆ", "సో", "మ", "బు", "గు", "శు", "శ"],
  short: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
  abbreviated: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
  wide: [
    "ఆదివారం",
    "సోమవారం",
    "మంగళవారం",
    "బుధవారం",
    "గురువారం",
    "శుక్రవారం",
    "శనివారం"
  ]
};
var dayPeriodValues75 = {
  narrow: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  },
  abbreviated: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  },
  wide: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  }
};
var formattingDayPeriodValues59 = {
  narrow: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  },
  abbreviated: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  },
  wide: {
    am: "పూర్వాహ్నం",
    pm: "అపరాహ్నం",
    midnight: "అర్ధరాత్రి",
    noon: "మిట్టమధ్యాహ్నం",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి"
  }
};
var ordinalNumber75 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "వ";
};
var localize75 = {
  ordinalNumber: ordinalNumber75,
  era: buildLocalizeFn({
    values: eraValues75,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues75,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues75,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues75,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues75,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues59,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/te/_lib/match.js
var matchOrdinalNumberPattern74 = /^(\d+)(వ)?/i;
var parseOrdinalNumberPattern74 = /\d+/i;
var matchEraPatterns74 = {
  narrow: /^(క్రీ\.పూ\.|క్రీ\.శ\.)/i,
  abbreviated: /^(క్రీ\.?\s?పూ\.?|ప్ర\.?\s?శ\.?\s?పూ\.?|క్రీ\.?\s?శ\.?|సా\.?\s?శ\.?)/i,
  wide: /^(క్రీస్తు పూర్వం|ప్రస్తుత శకానికి పూర్వం|క్రీస్తు శకం|ప్రస్తుత శకం)/i
};
var parseEraPatterns74 = {
  any: [/^(పూ|శ)/i, /^సా/i]
};
var matchQuarterPatterns74 = {
  narrow: /^[1234]/i,
  abbreviated: /^త్రై[1234]/i,
  wide: /^[1234](వ)? త్రైమాసికం/i
};
var parseQuarterPatterns74 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns74 = {
  narrow: /^(జూ|జు|జ|ఫి|మా|ఏ|మే|ఆ|సె|అ|న|డి)/i,
  abbreviated: /^(జన|ఫిబ్ర|మార్చి|ఏప్రి|మే|జూన్|జులై|ఆగ|సెప్|అక్టో|నవ|డిసె)/i,
  wide: /^(జనవరి|ఫిబ్రవరి|మార్చి|ఏప్రిల్|మే|జూన్|జులై|ఆగస్టు|సెప్టెంబర్|అక్టోబర్|నవంబర్|డిసెంబర్)/i
};
var parseMonthPatterns74 = {
  narrow: [
    /^జ/i,
    /^ఫి/i,
    /^మా/i,
    /^ఏ/i,
    /^మే/i,
    /^జూ/i,
    /^జు/i,
    /^ఆ/i,
    /^సె/i,
    /^అ/i,
    /^న/i,
    /^డి/i
  ],
  any: [
    /^జన/i,
    /^ఫి/i,
    /^మా/i,
    /^ఏ/i,
    /^మే/i,
    /^జూన్/i,
    /^జులై/i,
    /^ఆగ/i,
    /^సె/i,
    /^అ/i,
    /^న/i,
    /^డి/i
  ]
};
var matchDayPatterns74 = {
  narrow: /^(ఆ|సో|మ|బు|గు|శు|శ)/i,
  short: /^(ఆది|సోమ|మం|బుధ|గురు|శుక్ర|శని)/i,
  abbreviated: /^(ఆది|సోమ|మం|బుధ|గురు|శుక్ర|శని)/i,
  wide: /^(ఆదివారం|సోమవారం|మంగళవారం|బుధవారం|గురువారం|శుక్రవారం|శనివారం)/i
};
var parseDayPatterns74 = {
  narrow: [/^ఆ/i, /^సో/i, /^మ/i, /^బు/i, /^గు/i, /^శు/i, /^శ/i],
  any: [/^ఆది/i, /^సోమ/i, /^మం/i, /^బుధ/i, /^గురు/i, /^శుక్ర/i, /^శని/i]
};
var matchDayPeriodPatterns74 = {
  narrow: /^(పూర్వాహ్నం|అపరాహ్నం|అర్ధరాత్రి|మిట్టమధ్యాహ్నం|ఉదయం|మధ్యాహ్నం|సాయంత్రం|రాత్రి)/i,
  any: /^(పూర్వాహ్నం|అపరాహ్నం|అర్ధరాత్రి|మిట్టమధ్యాహ్నం|ఉదయం|మధ్యాహ్నం|సాయంత్రం|రాత్రి)/i
};
var parseDayPeriodPatterns74 = {
  any: {
    am: /^పూర్వాహ్నం/i,
    pm: /^అపరాహ్నం/i,
    midnight: /^అర్ధ/i,
    noon: /^మిట్ట/i,
    morning: /ఉదయం/i,
    afternoon: /మధ్యాహ్నం/i,
    evening: /సాయంత్రం/i,
    night: /రాత్రి/i
  }
};
var match74 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern74,
    parsePattern: parseOrdinalNumberPattern74,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns74,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns74,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns74,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns74,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns74,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns74,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns74,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns74,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns74,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns74,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/th/_lib/formatLong.js
var dateFormats84 = {
  full: "วันEEEEที่ do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "dd/MM/yyyy"
};
var timeFormats84 = {
  full: "H:mm:ss น. zzzz",
  long: "H:mm:ss น. z",
  medium: "H:mm:ss น.",
  short: "H:mm น."
};
var dateTimeFormats84 = {
  full: "{{date}} 'เวลา' {{time}}",
  long: "{{date}} 'เวลา' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong84 = {
  date: buildFormatLongFn({
    formats: dateFormats84,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats84,
    defaultWidth: "medium"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats84,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/th/_lib/localize.js
var eraValues76 = {
  narrow: ["B", "คศ"],
  abbreviated: ["BC", "ค.ศ."],
  wide: ["ปีก่อนคริสตกาล", "คริสต์ศักราช"]
};
var quarterValues76 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["ไตรมาสแรก", "ไตรมาสที่สอง", "ไตรมาสที่สาม", "ไตรมาสที่สี่"]
};
var dayValues76 = {
  narrow: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
  short: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
  abbreviated: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
  wide: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"]
};
var monthValues76 = {
  narrow: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค."
  ],
  abbreviated: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค."
  ],
  wide: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ]
};
var dayPeriodValues76 = {
  narrow: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "เช้า",
    afternoon: "บ่าย",
    evening: "เย็น",
    night: "กลางคืน"
  },
  abbreviated: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "เช้า",
    afternoon: "บ่าย",
    evening: "เย็น",
    night: "กลางคืน"
  },
  wide: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "เช้า",
    afternoon: "บ่าย",
    evening: "เย็น",
    night: "กลางคืน"
  }
};
var formattingDayPeriodValues60 = {
  narrow: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "ตอนเช้า",
    afternoon: "ตอนกลางวัน",
    evening: "ตอนเย็น",
    night: "ตอนกลางคืน"
  },
  abbreviated: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "ตอนเช้า",
    afternoon: "ตอนกลางวัน",
    evening: "ตอนเย็น",
    night: "ตอนกลางคืน"
  },
  wide: {
    am: "ก่อนเที่ยง",
    pm: "หลังเที่ยง",
    midnight: "เที่ยงคืน",
    noon: "เที่ยง",
    morning: "ตอนเช้า",
    afternoon: "ตอนกลางวัน",
    evening: "ตอนเย็น",
    night: "ตอนกลางคืน"
  }
};
var ordinalNumber76 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize76 = {
  ordinalNumber: ordinalNumber76,
  era: buildLocalizeFn({
    values: eraValues76,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues76,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues76,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues76,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues76,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues60,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/th/_lib/match.js
var matchOrdinalNumberPattern75 = /^\d+/i;
var parseOrdinalNumberPattern75 = /\d+/i;
var matchEraPatterns75 = {
  narrow: /^([bB]|[aA]|คศ)/i,
  abbreviated: /^([bB]\.?\s?[cC]\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?|ค\.?ศ\.?)/i,
  wide: /^(ก่อนคริสตกาล|คริสต์ศักราช|คริสตกาล)/i
};
var parseEraPatterns75 = {
  any: [/^[bB]/i, /^(^[aA]|ค\.?ศ\.?|คริสตกาล|คริสต์ศักราช|)/i]
};
var matchQuarterPatterns75 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^ไตรมาส(ที่)? ?[1234]/i
};
var parseQuarterPatterns75 = {
  any: [/(1|แรก|หนึ่ง)/i, /(2|สอง)/i, /(3|สาม)/i, /(4|สี่)/i]
};
var matchMonthPatterns75 = {
  narrow: /^(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)/i,
  abbreviated: /^(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?')/i,
  wide: /^(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/i
};
var parseMonthPatterns75 = {
  wide: [
    /^มก/i,
    /^กุม/i,
    /^มี/i,
    /^เม/i,
    /^พฤษ/i,
    /^มิ/i,
    /^กรก/i,
    /^ส/i,
    /^กัน/i,
    /^ต/i,
    /^พฤศ/i,
    /^ธ/i
  ],
  any: [
    /^ม\.?ค\.?/i,
    /^ก\.?พ\.?/i,
    /^มี\.?ค\.?/i,
    /^เม\.?ย\.?/i,
    /^พ\.?ค\.?/i,
    /^มิ\.?ย\.?/i,
    /^ก\.?ค\.?/i,
    /^ส\.?ค\.?/i,
    /^ก\.?ย\.?/i,
    /^ต\.?ค\.?/i,
    /^พ\.?ย\.?/i,
    /^ธ\.?ค\.?/i
  ]
};
var matchDayPatterns75 = {
  narrow: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
  short: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
  abbreviated: /^(อา\.?|จ\.?|อ\.?|พฤ\.?|พ\.?|ศ\.?|ส\.?)/i,
  wide: /^(อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์)/i
};
var parseDayPatterns75 = {
  wide: [/^อา/i, /^จั/i, /^อั/i, /^พุธ/i, /^พฤ/i, /^ศ/i, /^เส/i],
  any: [/^อา/i, /^จ/i, /^อ/i, /^พ(?!ฤ)/i, /^พฤ/i, /^ศ/i, /^ส/i]
};
var matchDayPeriodPatterns75 = {
  any: /^(ก่อนเที่ยง|หลังเที่ยง|เที่ยงคืน|เที่ยง|(ตอน.*?)?.*(เที่ยง|เช้า|บ่าย|เย็น|กลางคืน))/i
};
var parseDayPeriodPatterns75 = {
  any: {
    am: /^ก่อนเที่ยง/i,
    pm: /^หลังเที่ยง/i,
    midnight: /^เที่ยงคืน/i,
    noon: /^เที่ยง/i,
    morning: /เช้า/i,
    afternoon: /บ่าย/i,
    evening: /เย็น/i,
    night: /กลางคืน/i
  }
};
var match75 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern75,
    parsePattern: parseOrdinalNumberPattern75,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns75,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns75,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns75,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns75,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns75,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns75,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns75,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns75,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns75,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns75,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/tr/_lib/formatLong.js
var dateFormats85 = {
  full: "d MMMM y EEEE",
  long: "d MMMM y",
  medium: "d MMM y",
  short: "dd.MM.yyyy"
};
var timeFormats85 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats85 = {
  full: "{{date}} 'saat' {{time}}",
  long: "{{date}} 'saat' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong85 = {
  date: buildFormatLongFn({
    formats: dateFormats85,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats85,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats85,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/tr/_lib/localize.js
var eraValues77 = {
  narrow: ["MÖ", "MS"],
  abbreviated: ["MÖ", "MS"],
  wide: ["Milattan Önce", "Milattan Sonra"]
};
var quarterValues77 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1Ç", "2Ç", "3Ç", "4Ç"],
  wide: ["İlk çeyrek", "İkinci Çeyrek", "Üçüncü çeyrek", "Son çeyrek"]
};
var monthValues77 = {
  narrow: ["O", "Ş", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"],
  abbreviated: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara"
  ],
  wide: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
  ]
};
var dayValues77 = {
  narrow: ["P", "P", "S", "Ç", "P", "C", "C"],
  short: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
  abbreviated: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"],
  wide: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi"
  ]
};
var dayPeriodValues77 = {
  narrow: {
    am: "öö",
    pm: "ös",
    midnight: "gy",
    noon: "ö",
    morning: "sa",
    afternoon: "ös",
    evening: "ak",
    night: "ge"
  },
  abbreviated: {
    am: "ÖÖ",
    pm: "ÖS",
    midnight: "gece yarısı",
    noon: "öğle",
    morning: "sabah",
    afternoon: "öğleden sonra",
    evening: "akşam",
    night: "gece"
  },
  wide: {
    am: "Ö.Ö.",
    pm: "Ö.S.",
    midnight: "gece yarısı",
    noon: "öğle",
    morning: "sabah",
    afternoon: "öğleden sonra",
    evening: "akşam",
    night: "gece"
  }
};
var formattingDayPeriodValues61 = {
  narrow: {
    am: "öö",
    pm: "ös",
    midnight: "gy",
    noon: "ö",
    morning: "sa",
    afternoon: "ös",
    evening: "ak",
    night: "ge"
  },
  abbreviated: {
    am: "ÖÖ",
    pm: "ÖS",
    midnight: "gece yarısı",
    noon: "öğlen",
    morning: "sabahleyin",
    afternoon: "öğleden sonra",
    evening: "akşamleyin",
    night: "geceleyin"
  },
  wide: {
    am: "ö.ö.",
    pm: "ö.s.",
    midnight: "gece yarısı",
    noon: "öğlen",
    morning: "sabahleyin",
    afternoon: "öğleden sonra",
    evening: "akşamleyin",
    night: "geceleyin"
  }
};
var ordinalNumber77 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + ".";
};
var localize77 = {
  ordinalNumber: ordinalNumber77,
  era: buildLocalizeFn({
    values: eraValues77,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues77,
    defaultWidth: "wide",
    argumentCallback: (quarter) => Number(quarter) - 1
  }),
  month: buildLocalizeFn({
    values: monthValues77,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues77,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues77,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues61,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/tr/_lib/match.js
var matchOrdinalNumberPattern76 = /^(\d+)(\.)?/i;
var parseOrdinalNumberPattern76 = /\d+/i;
var matchEraPatterns76 = {
  narrow: /^(mö|ms)/i,
  abbreviated: /^(mö|ms)/i,
  wide: /^(milattan önce|milattan sonra)/i
};
var parseEraPatterns76 = {
  any: [/(^mö|^milattan önce)/i, /(^ms|^milattan sonra)/i]
};
var matchQuarterPatterns76 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]ç/i,
  wide: /^((i|İ)lk|(i|İ)kinci|üçüncü|son) çeyrek/i
};
var parseQuarterPatterns76 = {
  any: [/1/i, /2/i, /3/i, /4/i],
  abbreviated: [/1ç/i, /2ç/i, /3ç/i, /4ç/i],
  wide: [
    /^(i|İ)lk çeyrek/i,
    /(i|İ)kinci çeyrek/i,
    /üçüncü çeyrek/i,
    /son çeyrek/i
  ]
};
var matchMonthPatterns76 = {
  narrow: /^[oşmnhtaek]/i,
  abbreviated: /^(oca|şub|mar|nis|may|haz|tem|ağu|eyl|eki|kas|ara)/i,
  wide: /^(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i
};
var parseMonthPatterns76 = {
  narrow: [
    /^o/i,
    /^ş/i,
    /^m/i,
    /^n/i,
    /^m/i,
    /^h/i,
    /^t/i,
    /^a/i,
    /^e/i,
    /^e/i,
    /^k/i,
    /^a/i
  ],
  any: [
    /^o/i,
    /^ş/i,
    /^mar/i,
    /^n/i,
    /^may/i,
    /^h/i,
    /^t/i,
    /^ağ/i,
    /^ey/i,
    /^ek/i,
    /^k/i,
    /^ar/i
  ]
};
var matchDayPatterns76 = {
  narrow: /^[psçc]/i,
  short: /^(pz|pt|sa|ça|pe|cu|ct)/i,
  abbreviated: /^(paz|pzt|sal|çar|per|cum|cts)/i,
  wide: /^(pazar(?!tesi)|pazartesi|salı|çarşamba|perşembe|cuma(?!rtesi)|cumartesi)/i
};
var parseDayPatterns76 = {
  narrow: [/^p/i, /^p/i, /^s/i, /^ç/i, /^p/i, /^c/i, /^c/i],
  any: [/^pz/i, /^pt/i, /^sa/i, /^ça/i, /^pe/i, /^cu/i, /^ct/i],
  wide: [
    /^pazar(?!tesi)/i,
    /^pazartesi/i,
    /^salı/i,
    /^çarşamba/i,
    /^perşembe/i,
    /^cuma(?!rtesi)/i,
    /^cumartesi/i
  ]
};
var matchDayPeriodPatterns76 = {
  narrow: /^(öö|ös|gy|ö|sa|ös|ak|ge)/i,
  any: /^(ö\.?\s?[ös]\.?|öğleden sonra|gece yarısı|öğle|(sabah|öğ|akşam|gece)(leyin))/i
};
var parseDayPeriodPatterns76 = {
  any: {
    am: /^ö\.?ö\.?/i,
    pm: /^ö\.?s\.?/i,
    midnight: /^(gy|gece yarısı)/i,
    noon: /^öğ/i,
    morning: /^sa/i,
    afternoon: /^öğleden sonra/i,
    evening: /^ak/i,
    night: /^ge/i
  }
};
var match76 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern76,
    parsePattern: parseOrdinalNumberPattern76,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns76,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns76,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns76,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns76,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns76,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns76,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns76,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns76,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns76,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns76,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/ug/_lib/formatLong.js
var dateFormats86 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats86 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats86 = {
  full: "{{date}} 'دە' {{time}}",
  long: "{{date}} 'دە' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong86 = {
  date: buildFormatLongFn({
    formats: dateFormats86,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats86,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats86,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/ug/_lib/localize.js
var eraValues78 = {
  narrow: ["ب", "ك"],
  abbreviated: ["ب", "ك"],
  wide: ["مىيلادىدىن بۇرۇن", "مىيلادىدىن كىيىن"]
};
var quarterValues78 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1", "2", "3", "4"],
  wide: ["بىرىنجى چارەك", "ئىككىنجى چارەك", "ئۈچىنجى چارەك", "تۆتىنجى چارەك"]
};
var monthValues78 = {
  narrow: ["ي", "ف", "م", "ا", "م", "ى", "ى", "ا", "س", "ۆ", "ن", "د"],
  abbreviated: [
    "يانۋار",
    "فېۋىرال",
    "مارت",
    "ئاپرىل",
    "ماي",
    "ئىيۇن",
    "ئىيول",
    "ئاۋغۇست",
    "سىنتەبىر",
    "ئۆكتەبىر",
    "نويابىر",
    "دىكابىر"
  ],
  wide: [
    "يانۋار",
    "فېۋىرال",
    "مارت",
    "ئاپرىل",
    "ماي",
    "ئىيۇن",
    "ئىيول",
    "ئاۋغۇست",
    "سىنتەبىر",
    "ئۆكتەبىر",
    "نويابىر",
    "دىكابىر"
  ]
};
var dayValues78 = {
  narrow: ["ي", "د", "س", "چ", "پ", "ج", "ش"],
  short: ["ي", "د", "س", "چ", "پ", "ج", "ش"],
  abbreviated: [
    "يەكشەنبە",
    "دۈشەنبە",
    "سەيشەنبە",
    "چارشەنبە",
    "پەيشەنبە",
    "جۈمە",
    "شەنبە"
  ],
  wide: [
    "يەكشەنبە",
    "دۈشەنبە",
    "سەيشەنبە",
    "چارشەنبە",
    "پەيشەنبە",
    "جۈمە",
    "شەنبە"
  ]
};
var dayPeriodValues78 = {
  narrow: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەن",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشىم",
    night: "كىچە"
  },
  abbreviated: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەن",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشىم",
    night: "كىچە"
  },
  wide: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەن",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشىم",
    night: "كىچە"
  }
};
var formattingDayPeriodValues62 = {
  narrow: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەندە",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشامدا",
    night: "كىچىدە"
  },
  abbreviated: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەندە",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشامدا",
    night: "كىچىدە"
  },
  wide: {
    am: "ئە",
    pm: "چ",
    midnight: "ك",
    noon: "چ",
    morning: "ئەتىگەندە",
    afternoon: "چۈشتىن كىيىن",
    evening: "ئاخشامدا",
    night: "كىچىدە"
  }
};
var ordinalNumber78 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize78 = {
  ordinalNumber: ordinalNumber78,
  era: buildLocalizeFn({
    values: eraValues78,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues78,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues78,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues78,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues78,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues62,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/ug/_lib/match.js
var matchOrdinalNumberPattern77 = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern77 = /\d+/i;
var matchEraPatterns77 = {
  narrow: /^(ب|ك)/i,
  wide: /^(مىيلادىدىن بۇرۇن|مىيلادىدىن كىيىن)/i
};
var parseEraPatterns77 = {
  any: [/^بۇرۇن/i, /^كىيىن/i]
};
var matchQuarterPatterns77 = {
  narrow: /^[1234]/i,
  abbreviated: /^چ[1234]/i,
  wide: /^چارەك [1234]/i
};
var parseQuarterPatterns77 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns77 = {
  // eslint-disable-next-line no-misleading-character-class
  narrow: /^[يفمئامئ‍ئاسۆند]/i,
  abbreviated: /^(يانۋار|فېۋىرال|مارت|ئاپرىل|ماي|ئىيۇن|ئىيول|ئاۋغۇست|سىنتەبىر|ئۆكتەبىر|نويابىر|دىكابىر)/i,
  wide: /^(يانۋار|فېۋىرال|مارت|ئاپرىل|ماي|ئىيۇن|ئىيول|ئاۋغۇست|سىنتەبىر|ئۆكتەبىر|نويابىر|دىكابىر)/i
};
var parseMonthPatterns77 = {
  narrow: [
    /^ي/i,
    /^ف/i,
    /^م/i,
    /^ا/i,
    /^م/i,
    /^ى‍/i,
    /^ى‍/i,
    /^ا‍/i,
    /^س/i,
    /^ۆ/i,
    /^ن/i,
    /^د/i
  ],
  any: [
    /^يان/i,
    /^فېۋ/i,
    /^مار/i,
    /^ئاپ/i,
    /^ماي/i,
    /^ئىيۇن/i,
    /^ئىيول/i,
    /^ئاۋ/i,
    /^سىن/i,
    /^ئۆك/i,
    /^نوي/i,
    /^دىك/i
  ]
};
var matchDayPatterns77 = {
  narrow: /^[دسچپجشي]/i,
  short: /^(يە|دۈ|سە|چا|پە|جۈ|شە)/i,
  abbreviated: /^(يە|دۈ|سە|چا|پە|جۈ|شە)/i,
  wide: /^(يەكشەنبە|دۈشەنبە|سەيشەنبە|چارشەنبە|پەيشەنبە|جۈمە|شەنبە)/i
};
var parseDayPatterns77 = {
  narrow: [/^ي/i, /^د/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
  any: [/^ي/i, /^د/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i]
};
var matchDayPeriodPatterns77 = {
  narrow: /^(ئە|چ|ك|چ|(دە|ئەتىگەن) ( ئە‍|چۈشتىن كىيىن|ئاخشىم|كىچە))/i,
  any: /^(ئە|چ|ك|چ|(دە|ئەتىگەن) ( ئە‍|چۈشتىن كىيىن|ئاخشىم|كىچە))/i
};
var parseDayPeriodPatterns77 = {
  any: {
    am: /^ئە/i,
    pm: /^چ/i,
    midnight: /^ك/i,
    noon: /^چ/i,
    morning: /ئەتىگەن/i,
    afternoon: /چۈشتىن كىيىن/i,
    evening: /ئاخشىم/i,
    night: /كىچە/i
  }
};
var match77 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern77,
    parsePattern: parseOrdinalNumberPattern77,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns77,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns77,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns77,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns77,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns77,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns77,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns77,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns77,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns77,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns77,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/uk/_lib/formatDistance.js
function declension4(scheme, count) {
  if (scheme.one !== void 0 && count === 1) {
    return scheme.one;
  }
  const rem10 = count % 10;
  const rem100 = count % 100;
  if (rem10 === 1 && rem100 !== 11) {
    return scheme.singularNominative.replace("{{count}}", String(count));
  } else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 > 20)) {
    return scheme.singularGenitive.replace("{{count}}", String(count));
  } else {
    return scheme.pluralGenitive.replace("{{count}}", String(count));
  }
}
function buildLocalizeTokenFn5(scheme) {
  return (count, options) => {
    if (options && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        if (scheme.future) {
          return declension4(scheme.future, count);
        } else {
          return "за " + declension4(scheme.regular, count);
        }
      } else {
        if (scheme.past) {
          return declension4(scheme.past, count);
        } else {
          return declension4(scheme.regular, count) + " тому";
        }
      }
    } else {
      return declension4(scheme.regular, count);
    }
  };
}
var halfAtMinute = (_, options) => {
  if (options && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "за півхвилини";
    } else {
      return "півхвилини тому";
    }
  }
  return "півхвилини";
};
var formatDistanceLocale6 = {
  lessThanXSeconds: buildLocalizeTokenFn5({
    regular: {
      one: "менше секунди",
      singularNominative: "менше {{count}} секунди",
      singularGenitive: "менше {{count}} секунд",
      pluralGenitive: "менше {{count}} секунд"
    },
    future: {
      one: "менше, ніж за секунду",
      singularNominative: "менше, ніж за {{count}} секунду",
      singularGenitive: "менше, ніж за {{count}} секунди",
      pluralGenitive: "менше, ніж за {{count}} секунд"
    }
  }),
  xSeconds: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} секунда",
      singularGenitive: "{{count}} секунди",
      pluralGenitive: "{{count}} секунд"
    },
    past: {
      singularNominative: "{{count}} секунду тому",
      singularGenitive: "{{count}} секунди тому",
      pluralGenitive: "{{count}} секунд тому"
    },
    future: {
      singularNominative: "за {{count}} секунду",
      singularGenitive: "за {{count}} секунди",
      pluralGenitive: "за {{count}} секунд"
    }
  }),
  halfAMinute: halfAtMinute,
  lessThanXMinutes: buildLocalizeTokenFn5({
    regular: {
      one: "менше хвилини",
      singularNominative: "менше {{count}} хвилини",
      singularGenitive: "менше {{count}} хвилин",
      pluralGenitive: "менше {{count}} хвилин"
    },
    future: {
      one: "менше, ніж за хвилину",
      singularNominative: "менше, ніж за {{count}} хвилину",
      singularGenitive: "менше, ніж за {{count}} хвилини",
      pluralGenitive: "менше, ніж за {{count}} хвилин"
    }
  }),
  xMinutes: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} хвилина",
      singularGenitive: "{{count}} хвилини",
      pluralGenitive: "{{count}} хвилин"
    },
    past: {
      singularNominative: "{{count}} хвилину тому",
      singularGenitive: "{{count}} хвилини тому",
      pluralGenitive: "{{count}} хвилин тому"
    },
    future: {
      singularNominative: "за {{count}} хвилину",
      singularGenitive: "за {{count}} хвилини",
      pluralGenitive: "за {{count}} хвилин"
    }
  }),
  aboutXHours: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "близько {{count}} години",
      singularGenitive: "близько {{count}} годин",
      pluralGenitive: "близько {{count}} годин"
    },
    future: {
      singularNominative: "приблизно за {{count}} годину",
      singularGenitive: "приблизно за {{count}} години",
      pluralGenitive: "приблизно за {{count}} годин"
    }
  }),
  xHours: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} годину",
      singularGenitive: "{{count}} години",
      pluralGenitive: "{{count}} годин"
    }
  }),
  xDays: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} день",
      singularGenitive: "{{count}} днi",
      pluralGenitive: "{{count}} днів"
    }
  }),
  aboutXWeeks: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "близько {{count}} тижня",
      singularGenitive: "близько {{count}} тижнів",
      pluralGenitive: "близько {{count}} тижнів"
    },
    future: {
      singularNominative: "приблизно за {{count}} тиждень",
      singularGenitive: "приблизно за {{count}} тижні",
      pluralGenitive: "приблизно за {{count}} тижнів"
    }
  }),
  xWeeks: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} тиждень",
      singularGenitive: "{{count}} тижні",
      pluralGenitive: "{{count}} тижнів"
    }
  }),
  aboutXMonths: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "близько {{count}} місяця",
      singularGenitive: "близько {{count}} місяців",
      pluralGenitive: "близько {{count}} місяців"
    },
    future: {
      singularNominative: "приблизно за {{count}} місяць",
      singularGenitive: "приблизно за {{count}} місяці",
      pluralGenitive: "приблизно за {{count}} місяців"
    }
  }),
  xMonths: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} місяць",
      singularGenitive: "{{count}} місяці",
      pluralGenitive: "{{count}} місяців"
    }
  }),
  aboutXYears: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "близько {{count}} року",
      singularGenitive: "близько {{count}} років",
      pluralGenitive: "близько {{count}} років"
    },
    future: {
      singularNominative: "приблизно за {{count}} рік",
      singularGenitive: "приблизно за {{count}} роки",
      pluralGenitive: "приблизно за {{count}} років"
    }
  }),
  xYears: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "{{count}} рік",
      singularGenitive: "{{count}} роки",
      pluralGenitive: "{{count}} років"
    }
  }),
  overXYears: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "більше {{count}} року",
      singularGenitive: "більше {{count}} років",
      pluralGenitive: "більше {{count}} років"
    },
    future: {
      singularNominative: "більше, ніж за {{count}} рік",
      singularGenitive: "більше, ніж за {{count}} роки",
      pluralGenitive: "більше, ніж за {{count}} років"
    }
  }),
  almostXYears: buildLocalizeTokenFn5({
    regular: {
      singularNominative: "майже {{count}} рік",
      singularGenitive: "майже {{count}} роки",
      pluralGenitive: "майже {{count}} років"
    },
    future: {
      singularNominative: "майже за {{count}} рік",
      singularGenitive: "майже за {{count}} роки",
      pluralGenitive: "майже за {{count}} років"
    }
  })
};

// node_modules/date-fns/locale/uk/_lib/formatLong.js
var dateFormats87 = {
  full: "EEEE, do MMMM y 'р.'",
  long: "do MMMM y 'р.'",
  medium: "d MMM y 'р.'",
  short: "dd.MM.y"
};
var timeFormats87 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats87 = {
  full: "{{date}} 'о' {{time}}",
  long: "{{date}} 'о' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong87 = {
  date: buildFormatLongFn({
    formats: dateFormats87,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats87,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats87,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/uk/_lib/localize.js
var eraValues79 = {
  narrow: ["до н.е.", "н.е."],
  abbreviated: ["до н. е.", "н. е."],
  wide: ["до нашої ери", "нашої ери"]
};
var quarterValues79 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-й кв.", "2-й кв.", "3-й кв.", "4-й кв."],
  wide: ["1-й квартал", "2-й квартал", "3-й квартал", "4-й квартал"]
};
var monthValues79 = {
  // ДСТУ 3582:2013
  narrow: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"],
  abbreviated: [
    "січ.",
    "лют.",
    "берез.",
    "квіт.",
    "трав.",
    "черв.",
    "лип.",
    "серп.",
    "верес.",
    "жовт.",
    "листоп.",
    "груд."
  ],
  wide: [
    "січень",
    "лютий",
    "березень",
    "квітень",
    "травень",
    "червень",
    "липень",
    "серпень",
    "вересень",
    "жовтень",
    "листопад",
    "грудень"
  ]
};
var formattingMonthValues18 = {
  narrow: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"],
  abbreviated: [
    "січ.",
    "лют.",
    "берез.",
    "квіт.",
    "трав.",
    "черв.",
    "лип.",
    "серп.",
    "верес.",
    "жовт.",
    "листоп.",
    "груд."
  ],
  wide: [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня"
  ]
};
var dayValues79 = {
  narrow: ["Н", "П", "В", "С", "Ч", "П", "С"],
  short: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
  abbreviated: ["нед", "пон", "вів", "сер", "чтв", "птн", "суб"],
  wide: [
    "неділя",
    "понеділок",
    "вівторок",
    "середа",
    "четвер",
    "п’ятниця",
    "субота"
  ]
};
var dayPeriodValues79 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "півн.",
    noon: "пол.",
    morning: "ранок",
    afternoon: "день",
    evening: "веч.",
    night: "ніч"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "півн.",
    noon: "пол.",
    morning: "ранок",
    afternoon: "день",
    evening: "веч.",
    night: "ніч"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "північ",
    noon: "полудень",
    morning: "ранок",
    afternoon: "день",
    evening: "вечір",
    night: "ніч"
  }
};
var formattingDayPeriodValues63 = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "півн.",
    noon: "пол.",
    morning: "ранку",
    afternoon: "дня",
    evening: "веч.",
    night: "ночі"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "півн.",
    noon: "пол.",
    morning: "ранку",
    afternoon: "дня",
    evening: "веч.",
    night: "ночі"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "північ",
    noon: "полудень",
    morning: "ранку",
    afternoon: "дня",
    evening: "веч.",
    night: "ночі"
  }
};
var ordinalNumber79 = (dirtyNumber, options) => {
  const unit = String(options == null ? void 0 : options.unit);
  const number = Number(dirtyNumber);
  let suffix;
  if (unit === "date") {
    if (number === 3 || number === 23) {
      suffix = "-є";
    } else {
      suffix = "-е";
    }
  } else if (unit === "minute" || unit === "second" || unit === "hour") {
    suffix = "-а";
  } else {
    suffix = "-й";
  }
  return number + suffix;
};
var localize79 = {
  ordinalNumber: ordinalNumber79,
  era: buildLocalizeFn({
    values: eraValues79,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues79,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues79,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues18,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues79,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues79,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues63,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/uk/_lib/match.js
var matchOrdinalNumberPattern78 = /^(\d+)(-?(е|й|є|а|я))?/i;
var parseOrdinalNumberPattern78 = /\d+/i;
var matchEraPatterns78 = {
  narrow: /^((до )?н\.?\s?е\.?)/i,
  abbreviated: /^((до )?н\.?\s?е\.?)/i,
  wide: /^(до нашої ери|нашої ери|наша ера)/i
};
var parseEraPatterns78 = {
  any: [/^д/i, /^н/i]
};
var matchQuarterPatterns78 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[иі]?й?)? кв.?/i,
  wide: /^[1234](-?[иі]?й?)? квартал/i
};
var parseQuarterPatterns78 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns78 = {
  narrow: /^[слбктчвжг]/i,
  abbreviated: /^(січ|лют|бер(ез)?|квіт|трав|черв|лип|серп|вер(ес)?|жовт|лис(топ)?|груд)\.?/i,
  wide: /^(січень|січня|лютий|лютого|березень|березня|квітень|квітня|травень|травня|червня|червень|липень|липня|серпень|серпня|вересень|вересня|жовтень|жовтня|листопад[а]?|грудень|грудня)/i
};
var parseMonthPatterns78 = {
  narrow: [
    /^с/i,
    /^л/i,
    /^б/i,
    /^к/i,
    /^т/i,
    /^ч/i,
    /^л/i,
    /^с/i,
    /^в/i,
    /^ж/i,
    /^л/i,
    /^г/i
  ],
  any: [
    /^сі/i,
    /^лю/i,
    /^б/i,
    /^к/i,
    /^т/i,
    /^ч/i,
    /^лип/i,
    /^се/i,
    /^в/i,
    /^ж/i,
    /^лис/i,
    /^г/i
  ]
};
var matchDayPatterns78 = {
  narrow: /^[нпвсч]/i,
  short: /^(нд|пн|вт|ср|чт|пт|сб)\.?/i,
  abbreviated: /^(нед|пон|вів|сер|че?тв|птн?|суб)\.?/i,
  wide: /^(неділ[яі]|понеділ[ок][ка]|вівтор[ок][ка]|серед[аи]|четвер(га)?|п\W*?ятниц[яі]|субот[аи])/i
};
var parseDayPatterns78 = {
  narrow: [/^н/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^н/i, /^п[он]/i, /^в/i, /^с[ер]/i, /^ч/i, /^п\W*?[ят]/i, /^с[уб]/i]
};
var matchDayPeriodPatterns78 = {
  narrow: /^([дп]п|півн\.?|пол\.?|ранок|ранку|день|дня|веч\.?|ніч|ночі)/i,
  abbreviated: /^([дп]п|півн\.?|пол\.?|ранок|ранку|день|дня|веч\.?|ніч|ночі)/i,
  wide: /^([дп]п|північ|полудень|ранок|ранку|день|дня|вечір|вечора|ніч|ночі)/i
};
var parseDayPeriodPatterns78 = {
  any: {
    am: /^дп/i,
    pm: /^пп/i,
    midnight: /^півн/i,
    noon: /^пол/i,
    morning: /^р/i,
    afternoon: /^д[ен]/i,
    evening: /^в/i,
    night: /^н/i
  }
};
var match78 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern78,
    parsePattern: parseOrdinalNumberPattern78,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns78,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns78,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns78,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns78,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns78,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns78,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns78,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns78,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns78,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns78,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/uz/_lib/formatLong.js
var dateFormats88 = {
  full: "EEEE, do MMMM, y",
  long: "do MMMM, y",
  medium: "d MMM, y",
  short: "dd/MM/yyyy"
};
var timeFormats88 = {
  full: "h:mm:ss zzzz",
  long: "h:mm:ss z",
  medium: "h:mm:ss",
  short: "h:mm"
};
var dateTimeFormats88 = {
  any: "{{date}}, {{time}}"
};
var formatLong88 = {
  date: buildFormatLongFn({
    formats: dateFormats88,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats88,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats88,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/uz/_lib/localize.js
var eraValues80 = {
  narrow: ["M.A", "M."],
  abbreviated: ["M.A", "M."],
  wide: ["Miloddan Avvalgi", "Milodiy"]
};
var quarterValues80 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["CH.1", "CH.2", "CH.3", "CH.4"],
  wide: ["1-chi chorak", "2-chi chorak", "3-chi chorak", "4-chi chorak"]
};
var monthValues80 = {
  narrow: ["Y", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Iyun",
    "Iyul",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek"
  ],
  wide: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr"
  ]
};
var dayValues80 = {
  narrow: ["Y", "D", "S", "CH", "P", "J", "SH"],
  short: ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
  abbreviated: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
  wide: [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba"
  ]
};
var dayPeriodValues80 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "y.t",
    noon: "p.",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "yarim tun",
    noon: "peshin",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "yarim tun",
    noon: "peshin",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  }
};
var formattingDayPeriodValues64 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "y.t",
    noon: "p.",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "yarim tun",
    noon: "peshin",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "yarim tun",
    noon: "peshin",
    morning: "ertalab",
    afternoon: "tushdan keyin",
    evening: "kechqurun",
    night: "tun"
  }
};
var ordinalNumber80 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize80 = {
  ordinalNumber: ordinalNumber80,
  era: buildLocalizeFn({
    values: eraValues80,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues80,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues80,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues80,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues80,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues64,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/uz/_lib/match.js
var matchOrdinalNumberPattern79 = /^(\d+)(chi)?/i;
var parseOrdinalNumberPattern79 = /\d+/i;
var matchEraPatterns79 = {
  narrow: /^(m\.a|m\.)/i,
  abbreviated: /^(m\.a\.?\s?m\.?)/i,
  wide: /^(miloddan avval|miloddan keyin)/i
};
var parseEraPatterns79 = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns79 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](chi)? chorak/i
};
var parseQuarterPatterns79 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns79 = {
  narrow: /^[yfmasond]/i,
  abbreviated: /^(yan|fev|mar|apr|may|iyun|iyul|avg|sen|okt|noy|dek)/i,
  wide: /^(yanvar|fevral|mart|aprel|may|iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr)/i
};
var parseMonthPatterns79 = {
  narrow: [
    /^y/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^i/i,
    /^i/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ya/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^iyun/i,
    /^iyul/i,
    /^av/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns79 = {
  narrow: /^[ydschj]/i,
  short: /^(ya|du|se|cho|pa|ju|sha)/i,
  abbreviated: /^(yak|dush|sesh|chor|pay|jum|shan)/i,
  wide: /^(yakshanba|dushanba|seshanba|chorshanba|payshanba|juma|shanba)/i
};
var parseDayPatterns79 = {
  narrow: [/^y/i, /^d/i, /^s/i, /^ch/i, /^p/i, /^j/i, /^sh/i],
  any: [/^ya/i, /^d/i, /^se/i, /^ch/i, /^p/i, /^j/i, /^sh/i]
};
var matchDayPeriodPatterns79 = {
  narrow: /^(a|p|y\.t|p| (ertalab|tushdan keyin|kechqurun|tun))/i,
  any: /^([ap]\.?\s?m\.?|yarim tun|peshin| (ertalab|tushdan keyin|kechqurun|tun))/i
};
var parseDayPeriodPatterns79 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^y\.t/i,
    noon: /^pe/i,
    morning: /ertalab/i,
    afternoon: /tushdan keyin/i,
    evening: /kechqurun/i,
    night: /tun/i
  }
};
var match79 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern79,
    parsePattern: parseOrdinalNumberPattern79,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns79,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns79,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns79,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns79,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns79,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns79,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns79,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns79,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns79,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns79,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/uz-Cyrl/_lib/formatLong.js
var dateFormats89 = {
  full: "EEEE, do MMMM, y",
  long: "do MMMM, y",
  medium: "d MMM, y",
  short: "dd/MM/yyyy"
};
var timeFormats89 = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
};
var dateTimeFormats89 = {
  any: "{{date}}, {{time}}"
};
var formatLong89 = {
  date: buildFormatLongFn({
    formats: dateFormats89,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats89,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats89,
    defaultWidth: "any"
  })
};

// node_modules/date-fns/locale/uz-Cyrl/_lib/localize.js
var eraValues81 = {
  narrow: ["М.А", "М"],
  abbreviated: ["М.А", "М"],
  wide: ["Милоддан Аввалги", "Милодий"]
};
var quarterValues81 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-чор.", "2-чор.", "3-чор.", "4-чор."],
  wide: ["1-чорак", "2-чорак", "3-чорак", "4-чорак"]
};
var monthValues81 = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек"
  ],
  wide: [
    "январ",
    "феврал",
    "март",
    "апрел",
    "май",
    "июн",
    "июл",
    "август",
    "сентабр",
    "октабр",
    "ноябр",
    "декабр"
  ]
};
var dayValues81 = {
  narrow: ["Я", "Д", "С", "Ч", "П", "Ж", "Ш"],
  short: ["як", "ду", "се", "чо", "па", "жу", "ша"],
  abbreviated: ["якш", "душ", "сеш", "чор", "пай", "жум", "шан"],
  wide: [
    "якшанба",
    "душанба",
    "сешанба",
    "чоршанба",
    "пайшанба",
    "жума",
    "шанба"
  ]
};
var dayPeriodValues81 = {
  any: {
    am: "П.О.",
    pm: "П.К.",
    midnight: "ярим тун",
    noon: "пешин",
    morning: "эрталаб",
    afternoon: "пешиндан кейин",
    evening: "кечаси",
    night: "тун"
  }
};
var formattingDayPeriodValues65 = {
  any: {
    am: "П.О.",
    pm: "П.К.",
    midnight: "ярим тун",
    noon: "пешин",
    morning: "эрталаб",
    afternoon: "пешиндан кейин",
    evening: "кечаси",
    night: "тун"
  }
};
var ordinalNumber81 = (dirtyNumber, _options) => {
  return String(dirtyNumber);
};
var localize81 = {
  ordinalNumber: ordinalNumber81,
  era: buildLocalizeFn({
    values: eraValues81,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues81,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues81,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues81,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues81,
    defaultWidth: "any",
    formattingValues: formattingDayPeriodValues65,
    defaultFormattingWidth: "any"
  })
};

// node_modules/date-fns/locale/uz-Cyrl/_lib/match.js
var matchOrdinalNumberPattern80 = /^(\d+)(чи)?/i;
var parseOrdinalNumberPattern80 = /\d+/i;
var matchEraPatterns80 = {
  narrow: /^(м\.а|м\.)/i,
  abbreviated: /^(м\.а|м\.)/i,
  wide: /^(милоддан аввал|милоддан кейин)/i
};
var parseEraPatterns80 = {
  any: [/^м/i, /^а/i]
};
var matchQuarterPatterns80 = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234]-чор./i,
  wide: /^[1234]-чорак/i
};
var parseQuarterPatterns80 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns80 = {
  narrow: /^[яфмамииасонд]/i,
  abbreviated: /^(янв|фев|мар|апр|май|июн|июл|авг|сен|окт|ноя|дек)/i,
  wide: /^(январ|феврал|март|апрел|май|июн|июл|август|сентабр|октабр|ноябр|декабр)/i
};
var parseMonthPatterns80 = {
  narrow: [
    /^я/i,
    /^ф/i,
    /^м/i,
    /^а/i,
    /^м/i,
    /^и/i,
    /^и/i,
    /^а/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^д/i
  ],
  any: [
    /^я/i,
    /^ф/i,
    /^мар/i,
    /^ап/i,
    /^май/i,
    /^июн/i,
    /^июл/i,
    /^ав/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^д/i
  ]
};
var matchDayPatterns80 = {
  narrow: /^[ядсчпжш]/i,
  short: /^(як|ду|се|чо|па|жу|ша)/i,
  abbreviated: /^(якш|душ|сеш|чор|пай|жум|шан)/i,
  wide: /^(якшанба|душанба|сешанба|чоршанба|пайшанба|жума|шанба)/i
};
var parseDayPatterns80 = {
  narrow: [/^я/i, /^д/i, /^с/i, /^ч/i, /^п/i, /^ж/i, /^ш/i],
  any: [/^як/i, /^ду/i, /^се/i, /^чор/i, /^пай/i, /^жу/i, /^шан/i]
};
var matchDayPeriodPatterns80 = {
  any: /^(п\.о\.|п\.к\.|ярим тун|пешиндан кейин|(эрталаб|пешиндан кейин|кечаси|тун))/i
};
var parseDayPeriodPatterns80 = {
  any: {
    am: /^п\.о\./i,
    pm: /^п\.к\./i,
    midnight: /^ярим тун/i,
    noon: /^пешиндан кейин/i,
    morning: /эрталаб/i,
    afternoon: /пешиндан кейин/i,
    evening: /кечаси/i,
    night: /тун/i
  }
};
var match80 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern80,
    parsePattern: parseOrdinalNumberPattern80,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns80,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns80,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns80,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns80,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns80,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns80,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns80,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns80,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns80,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns80,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/vi/_lib/formatLong.js
var dateFormats90 = {
  // thứ Sáu, ngày 25 tháng 08 năm 2017
  full: "EEEE, 'ngày' d MMMM 'năm' y",
  // ngày 25 tháng 08 năm 2017
  long: "'ngày' d MMMM 'năm' y",
  // 25 thg 08 năm 2017
  medium: "d MMM 'năm' y",
  // 25/08/2017
  short: "dd/MM/y"
};
var timeFormats90 = {
  full: "HH:mm:ss zzzz",
  long: "HH:mm:ss z",
  medium: "HH:mm:ss",
  short: "HH:mm"
};
var dateTimeFormats90 = {
  // thứ Sáu, ngày 25 tháng 08 năm 2017 23:25:59
  full: "{{date}} {{time}}",
  // ngày 25 tháng 08 năm 2017 23:25
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong90 = {
  date: buildFormatLongFn({
    formats: dateFormats90,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats90,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats90,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/vi/_lib/localize.js
var eraValues82 = {
  narrow: ["TCN", "SCN"],
  abbreviated: ["trước CN", "sau CN"],
  wide: ["trước Công Nguyên", "sau Công Nguyên"]
};
var quarterValues82 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"]
};
var formattingQuarterValues4 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  // I notice many news outlet use this "quý II/2018"
  wide: ["quý I", "quý II", "quý III", "quý IV"]
};
var monthValues82 = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  abbreviated: [
    "Thg 1",
    "Thg 2",
    "Thg 3",
    "Thg 4",
    "Thg 5",
    "Thg 6",
    "Thg 7",
    "Thg 8",
    "Thg 9",
    "Thg 10",
    "Thg 11",
    "Thg 12"
  ],
  wide: [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai"
  ]
};
var formattingMonthValues19 = {
  narrow: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12"
  ],
  abbreviated: [
    "thg 1",
    "thg 2",
    "thg 3",
    "thg 4",
    "thg 5",
    "thg 6",
    "thg 7",
    "thg 8",
    "thg 9",
    "thg 10",
    "thg 11",
    "thg 12"
  ],
  wide: [
    "tháng 01",
    "tháng 02",
    "tháng 03",
    "tháng 04",
    "tháng 05",
    "tháng 06",
    "tháng 07",
    "tháng 08",
    "tháng 09",
    "tháng 10",
    "tháng 11",
    "tháng 12"
  ]
};
var dayValues82 = {
  narrow: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  short: ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"],
  abbreviated: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  wide: [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy"
  ]
};
var dayPeriodValues82 = {
  // narrow date period is extremely rare in Vietnamese
  // I used abbreviated form for noon, morning and afternoon
  // which are regconizable by Vietnamese, others cannot be any shorter
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "nửa đêm",
    noon: "tr",
    morning: "sg",
    afternoon: "ch",
    evening: "tối",
    night: "đêm"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "nửa đêm",
    noon: "trưa",
    morning: "sáng",
    afternoon: "chiều",
    evening: "tối",
    night: "đêm"
  },
  wide: {
    am: "SA",
    pm: "CH",
    midnight: "nửa đêm",
    noon: "trưa",
    morning: "sáng",
    afternoon: "chiều",
    evening: "tối",
    night: "đêm"
  }
};
var formattingDayPeriodValues66 = {
  narrow: {
    am: "am",
    pm: "pm",
    midnight: "nửa đêm",
    noon: "tr",
    morning: "sg",
    afternoon: "ch",
    evening: "tối",
    night: "đêm"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "nửa đêm",
    noon: "trưa",
    morning: "sáng",
    afternoon: "chiều",
    evening: "tối",
    night: "đêm"
  },
  wide: {
    am: "SA",
    pm: "CH",
    midnight: "nửa đêm",
    noon: "giữa trưa",
    morning: "vào buổi sáng",
    afternoon: "vào buổi chiều",
    evening: "vào buổi tối",
    night: "vào ban đêm"
  }
};
var ordinalNumber82 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  const unit = options == null ? void 0 : options.unit;
  if (unit === "quarter") {
    switch (number) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
    }
  } else if (unit === "day") {
    switch (number) {
      case 1:
        return "thứ 2";
      // meaning 2nd day but it's the first day of the week :D
      case 2:
        return "thứ 3";
      // meaning 3rd day
      case 3:
        return "thứ 4";
      // meaning 4th day and so on
      case 4:
        return "thứ 5";
      case 5:
        return "thứ 6";
      case 6:
        return "thứ 7";
      case 7:
        return "chủ nhật";
    }
  } else if (unit === "week") {
    if (number === 1) {
      return "thứ nhất";
    } else {
      return "thứ " + number;
    }
  } else if (unit === "dayOfYear") {
    if (number === 1) {
      return "đầu tiên";
    } else {
      return "thứ " + number;
    }
  }
  return String(number);
};
var localize82 = {
  ordinalNumber: ordinalNumber82,
  era: buildLocalizeFn({
    values: eraValues82,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues82,
    defaultWidth: "wide",
    formattingValues: formattingQuarterValues4,
    defaultFormattingWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues82,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues19,
    defaultFormattingWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues82,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues82,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues66,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/vi/_lib/match.js
var matchOrdinalNumberPattern81 = /^(\d+)/i;
var parseOrdinalNumberPattern81 = /\d+/i;
var matchEraPatterns81 = {
  narrow: /^(tcn|scn)/i,
  abbreviated: /^(trước CN|sau CN)/i,
  wide: /^(trước Công Nguyên|sau Công Nguyên)/i
};
var parseEraPatterns81 = {
  any: [/^t/i, /^s/i]
};
var matchQuarterPatterns81 = {
  narrow: /^([1234]|i{1,3}v?)/i,
  abbreviated: /^q([1234]|i{1,3}v?)/i,
  wide: /^quý ([1234]|i{1,3}v?)/i
};
var parseQuarterPatterns81 = {
  any: [/(1|i)$/i, /(2|ii)$/i, /(3|iii)$/i, /(4|iv)$/i]
};
var matchMonthPatterns81 = {
  // month number may contain leading 0, 'thg' prefix may have space, underscore or empty before number
  // note the order of '1' since it is a sub-string of '10', so must be lower priority
  narrow: /^(0?[2-9]|10|11|12|0?1)/i,
  // note the order of 'thg 1' since it is sub-string of 'thg 10', so must be lower priority
  abbreviated: /^thg[ _]?(0?[1-9](?!\d)|10|11|12)/i,
  // note the order of 'Mười' since it is sub-string of Mười Một, so must be lower priority
  wide: /^tháng ?(Một|Hai|Ba|Tư|Năm|Sáu|Bảy|Tám|Chín|Mười|Mười ?Một|Mười ?Hai|0?[1-9](?!\d)|10|11|12)/i
};
var parseMonthPatterns81 = {
  narrow: [
    /0?1$/i,
    /0?2/i,
    /3/,
    /4/,
    /5/,
    /6/,
    /7/,
    /8/,
    /9/,
    /10/,
    /11/,
    /12/
  ],
  abbreviated: [
    /^thg[ _]?0?1(?!\d)/i,
    /^thg[ _]?0?2/i,
    /^thg[ _]?0?3/i,
    /^thg[ _]?0?4/i,
    /^thg[ _]?0?5/i,
    /^thg[ _]?0?6/i,
    /^thg[ _]?0?7/i,
    /^thg[ _]?0?8/i,
    /^thg[ _]?0?9/i,
    /^thg[ _]?10/i,
    /^thg[ _]?11/i,
    /^thg[ _]?12/i
  ],
  wide: [
    /^tháng ?(Một|0?1(?!\d))/i,
    /^tháng ?(Hai|0?2)/i,
    /^tháng ?(Ba|0?3)/i,
    /^tháng ?(Tư|0?4)/i,
    /^tháng ?(Năm|0?5)/i,
    /^tháng ?(Sáu|0?6)/i,
    /^tháng ?(Bảy|0?7)/i,
    /^tháng ?(Tám|0?8)/i,
    /^tháng ?(Chín|0?9)/i,
    /^tháng ?(Mười|10)/i,
    /^tháng ?(Mười ?Một|11)/i,
    /^tháng ?(Mười ?Hai|12)/i
  ]
};
var matchDayPatterns81 = {
  narrow: /^(CN|T2|T3|T4|T5|T6|T7)/i,
  short: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
  abbreviated: /^(CN|Th ?2|Th ?3|Th ?4|Th ?5|Th ?6|Th ?7)/i,
  wide: /^(Chủ ?Nhật|Chúa ?Nhật|thứ ?Hai|thứ ?Ba|thứ ?Tư|thứ ?Năm|thứ ?Sáu|thứ ?Bảy)/i
};
var parseDayPatterns81 = {
  narrow: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
  short: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
  abbreviated: [/CN/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i],
  wide: [/(Chủ|Chúa) ?Nhật/i, /Hai/i, /Ba/i, /Tư/i, /Năm/i, /Sáu/i, /Bảy/i]
};
var matchDayPeriodPatterns81 = {
  narrow: /^(a|p|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
  abbreviated: /^(am|pm|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i,
  wide: /^(ch[^i]*|sa|nửa đêm|trưa|(giờ) (sáng|chiều|tối|đêm))/i
};
var parseDayPeriodPatterns81 = {
  any: {
    am: /^(a|sa)/i,
    pm: /^(p|ch[^i]*)/i,
    midnight: /nửa đêm/i,
    noon: /trưa/i,
    morning: /sáng/i,
    afternoon: /chiều/i,
    evening: /tối/i,
    night: /^đêm/i
  }
};
var match81 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern81,
    parsePattern: parseOrdinalNumberPattern81,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns81,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns81,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns81,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns81,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns81,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns81,
    defaultParseWidth: "wide"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns81,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns81,
    defaultParseWidth: "wide"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns81,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPeriodPatterns81,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/zh-CN/_lib/formatLong.js
var dateFormats91 = {
  full: "y'年'M'月'd'日' EEEE",
  long: "y'年'M'月'd'日'",
  medium: "yyyy-MM-dd",
  short: "yy-MM-dd"
};
var timeFormats91 = {
  full: "zzzz a h:mm:ss",
  long: "z a h:mm:ss",
  medium: "a h:mm:ss",
  short: "a h:mm"
};
var dateTimeFormats91 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong91 = {
  date: buildFormatLongFn({
    formats: dateFormats91,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats91,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats91,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/zh-CN/_lib/localize.js
var eraValues83 = {
  narrow: ["前", "公元"],
  abbreviated: ["前", "公元"],
  wide: ["公元前", "公元"]
};
var quarterValues83 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["第一季", "第二季", "第三季", "第四季"],
  wide: ["第一季度", "第二季度", "第三季度", "第四季度"]
};
var monthValues83 = {
  narrow: [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二"
  ],
  abbreviated: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  wide: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ]
};
var dayValues83 = {
  narrow: ["日", "一", "二", "三", "四", "五", "六"],
  short: ["日", "一", "二", "三", "四", "五", "六"],
  abbreviated: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};
var dayPeriodValues83 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  }
};
var formattingDayPeriodValues67 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  }
};
var ordinalNumber83 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  switch (options == null ? void 0 : options.unit) {
    case "date":
      return number.toString() + "日";
    case "hour":
      return number.toString() + "时";
    case "minute":
      return number.toString() + "分";
    case "second":
      return number.toString() + "秒";
    default:
      return "第 " + number.toString();
  }
};
var localize83 = {
  ordinalNumber: ordinalNumber83,
  era: buildLocalizeFn({
    values: eraValues83,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues83,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues83,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues83,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues83,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues67,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/zh-CN/_lib/match.js
var matchOrdinalNumberPattern82 = /^(第\s*)?\d+(日|时|分|秒)?/i;
var parseOrdinalNumberPattern82 = /\d+/i;
var matchEraPatterns82 = {
  narrow: /^(前)/i,
  abbreviated: /^(前)/i,
  wide: /^(公元前|公元)/i
};
var parseEraPatterns82 = {
  any: [/^(前)/i, /^(公元)/i]
};
var matchQuarterPatterns82 = {
  narrow: /^[1234]/i,
  abbreviated: /^第[一二三四]刻/i,
  wide: /^第[一二三四]刻钟/i
};
var parseQuarterPatterns82 = {
  any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
};
var matchMonthPatterns82 = {
  narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
  abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
  wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
};
var parseMonthPatterns82 = {
  narrow: [
    /^一/i,
    /^二/i,
    /^三/i,
    /^四/i,
    /^五/i,
    /^六/i,
    /^七/i,
    /^八/i,
    /^九/i,
    /^十(?!(一|二))/i,
    /^十一/i,
    /^十二/i
  ],
  any: [
    /^一|1/i,
    /^二|2/i,
    /^三|3/i,
    /^四|4/i,
    /^五|5/i,
    /^六|6/i,
    /^七|7/i,
    /^八|8/i,
    /^九|9/i,
    /^十(?!(一|二))|10/i,
    /^十一|11/i,
    /^十二|12/i
  ]
};
var matchDayPatterns82 = {
  narrow: /^[一二三四五六日]/i,
  short: /^[一二三四五六日]/i,
  abbreviated: /^周[一二三四五六日]/i,
  wide: /^星期[一二三四五六日]/i
};
var parseDayPatterns82 = {
  any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
};
var matchDayPeriodPatterns82 = {
  any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i
};
var parseDayPeriodPatterns82 = {
  any: {
    am: /^上午?/i,
    pm: /^下午?/i,
    midnight: /^午夜/i,
    noon: /^[中正]午/i,
    morning: /^早上/i,
    afternoon: /^下午/i,
    evening: /^晚上?/i,
    night: /^凌晨/i
  }
};
var match82 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern82,
    parsePattern: parseOrdinalNumberPattern82,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns82,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns82,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns82,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns82,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns82,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns82,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns82,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns82,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns82,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns82,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/zh-HK/_lib/formatLong.js
var dateFormats92 = {
  full: "y'年'M'月'd'日' EEEE",
  long: "y'年'M'月'd'日'",
  medium: "yyyy-MM-dd",
  short: "yy-MM-dd"
};
var timeFormats92 = {
  full: "zzzz a h:mm:ss",
  long: "z a h:mm:ss",
  medium: "a h:mm:ss",
  short: "a h:mm"
};
var dateTimeFormats92 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong92 = {
  date: buildFormatLongFn({
    formats: dateFormats92,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats92,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats92,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/zh-HK/_lib/localize.js
var eraValues84 = {
  narrow: ["前", "公元"],
  abbreviated: ["前", "公元"],
  wide: ["公元前", "公元"]
};
var quarterValues84 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["第一季", "第二季", "第三季", "第四季"],
  wide: ["第一季度", "第二季度", "第三季度", "第四季度"]
};
var monthValues84 = {
  narrow: [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二"
  ],
  abbreviated: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  wide: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ]
};
var dayValues84 = {
  narrow: ["日", "一", "二", "三", "四", "五", "六"],
  short: ["日", "一", "二", "三", "四", "五", "六"],
  abbreviated: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
  wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};
var dayPeriodValues84 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "午夜",
    noon: "晌",
    morning: "早",
    afternoon: "午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "午夜",
    noon: "中午",
    morning: "上午",
    afternoon: "下午",
    evening: "晚上",
    night: "夜晚"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "午夜",
    noon: "中午",
    morning: "上午",
    afternoon: "下午",
    evening: "晚上",
    night: "夜晚"
  }
};
var formattingDayPeriodValues68 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "午夜",
    noon: "晌",
    morning: "早",
    afternoon: "午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "午夜",
    noon: "中午",
    morning: "上午",
    afternoon: "下午",
    evening: "晚上",
    night: "夜晚"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "午夜",
    noon: "中午",
    morning: "上午",
    afternoon: "下午",
    evening: "晚上",
    night: "夜晚"
  }
};
var ordinalNumber84 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  switch (options == null ? void 0 : options.unit) {
    case "date":
      return number + "日";
    case "hour":
      return number + "時";
    case "minute":
      return number + "分";
    case "second":
      return number + "秒";
    default:
      return "第 " + number;
  }
};
var localize84 = {
  ordinalNumber: ordinalNumber84,
  era: buildLocalizeFn({
    values: eraValues84,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues84,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues84,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues84,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues84,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues68,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/zh-HK/_lib/match.js
var matchOrdinalNumberPattern83 = /^(第\s*)?\d+(日|時|分|秒)?/i;
var parseOrdinalNumberPattern83 = /\d+/i;
var matchEraPatterns83 = {
  narrow: /^(前)/i,
  abbreviated: /^(前)/i,
  wide: /^(公元前|公元)/i
};
var parseEraPatterns83 = {
  any: [/^(前)/i, /^(公元)/i]
};
var matchQuarterPatterns83 = {
  narrow: /^[1234]/i,
  abbreviated: /^第[一二三四]季/i,
  wide: /^第[一二三四]季度/i
};
var parseQuarterPatterns83 = {
  any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
};
var matchMonthPatterns83 = {
  narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
  abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
  wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
};
var parseMonthPatterns83 = {
  narrow: [
    /^一/i,
    /^二/i,
    /^三/i,
    /^四/i,
    /^五/i,
    /^六/i,
    /^七/i,
    /^八/i,
    /^九/i,
    /^十(?!(一|二))/i,
    /^十一/i,
    /^十二/i
  ],
  any: [
    /^一|1/i,
    /^二|2/i,
    /^三|3/i,
    /^四|4/i,
    /^五|5/i,
    /^六|6/i,
    /^七|7/i,
    /^八|8/i,
    /^九|9/i,
    /^十(?!(一|二))|10/i,
    /^十一|11/i,
    /^十二|12/i
  ]
};
var matchDayPatterns83 = {
  narrow: /^[一二三四五六日]/i,
  short: /^[一二三四五六日]/i,
  abbreviated: /^週[一二三四五六日]/i,
  wide: /^星期[一二三四五六日]/i
};
var parseDayPatterns83 = {
  any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
};
var matchDayPeriodPatterns83 = {
  any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨)/i
};
var parseDayPeriodPatterns83 = {
  any: {
    am: /^上午?/i,
    pm: /^下午?/i,
    midnight: /^午夜/i,
    noon: /^[中正]午/i,
    morning: /^早上/i,
    afternoon: /^下午/i,
    evening: /^晚上?/i,
    night: /^凌晨/i
  }
};
var match83 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern83,
    parsePattern: parseOrdinalNumberPattern83,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns83,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns83,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns83,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns83,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns83,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns83,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns83,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns83,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns83,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns83,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/zh-TW/_lib/formatLong.js
var dateFormats93 = {
  full: "y'年'M'月'd'日' EEEE",
  long: "y'年'M'月'd'日'",
  medium: "yyyy-MM-dd",
  short: "yy-MM-dd"
};
var timeFormats93 = {
  full: "zzzz a h:mm:ss",
  long: "z a h:mm:ss",
  medium: "a h:mm:ss",
  short: "a h:mm"
};
var dateTimeFormats93 = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong93 = {
  date: buildFormatLongFn({
    formats: dateFormats93,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats93,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats93,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/zh-TW/_lib/localize.js
var eraValues85 = {
  narrow: ["前", "公元"],
  abbreviated: ["前", "公元"],
  wide: ["公元前", "公元"]
};
var quarterValues85 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["第一刻", "第二刻", "第三刻", "第四刻"],
  wide: ["第一刻鐘", "第二刻鐘", "第三刻鐘", "第四刻鐘"]
};
var monthValues85 = {
  narrow: [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二"
  ],
  abbreviated: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  wide: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ]
};
var dayValues85 = {
  narrow: ["日", "一", "二", "三", "四", "五", "六"],
  short: ["日", "一", "二", "三", "四", "五", "六"],
  abbreviated: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
  wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};
var dayPeriodValues85 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜間"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜間"
  }
};
var formattingDayPeriodValues69 = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜間"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜間"
  }
};
var ordinalNumber85 = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  switch (options == null ? void 0 : options.unit) {
    case "date":
      return number + "日";
    case "hour":
      return number + "時";
    case "minute":
      return number + "分";
    case "second":
      return number + "秒";
    default:
      return "第 " + number;
  }
};
var localize85 = {
  ordinalNumber: ordinalNumber85,
  era: buildLocalizeFn({
    values: eraValues85,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues85,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues85,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues85,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues85,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues69,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/zh-TW/_lib/match.js
var matchOrdinalNumberPattern84 = /^(第\s*)?\d+(日|時|分|秒)?/i;
var parseOrdinalNumberPattern84 = /\d+/i;
var matchEraPatterns84 = {
  narrow: /^(前)/i,
  abbreviated: /^(前)/i,
  wide: /^(公元前|公元)/i
};
var parseEraPatterns84 = {
  any: [/^(前)/i, /^(公元)/i]
};
var matchQuarterPatterns84 = {
  narrow: /^[1234]/i,
  abbreviated: /^第[一二三四]刻/i,
  wide: /^第[一二三四]刻鐘/i
};
var parseQuarterPatterns84 = {
  any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
};
var matchMonthPatterns84 = {
  narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
  abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
  wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
};
var parseMonthPatterns84 = {
  narrow: [
    /^一/i,
    /^二/i,
    /^三/i,
    /^四/i,
    /^五/i,
    /^六/i,
    /^七/i,
    /^八/i,
    /^九/i,
    /^十(?!(一|二))/i,
    /^十一/i,
    /^十二/i
  ],
  any: [
    /^一|1/i,
    /^二|2/i,
    /^三|3/i,
    /^四|4/i,
    /^五|5/i,
    /^六|6/i,
    /^七|7/i,
    /^八|8/i,
    /^九|9/i,
    /^十(?!(一|二))|10/i,
    /^十一|11/i,
    /^十二|12/i
  ]
};
var matchDayPatterns84 = {
  narrow: /^[一二三四五六日]/i,
  short: /^[一二三四五六日]/i,
  abbreviated: /^週[一二三四五六日]/i,
  wide: /^星期[一二三四五六日]/i
};
var parseDayPatterns84 = {
  any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
};
var matchDayPeriodPatterns84 = {
  any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨)/i
};
var parseDayPeriodPatterns84 = {
  any: {
    am: /^上午?/i,
    pm: /^下午?/i,
    midnight: /^午夜/i,
    noon: /^[中正]午/i,
    morning: /^早上/i,
    afternoon: /^下午/i,
    evening: /^晚上?/i,
    night: /^凌晨/i
  }
};
var match84 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern84,
    parsePattern: parseOrdinalNumberPattern84,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns84,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns84,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns84,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns84,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns84,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns84,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns84,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns84,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns84,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns84,
    defaultParseWidth: "any"
  })
};

// node_modules/react-day-picker/dist/esm/helpers/getBroadcastWeeksInMonth.js
var FIVE_WEEKS = 5;
var FOUR_WEEKS = 4;
function getBroadcastWeeksInMonth(month, dateLib2) {
  const firstDayOfMonth = dateLib2.startOfMonth(month);
  const firstDayOfWeek = firstDayOfMonth.getDay() > 0 ? firstDayOfMonth.getDay() : 7;
  const broadcastStartDate = dateLib2.addDays(month, -firstDayOfWeek + 1);
  const lastDateOfLastWeek = dateLib2.addDays(broadcastStartDate, FIVE_WEEKS * 7 - 1);
  const numberOfWeeks = dateLib2.getMonth(month) === dateLib2.getMonth(lastDateOfLastWeek) ? FIVE_WEEKS : FOUR_WEEKS;
  return numberOfWeeks;
}

// node_modules/react-day-picker/dist/esm/helpers/startOfBroadcastWeek.js
function startOfBroadcastWeek(date, dateLib2) {
  const firstOfMonth = dateLib2.startOfMonth(date);
  const dayOfWeek = firstOfMonth.getDay();
  if (dayOfWeek === 1) {
    return firstOfMonth;
  } else if (dayOfWeek === 0) {
    return dateLib2.addDays(firstOfMonth, -1 * 6);
  } else {
    return dateLib2.addDays(firstOfMonth, -1 * (dayOfWeek - 1));
  }
}

// node_modules/react-day-picker/dist/esm/helpers/endOfBroadcastWeek.js
function endOfBroadcastWeek(date, dateLib2) {
  const startDate = startOfBroadcastWeek(date, dateLib2);
  const numberOfWeeks = getBroadcastWeeksInMonth(date, dateLib2);
  const endDate = dateLib2.addDays(startDate, numberOfWeeks * 7 - 1);
  return endDate;
}

// node_modules/react-day-picker/dist/esm/classes/DateLib.js
var DateLib = class {
  /**
   * Creates an instance of DateLib.
   *
   * @param options The options for the date library.
   * @param overrides Overrides for the date library functions.
   */
  constructor(options, overrides) {
    this.Date = Date;
    this.today = () => {
      var _a;
      if ((_a = this.overrides) == null ? void 0 : _a.today) {
        return this.overrides.today();
      }
      if (this.options.timeZone) {
        return TZDate.tz(this.options.timeZone);
      }
      return new this.Date();
    };
    this.newDate = (year, monthIndex, date) => {
      var _a;
      if ((_a = this.overrides) == null ? void 0 : _a.newDate) {
        return this.overrides.newDate(year, monthIndex, date);
      }
      if (this.options.timeZone) {
        return new TZDate(year, monthIndex, date, this.options.timeZone);
      }
      return new Date(year, monthIndex, date);
    };
    this.addDays = (date, amount) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.addDays) == null ? void 0 : _b.call(_a, date, amount)) ?? addDays(date, amount);
    };
    this.addMonths = (date, amount) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.addMonths) == null ? void 0 : _b.call(_a, date, amount)) ?? addMonths(date, amount);
    };
    this.addWeeks = (date, amount) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.addWeeks) == null ? void 0 : _b.call(_a, date, amount)) ?? addWeeks(date, amount);
    };
    this.addYears = (date, amount) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.addYears) == null ? void 0 : _b.call(_a, date, amount)) ?? addYears(date, amount);
    };
    this.differenceInCalendarDays = (dateLeft, dateRight) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.differenceInCalendarDays) == null ? void 0 : _b.call(_a, dateLeft, dateRight)) ?? differenceInCalendarDays(dateLeft, dateRight);
    };
    this.differenceInCalendarMonths = (dateLeft, dateRight) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.differenceInCalendarMonths) == null ? void 0 : _b.call(_a, dateLeft, dateRight)) ?? differenceInCalendarMonths(dateLeft, dateRight);
    };
    this.eachMonthOfInterval = (interval) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.eachMonthOfInterval) == null ? void 0 : _b.call(_a, interval)) ?? eachMonthOfInterval(interval);
    };
    this.endOfBroadcastWeek = (date, dateLib2) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.endOfBroadcastWeek) == null ? void 0 : _b.call(_a, date, dateLib2)) ?? endOfBroadcastWeek(date, this);
    };
    this.endOfISOWeek = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.endOfISOWeek) == null ? void 0 : _b.call(_a, date)) ?? endOfISOWeek(date);
    };
    this.endOfMonth = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.endOfMonth) == null ? void 0 : _b.call(_a, date)) ?? endOfMonth(date);
    };
    this.endOfWeek = (date, options2) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.endOfWeek) == null ? void 0 : _b.call(_a, date, options2 ?? this.options)) ?? endOfWeek(date, options2 ?? this.options);
    };
    this.endOfYear = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.endOfYear) == null ? void 0 : _b.call(_a, date)) ?? endOfYear(date);
    };
    this.format = (date, formatStr, options2) => {
      var _a, _b;
      const formatted = ((_b = (_a = this.overrides) == null ? void 0 : _a.format) == null ? void 0 : _b.call(_a, date, formatStr, options2 ?? this.options)) ?? format(date, formatStr, options2 ?? this.options);
      if (this.options.numerals && this.options.numerals !== "latn") {
        return this.replaceDigits(formatted);
      }
      return formatted;
    };
    this.getISOWeek = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.getISOWeek) == null ? void 0 : _b.call(_a, date)) ?? getISOWeek(date);
    };
    this.getMonth = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.getMonth) == null ? void 0 : _b.call(_a, date)) ?? getMonth(date);
    };
    this.getYear = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.getYear) == null ? void 0 : _b.call(_a, date)) ?? getYear(date);
    };
    this.getWeek = (date, options2) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.getWeek) == null ? void 0 : _b.call(_a, date, options2 ?? this.options)) ?? getWeek(date, options2 ?? this.options);
    };
    this.isAfter = (date, dateToCompare) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isAfter) == null ? void 0 : _b.call(_a, date, dateToCompare)) ?? isAfter(date, dateToCompare);
    };
    this.isBefore = (date, dateToCompare) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isBefore) == null ? void 0 : _b.call(_a, date, dateToCompare)) ?? isBefore(date, dateToCompare);
    };
    this.isDate = (value) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isDate) == null ? void 0 : _b.call(_a, value)) ?? isDate(value);
    };
    this.isSameDay = (dateLeft, dateRight) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isSameDay) == null ? void 0 : _b.call(_a, dateLeft, dateRight)) ?? isSameDay(dateLeft, dateRight);
    };
    this.isSameMonth = (dateLeft, dateRight) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isSameMonth) == null ? void 0 : _b.call(_a, dateLeft, dateRight)) ?? isSameMonth(dateLeft, dateRight);
    };
    this.isSameYear = (dateLeft, dateRight) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.isSameYear) == null ? void 0 : _b.call(_a, dateLeft, dateRight)) ?? isSameYear(dateLeft, dateRight);
    };
    this.max = (dates) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.max) == null ? void 0 : _b.call(_a, dates)) ?? max(dates);
    };
    this.min = (dates) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.min) == null ? void 0 : _b.call(_a, dates)) ?? min(dates);
    };
    this.setMonth = (date, month) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.setMonth) == null ? void 0 : _b.call(_a, date, month)) ?? setMonth(date, month);
    };
    this.setYear = (date, year) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.setYear) == null ? void 0 : _b.call(_a, date, year)) ?? setYear(date, year);
    };
    this.startOfBroadcastWeek = (date, dateLib2) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfBroadcastWeek) == null ? void 0 : _b.call(_a, date, dateLib2 ?? this)) ?? startOfBroadcastWeek(date, dateLib2 ?? this);
    };
    this.startOfDay = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfDay) == null ? void 0 : _b.call(_a, date)) ?? startOfDay(date);
    };
    this.startOfISOWeek = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfISOWeek) == null ? void 0 : _b.call(_a, date)) ?? startOfISOWeek(date);
    };
    this.startOfMonth = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfMonth) == null ? void 0 : _b.call(_a, date)) ?? startOfMonth(date);
    };
    this.startOfWeek = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfWeek) == null ? void 0 : _b.call(_a, date)) ?? startOfWeek(date, this.options);
    };
    this.startOfYear = (date) => {
      var _a, _b;
      return ((_b = (_a = this.overrides) == null ? void 0 : _a.startOfYear) == null ? void 0 : _b.call(_a, date)) ?? startOfYear(date);
    };
    this.options = { locale: enUS, ...options };
    this.overrides = overrides;
  }
  /**
   * Generate digit map dynamically using Intl.NumberFormat.
   *
   * @since 9.5.0
   */
  getDigitMap() {
    const { numerals = "latn" } = this.options;
    const formatter = new Intl.NumberFormat("en-US", {
      numberingSystem: numerals
    });
    const digitMap = {};
    for (let i = 0; i < 10; i++) {
      digitMap[i.toString()] = formatter.format(i);
    }
    return digitMap;
  }
  /**
   * Replace Arabic digits with the target numbering system digits.
   *
   * @since 9.5.0
   */
  replaceDigits(input) {
    const digitMap = this.getDigitMap();
    return input.replace(/\d/g, (digit) => digitMap[digit] || digit);
  }
  /**
   * Format number using the custom numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number.
   */
  formatNumber(value) {
    return this.replaceDigits(value.toString());
  }
};
var defaultDateLib = new DateLib();
var dateLib = defaultDateLib;

// node_modules/react-day-picker/dist/esm/helpers/getClassNamesForModifiers.js
function getClassNamesForModifiers(modifiers, classNames, modifiersClassNames = {}) {
  const modifierClassNames = Object.entries(modifiers).filter(([, active]) => active === true).reduce((previousValue, [key]) => {
    if (modifiersClassNames[key]) {
      previousValue.push(modifiersClassNames[key]);
    } else if (classNames[DayFlag[key]]) {
      previousValue.push(classNames[DayFlag[key]]);
    } else if (classNames[SelectionState[key]]) {
      previousValue.push(classNames[SelectionState[key]]);
    }
    return previousValue;
  }, [classNames[UI.Day]]);
  return modifierClassNames;
}

// node_modules/react-day-picker/dist/esm/components/custom-components.js
var custom_components_exports = {};
__export(custom_components_exports, {
  Button: () => Button,
  CaptionLabel: () => CaptionLabel,
  Chevron: () => Chevron,
  Day: () => Day,
  DayButton: () => DayButton,
  Dropdown: () => Dropdown,
  DropdownNav: () => DropdownNav,
  Footer: () => Footer,
  Month: () => Month,
  MonthCaption: () => MonthCaption,
  MonthGrid: () => MonthGrid,
  Months: () => Months,
  MonthsDropdown: () => MonthsDropdown,
  Nav: () => Nav,
  NextMonthButton: () => NextMonthButton,
  Option: () => Option,
  PreviousMonthButton: () => PreviousMonthButton,
  Root: () => Root,
  Select: () => Select,
  Week: () => Week,
  WeekNumber: () => WeekNumber,
  WeekNumberHeader: () => WeekNumberHeader,
  Weekday: () => Weekday,
  Weekdays: () => Weekdays,
  Weeks: () => Weeks,
  YearsDropdown: () => YearsDropdown
});

// node_modules/react-day-picker/dist/esm/components/Button.js
var import_react = __toESM(require_react(), 1);
function Button(props) {
  return import_react.default.createElement("button", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/CaptionLabel.js
var import_react2 = __toESM(require_react(), 1);
function CaptionLabel(props) {
  return import_react2.default.createElement("span", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Chevron.js
var import_react3 = __toESM(require_react(), 1);
function Chevron(props) {
  const { size = 24, orientation = "left", className } = props;
  return import_react3.default.createElement(
    "svg",
    { className, width: size, height: size, viewBox: "0 0 24 24" },
    orientation === "up" && import_react3.default.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
    orientation === "down" && import_react3.default.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
    orientation === "left" && import_react3.default.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
    orientation === "right" && import_react3.default.createElement("polygon", { points: "8 18.612 14.1888889 12.5 8 6.37733333 9.91111111 4.5 18 12.5 9.91111111 20.5" })
  );
}

// node_modules/react-day-picker/dist/esm/components/Day.js
var import_react4 = __toESM(require_react(), 1);
function Day(props) {
  const { day, modifiers, ...tdProps } = props;
  return import_react4.default.createElement("td", { ...tdProps });
}

// node_modules/react-day-picker/dist/esm/components/DayButton.js
var import_react5 = __toESM(require_react(), 1);
function DayButton(props) {
  const { day, modifiers, ...buttonProps } = props;
  const ref = import_react5.default.useRef(null);
  import_react5.default.useEffect(() => {
    var _a;
    if (modifiers.focused)
      (_a = ref.current) == null ? void 0 : _a.focus();
  }, [modifiers.focused]);
  return import_react5.default.createElement("button", { ref, ...buttonProps });
}

// node_modules/react-day-picker/dist/esm/components/Dropdown.js
var import_react6 = __toESM(require_react(), 1);
function Dropdown(props) {
  const { options, className, components, classNames, ...selectProps } = props;
  const cssClassSelect = [classNames[UI.Dropdown], className].join(" ");
  const selectedOption = options == null ? void 0 : options.find(({ value }) => value === selectProps.value);
  return import_react6.default.createElement(
    "span",
    { "data-disabled": selectProps.disabled, className: classNames[UI.DropdownRoot] },
    import_react6.default.createElement(components.Select, { className: cssClassSelect, ...selectProps }, options == null ? void 0 : options.map(({ value, label, disabled }) => import_react6.default.createElement(components.Option, { key: value, value, disabled }, label))),
    import_react6.default.createElement(
      "span",
      { className: classNames[UI.CaptionLabel], "aria-hidden": true },
      selectedOption == null ? void 0 : selectedOption.label,
      import_react6.default.createElement(components.Chevron, { orientation: "down", size: 18, className: classNames[UI.Chevron] })
    )
  );
}

// node_modules/react-day-picker/dist/esm/components/DropdownNav.js
var import_react7 = __toESM(require_react(), 1);
function DropdownNav(props) {
  return import_react7.default.createElement("div", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Footer.js
var import_react8 = __toESM(require_react(), 1);
function Footer(props) {
  return import_react8.default.createElement("div", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Month.js
var import_react9 = __toESM(require_react(), 1);
function Month(props) {
  const { calendarMonth, displayIndex, ...divProps } = props;
  return import_react9.default.createElement("div", { ...divProps }, props.children);
}

// node_modules/react-day-picker/dist/esm/components/MonthCaption.js
var import_react10 = __toESM(require_react(), 1);
function MonthCaption(props) {
  const { calendarMonth, displayIndex, ...divProps } = props;
  return import_react10.default.createElement("div", { ...divProps });
}

// node_modules/react-day-picker/dist/esm/components/MonthGrid.js
var import_react11 = __toESM(require_react(), 1);
function MonthGrid(props) {
  return import_react11.default.createElement("table", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Months.js
var import_react12 = __toESM(require_react(), 1);
function Months(props) {
  return import_react12.default.createElement("div", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/MonthsDropdown.js
var import_react14 = __toESM(require_react(), 1);

// node_modules/react-day-picker/dist/esm/useDayPicker.js
var import_react13 = __toESM(require_react(), 1);
var dayPickerContext = (0, import_react13.createContext)(void 0);
function useDayPicker() {
  const context = (0, import_react13.useContext)(dayPickerContext);
  if (context === void 0) {
    throw new Error("useDayPicker() must be used within a custom component.");
  }
  return context;
}

// node_modules/react-day-picker/dist/esm/components/MonthsDropdown.js
function MonthsDropdown(props) {
  const { components } = useDayPicker();
  return import_react14.default.createElement(components.Dropdown, { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Nav.js
var import_react15 = __toESM(require_react(), 1);
function Nav(props) {
  const { onPreviousClick, onNextClick, previousMonth, nextMonth, ...navProps } = props;
  const { components, classNames, labels: { labelPrevious: labelPrevious2, labelNext: labelNext2 } } = useDayPicker();
  const handleNextClick = (0, import_react15.useCallback)((e) => {
    if (nextMonth) {
      onNextClick == null ? void 0 : onNextClick(e);
    }
  }, [nextMonth, onNextClick]);
  const handlePreviousClick = (0, import_react15.useCallback)((e) => {
    if (previousMonth) {
      onPreviousClick == null ? void 0 : onPreviousClick(e);
    }
  }, [previousMonth, onPreviousClick]);
  return import_react15.default.createElement(
    "nav",
    { ...navProps },
    import_react15.default.createElement(
      components.PreviousMonthButton,
      { type: "button", className: classNames[UI.PreviousMonthButton], tabIndex: previousMonth ? void 0 : -1, "aria-disabled": previousMonth ? void 0 : true, "aria-label": labelPrevious2(previousMonth), onClick: handlePreviousClick },
      import_react15.default.createElement(components.Chevron, { disabled: previousMonth ? void 0 : true, className: classNames[UI.Chevron], orientation: "left" })
    ),
    import_react15.default.createElement(
      components.NextMonthButton,
      { type: "button", className: classNames[UI.NextMonthButton], tabIndex: nextMonth ? void 0 : -1, "aria-disabled": nextMonth ? void 0 : true, "aria-label": labelNext2(nextMonth), onClick: handleNextClick },
      import_react15.default.createElement(components.Chevron, { disabled: nextMonth ? void 0 : true, orientation: "right", className: classNames[UI.Chevron] })
    )
  );
}

// node_modules/react-day-picker/dist/esm/components/NextMonthButton.js
var import_react16 = __toESM(require_react(), 1);
function NextMonthButton(props) {
  const { components } = useDayPicker();
  return import_react16.default.createElement(components.Button, { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Option.js
var import_react17 = __toESM(require_react(), 1);
function Option(props) {
  return import_react17.default.createElement("option", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/PreviousMonthButton.js
var import_react18 = __toESM(require_react(), 1);
function PreviousMonthButton(props) {
  const { components } = useDayPicker();
  return import_react18.default.createElement(components.Button, { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Root.js
var import_react19 = __toESM(require_react(), 1);
function Root(props) {
  const { rootRef, ...rest } = props;
  return import_react19.default.createElement("div", { ...rest, ref: rootRef });
}

// node_modules/react-day-picker/dist/esm/components/Select.js
var import_react20 = __toESM(require_react(), 1);
function Select(props) {
  return import_react20.default.createElement("select", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Week.js
var import_react21 = __toESM(require_react(), 1);
function Week(props) {
  const { week: week2, ...trProps } = props;
  return import_react21.default.createElement("tr", { ...trProps });
}

// node_modules/react-day-picker/dist/esm/components/Weekday.js
var import_react22 = __toESM(require_react(), 1);
function Weekday(props) {
  return import_react22.default.createElement("th", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Weekdays.js
var import_react23 = __toESM(require_react(), 1);
function Weekdays(props) {
  return import_react23.default.createElement(
    "thead",
    { "aria-hidden": true },
    import_react23.default.createElement("tr", { ...props })
  );
}

// node_modules/react-day-picker/dist/esm/components/WeekNumber.js
var import_react24 = __toESM(require_react(), 1);
function WeekNumber(props) {
  const { week: week2, ...thProps } = props;
  return import_react24.default.createElement("th", { ...thProps });
}

// node_modules/react-day-picker/dist/esm/components/WeekNumberHeader.js
var import_react25 = __toESM(require_react(), 1);
function WeekNumberHeader(props) {
  return import_react25.default.createElement("th", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/Weeks.js
var import_react26 = __toESM(require_react(), 1);
function Weeks(props) {
  return import_react26.default.createElement("tbody", { ...props });
}

// node_modules/react-day-picker/dist/esm/components/YearsDropdown.js
var import_react27 = __toESM(require_react(), 1);
function YearsDropdown(props) {
  const { components } = useDayPicker();
  return import_react27.default.createElement(components.Dropdown, { ...props });
}

// node_modules/react-day-picker/dist/esm/helpers/getComponents.js
function getComponents(customComponents) {
  return {
    ...custom_components_exports,
    ...customComponents
  };
}

// node_modules/react-day-picker/dist/esm/helpers/getDataAttributes.js
function getDataAttributes(props) {
  const dataAttributes = {
    "data-mode": props.mode ?? void 0,
    "data-required": "required" in props ? props.required : void 0,
    "data-multiple-months": props.numberOfMonths && props.numberOfMonths > 1 || void 0,
    "data-week-numbers": props.showWeekNumber || void 0,
    "data-broadcast-calendar": props.broadcastCalendar || void 0
  };
  Object.entries(props).forEach(([key, val]) => {
    if (key.startsWith("data-")) {
      dataAttributes[key] = val;
    }
  });
  return dataAttributes;
}

// node_modules/react-day-picker/dist/esm/helpers/getDefaultClassNames.js
function getDefaultClassNames() {
  const classNames = {};
  for (const key in UI) {
    classNames[UI[key]] = `rdp-${UI[key]}`;
  }
  for (const key in DayFlag) {
    classNames[DayFlag[key]] = `rdp-${DayFlag[key]}`;
  }
  for (const key in SelectionState) {
    classNames[SelectionState[key]] = `rdp-${SelectionState[key]}`;
  }
  for (const key in Animation) {
    classNames[Animation[key]] = `rdp-${Animation[key]}`;
  }
  return classNames;
}

// node_modules/react-day-picker/dist/esm/formatters/index.js
var formatters_exports = {};
__export(formatters_exports, {
  formatCaption: () => formatCaption,
  formatDay: () => formatDay,
  formatMonthCaption: () => formatMonthCaption,
  formatMonthDropdown: () => formatMonthDropdown,
  formatWeekNumber: () => formatWeekNumber,
  formatWeekNumberHeader: () => formatWeekNumberHeader,
  formatWeekdayName: () => formatWeekdayName,
  formatYearCaption: () => formatYearCaption,
  formatYearDropdown: () => formatYearDropdown
});

// node_modules/react-day-picker/dist/esm/formatters/formatCaption.js
function formatCaption(month, options, dateLib2) {
  return (dateLib2 ?? new DateLib(options)).format(month, "LLLL y");
}
var formatMonthCaption = formatCaption;

// node_modules/react-day-picker/dist/esm/formatters/formatDay.js
function formatDay(date, options, dateLib2) {
  return (dateLib2 ?? new DateLib(options)).format(date, "d");
}

// node_modules/react-day-picker/dist/esm/formatters/formatMonthDropdown.js
function formatMonthDropdown(month, dateLib2 = defaultDateLib) {
  return dateLib2.format(month, "LLLL");
}

// node_modules/react-day-picker/dist/esm/formatters/formatWeekNumber.js
function formatWeekNumber(weekNumber) {
  if (weekNumber < 10) {
    return `0${weekNumber.toLocaleString()}`;
  }
  return `${weekNumber.toLocaleString()}`;
}

// node_modules/react-day-picker/dist/esm/formatters/formatWeekNumberHeader.js
function formatWeekNumberHeader() {
  return ``;
}

// node_modules/react-day-picker/dist/esm/formatters/formatWeekdayName.js
function formatWeekdayName(weekday, options, dateLib2) {
  return (dateLib2 ?? new DateLib(options)).format(weekday, "cccccc");
}

// node_modules/react-day-picker/dist/esm/formatters/formatYearDropdown.js
function formatYearDropdown(year, dateLib2 = defaultDateLib) {
  return dateLib2.format(year, "yyyy");
}
var formatYearCaption = formatYearDropdown;

// node_modules/react-day-picker/dist/esm/helpers/getFormatters.js
function getFormatters(customFormatters) {
  if ((customFormatters == null ? void 0 : customFormatters.formatMonthCaption) && !customFormatters.formatCaption) {
    customFormatters.formatCaption = customFormatters.formatMonthCaption;
  }
  if ((customFormatters == null ? void 0 : customFormatters.formatYearCaption) && !customFormatters.formatYearDropdown) {
    customFormatters.formatYearDropdown = customFormatters.formatYearCaption;
  }
  return {
    ...formatters_exports,
    ...customFormatters
  };
}

// node_modules/react-day-picker/dist/esm/helpers/getMonthOptions.js
function getMonthOptions(displayMonth, navStart, navEnd, formatters2, dateLib2) {
  const { startOfMonth: startOfMonth2, startOfYear: startOfYear2, endOfYear: endOfYear2, eachMonthOfInterval: eachMonthOfInterval2, getMonth: getMonth2 } = dateLib2;
  const months = eachMonthOfInterval2({
    start: startOfYear2(displayMonth),
    end: endOfYear2(displayMonth)
  });
  const options = months.map((month) => {
    const label = formatters2.formatMonthDropdown(month, dateLib2);
    const value = getMonth2(month);
    const disabled = navStart && month < startOfMonth2(navStart) || navEnd && month > startOfMonth2(navEnd) || false;
    return { value, label, disabled };
  });
  return options;
}

// node_modules/react-day-picker/dist/esm/helpers/getStyleForModifiers.js
function getStyleForModifiers(dayModifiers, styles = {}, modifiersStyles = {}) {
  let style = { ...styles == null ? void 0 : styles[UI.Day] };
  Object.entries(dayModifiers).filter(([, active]) => active === true).forEach(([modifier]) => {
    style = {
      ...style,
      ...modifiersStyles == null ? void 0 : modifiersStyles[modifier]
    };
  });
  return style;
}

// node_modules/react-day-picker/dist/esm/helpers/getWeekdays.js
function getWeekdays(dateLib2, ISOWeek, broadcastCalendar) {
  const today = dateLib2.today();
  const start = broadcastCalendar ? dateLib2.startOfBroadcastWeek(today, dateLib2) : ISOWeek ? dateLib2.startOfISOWeek(today) : dateLib2.startOfWeek(today);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = dateLib2.addDays(start, i);
    days.push(day);
  }
  return days;
}

// node_modules/react-day-picker/dist/esm/helpers/getYearOptions.js
function getYearOptions(navStart, navEnd, formatters2, dateLib2) {
  if (!navStart)
    return void 0;
  if (!navEnd)
    return void 0;
  const { startOfYear: startOfYear2, endOfYear: endOfYear2, addYears: addYears2, getYear: getYear2, isBefore: isBefore2, isSameYear: isSameYear2 } = dateLib2;
  const firstNavYear = startOfYear2(navStart);
  const lastNavYear = endOfYear2(navEnd);
  const years = [];
  let year = firstNavYear;
  while (isBefore2(year, lastNavYear) || isSameYear2(year, lastNavYear)) {
    years.push(year);
    year = addYears2(year, 1);
  }
  return years.map((year2) => {
    const label = formatters2.formatYearDropdown(year2, dateLib2);
    return {
      value: getYear2(year2),
      label,
      disabled: false
    };
  });
}

// node_modules/react-day-picker/dist/esm/labels/index.js
var labels_exports = {};
__export(labels_exports, {
  labelCaption: () => labelCaption,
  labelDay: () => labelDay,
  labelDayButton: () => labelDayButton,
  labelGrid: () => labelGrid,
  labelGridcell: () => labelGridcell,
  labelMonthDropdown: () => labelMonthDropdown,
  labelNav: () => labelNav,
  labelNext: () => labelNext,
  labelPrevious: () => labelPrevious,
  labelWeekNumber: () => labelWeekNumber,
  labelWeekNumberHeader: () => labelWeekNumberHeader,
  labelWeekday: () => labelWeekday,
  labelYearDropdown: () => labelYearDropdown
});

// node_modules/react-day-picker/dist/esm/labels/labelGrid.js
function labelGrid(date, options, dateLib2) {
  return (dateLib2 ?? new DateLib(options)).format(date, "LLLL y");
}
var labelCaption = labelGrid;

// node_modules/react-day-picker/dist/esm/labels/labelGridcell.js
function labelGridcell(date, modifiers, options, dateLib2) {
  let label = (dateLib2 ?? new DateLib(options)).format(date, "PPPP");
  if (modifiers == null ? void 0 : modifiers.today) {
    label = `Today, ${label}`;
  }
  return label;
}

// node_modules/react-day-picker/dist/esm/labels/labelDayButton.js
function labelDayButton(date, modifiers, options, dateLib2) {
  let label = (dateLib2 ?? new DateLib(options)).format(date, "PPPP");
  if (modifiers.today)
    label = `Today, ${label}`;
  if (modifiers.selected)
    label = `${label}, selected`;
  return label;
}
var labelDay = labelDayButton;

// node_modules/react-day-picker/dist/esm/labels/labelNav.js
function labelNav() {
  return "";
}

// node_modules/react-day-picker/dist/esm/labels/labelMonthDropdown.js
function labelMonthDropdown(options) {
  return "Choose the Month";
}

// node_modules/react-day-picker/dist/esm/labels/labelNext.js
function labelNext(month) {
  return "Go to the Next Month";
}

// node_modules/react-day-picker/dist/esm/labels/labelPrevious.js
function labelPrevious(month) {
  return "Go to the Previous Month";
}

// node_modules/react-day-picker/dist/esm/labels/labelWeekday.js
function labelWeekday(date, options, dateLib2) {
  return (dateLib2 ?? new DateLib(options)).format(date, "cccc");
}

// node_modules/react-day-picker/dist/esm/labels/labelWeekNumber.js
function labelWeekNumber(weekNumber, options) {
  return `Week ${weekNumber}`;
}

// node_modules/react-day-picker/dist/esm/labels/labelWeekNumberHeader.js
function labelWeekNumberHeader(options) {
  return "Week Number";
}

// node_modules/react-day-picker/dist/esm/labels/labelYearDropdown.js
function labelYearDropdown(options) {
  return "Choose the Year";
}

// node_modules/react-day-picker/dist/esm/useAnimation.js
var import_react28 = __toESM(require_react(), 1);
function useAnimation(rootElRef, enabled, { classNames, months, focused, dateLib: dateLib2 }) {
  const previousRootElSnapshotRef = (0, import_react28.useRef)(null);
  const previousMonthsRef = (0, import_react28.useRef)(months);
  const animatingRef = (0, import_react28.useRef)(false);
  (0, import_react28.useLayoutEffect)(() => {
    const previousMonths = previousMonthsRef.current;
    previousMonthsRef.current = months;
    if (!enabled || !rootElRef.current || // safety check because the ref can be set to anything by consumers
    !(rootElRef.current instanceof HTMLElement)) {
      return;
    }
    const previousRootElSnapshot = previousRootElSnapshotRef.current;
    const rootElSnapshot = rootElRef.current.cloneNode(true);
    if (rootElSnapshot instanceof HTMLElement) {
      const currentMonthElsSnapshot = [
        ...rootElSnapshot.querySelectorAll(`[data-animated-month]`) ?? []
      ];
      currentMonthElsSnapshot.forEach((currentMonthElSnapshot) => {
        const previousMonthElSnapshot = currentMonthElSnapshot.querySelector(`[data-animated-month]`);
        if (previousMonthElSnapshot && currentMonthElSnapshot.contains(previousMonthElSnapshot)) {
          currentMonthElSnapshot.removeChild(previousMonthElSnapshot);
        }
      });
      previousRootElSnapshotRef.current = rootElSnapshot;
    } else {
      previousRootElSnapshotRef.current = null;
    }
    if (months.length === 0 || previousMonths.length === 0 || months.length !== previousMonths.length || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    focused || animatingRef.current) {
      return;
    }
    const isSameMonth2 = dateLib2.isSameMonth(months[0].date, previousMonths[0].date);
    if (isSameMonth2) {
      return;
    }
    const previousMonthEls = [
      ...(previousRootElSnapshot == null ? void 0 : previousRootElSnapshot.querySelectorAll(`[data-animated-month]`)) ?? []
    ];
    const currentMonthEls = [
      ...rootElRef.current.querySelectorAll(`[data-animated-month]`) ?? []
    ];
    if (currentMonthEls && currentMonthEls.every((el) => el instanceof HTMLElement) && previousMonthEls && previousMonthEls.every((el) => el instanceof HTMLElement)) {
      animatingRef.current = true;
      const cleanUpFunctions = [];
      const isAfterPreviousMonth = dateLib2.isAfter(months[0].date, previousMonths[0].date);
      currentMonthEls.forEach((currentMonthEl, index) => {
        const previousMonthEl = previousMonthEls[index];
        if (!previousMonthEl) {
          return;
        }
        const captionAnimationClass = isAfterPreviousMonth ? classNames[Animation.caption_after_enter] : classNames[Animation.caption_before_enter];
        const weeksAnimationClass = isAfterPreviousMonth ? classNames[Animation.weeks_after_enter] : classNames[Animation.weeks_before_enter];
        currentMonthEl.style.position = "relative";
        currentMonthEl.style.overflow = "hidden";
        const captionEl = currentMonthEl.querySelector(`[data-animated-caption]`);
        if (captionEl && captionEl instanceof HTMLElement) {
          captionEl.classList.add(captionAnimationClass);
        }
        const weeksEl = currentMonthEl.querySelector(`[data-animated-weeks]`);
        if (weeksEl && weeksEl instanceof HTMLElement) {
          weeksEl.classList.add(weeksAnimationClass);
        }
        const cleanUp = () => {
          animatingRef.current = false;
          if (captionEl && captionEl instanceof HTMLElement) {
            captionEl.classList.remove(captionAnimationClass);
          }
          if (weeksEl && weeksEl instanceof HTMLElement) {
            weeksEl.classList.remove(weeksAnimationClass);
          }
          currentMonthEl.style.position = "";
          currentMonthEl.style.overflow = "";
          if (currentMonthEl.contains(previousMonthEl)) {
            currentMonthEl.removeChild(previousMonthEl);
          }
        };
        cleanUpFunctions.push(cleanUp);
        previousMonthEl.style.pointerEvents = "none";
        previousMonthEl.style.position = "absolute";
        previousMonthEl.style.overflow = "hidden";
        previousMonthEl.setAttribute("aria-hidden", "true");
        const previousWeekdaysEl = previousMonthEl.querySelector(`[data-animated-weekdays]`);
        if (previousWeekdaysEl && previousWeekdaysEl instanceof HTMLElement) {
          previousWeekdaysEl.style.opacity = "0";
        }
        const previousCaptionEl = previousMonthEl.querySelector(`[data-animated-caption]`);
        if (previousCaptionEl && previousCaptionEl instanceof HTMLElement) {
          previousCaptionEl.classList.add(isAfterPreviousMonth ? classNames[Animation.caption_before_exit] : classNames[Animation.caption_after_exit]);
          previousCaptionEl.addEventListener("animationend", cleanUp);
        }
        const previousWeeksEl = previousMonthEl.querySelector(`[data-animated-weeks]`);
        if (previousWeeksEl && previousWeeksEl instanceof HTMLElement) {
          previousWeeksEl.classList.add(isAfterPreviousMonth ? classNames[Animation.weeks_before_exit] : classNames[Animation.weeks_after_exit]);
        }
        currentMonthEl.insertBefore(previousMonthEl, currentMonthEl.firstChild);
      });
    }
  });
}

// node_modules/react-day-picker/dist/esm/useCalendar.js
var import_react30 = __toESM(require_react(), 1);

// node_modules/react-day-picker/dist/esm/helpers/getDates.js
function getDates(displayMonths, maxDate, props, dateLib2) {
  const firstMonth = displayMonths[0];
  const lastMonth = displayMonths[displayMonths.length - 1];
  const { ISOWeek, fixedWeeks, broadcastCalendar } = props ?? {};
  const { addDays: addDays2, differenceInCalendarDays: differenceInCalendarDays2, differenceInCalendarMonths: differenceInCalendarMonths2, endOfBroadcastWeek: endOfBroadcastWeek2, endOfISOWeek: endOfISOWeek2, endOfMonth: endOfMonth2, endOfWeek: endOfWeek2, isAfter: isAfter2, startOfBroadcastWeek: startOfBroadcastWeek2, startOfISOWeek: startOfISOWeek2, startOfWeek: startOfWeek2 } = dateLib2;
  const startWeekFirstDate = broadcastCalendar ? startOfBroadcastWeek2(firstMonth, dateLib2) : ISOWeek ? startOfISOWeek2(firstMonth) : startOfWeek2(firstMonth);
  const endWeekLastDate = broadcastCalendar ? endOfBroadcastWeek2(lastMonth, dateLib2) : ISOWeek ? endOfISOWeek2(endOfMonth2(lastMonth)) : endOfWeek2(endOfMonth2(lastMonth));
  const nOfDays = differenceInCalendarDays2(endWeekLastDate, startWeekFirstDate);
  const nOfMonths = differenceInCalendarMonths2(lastMonth, firstMonth) + 1;
  const dates = [];
  for (let i = 0; i <= nOfDays; i++) {
    const date = addDays2(startWeekFirstDate, i);
    if (maxDate && isAfter2(date, maxDate)) {
      break;
    }
    dates.push(date);
  }
  const nrOfDaysWithFixedWeeks = broadcastCalendar ? 35 : 42;
  const extraDates = nrOfDaysWithFixedWeeks * nOfMonths;
  if (fixedWeeks && dates.length < extraDates) {
    const daysToAdd = extraDates - dates.length;
    for (let i = 0; i < daysToAdd; i++) {
      const date = addDays2(dates[dates.length - 1], 1);
      dates.push(date);
    }
  }
  return dates;
}

// node_modules/react-day-picker/dist/esm/helpers/getDays.js
function getDays(calendarMonths) {
  const initialDays = [];
  return calendarMonths.reduce((days, month) => {
    const initialDays2 = [];
    const weekDays = month.weeks.reduce((weekDays2, week2) => {
      return [...weekDays2, ...week2.days];
    }, initialDays2);
    return [...days, ...weekDays];
  }, initialDays);
}

// node_modules/react-day-picker/dist/esm/helpers/getDisplayMonths.js
function getDisplayMonths(firstDisplayedMonth, calendarEndMonth, props, dateLib2) {
  const { numberOfMonths = 1 } = props;
  const months = [];
  for (let i = 0; i < numberOfMonths; i++) {
    const month = dateLib2.addMonths(firstDisplayedMonth, i);
    if (calendarEndMonth && month > calendarEndMonth) {
      break;
    }
    months.push(month);
  }
  return months;
}

// node_modules/react-day-picker/dist/esm/helpers/getInitialMonth.js
function getInitialMonth(props, dateLib2) {
  const { month, defaultMonth, today = dateLib2.today(), numberOfMonths = 1, endMonth, startMonth } = props;
  let initialMonth = month || defaultMonth || today;
  const { differenceInCalendarMonths: differenceInCalendarMonths2, addMonths: addMonths2, startOfMonth: startOfMonth2 } = dateLib2;
  if (endMonth && differenceInCalendarMonths2(endMonth, initialMonth) < 0) {
    const offset = -1 * (numberOfMonths - 1);
    initialMonth = addMonths2(endMonth, offset);
  }
  if (startMonth && differenceInCalendarMonths2(initialMonth, startMonth) < 0) {
    initialMonth = startMonth;
  }
  return startOfMonth2(initialMonth);
}

// node_modules/react-day-picker/dist/esm/classes/CalendarDay.js
var CalendarDay = class {
  constructor(date, displayMonth, dateLib2 = defaultDateLib) {
    this.date = date;
    this.displayMonth = displayMonth;
    this.outside = Boolean(displayMonth && !dateLib2.isSameMonth(date, displayMonth));
    this.dateLib = dateLib2;
  }
  /**
   * Check if the day is the same as the given day: considering if it is in the
   * same display month.
   */
  isEqualTo(day) {
    return this.dateLib.isSameDay(day.date, this.date) && this.dateLib.isSameMonth(day.displayMonth, this.displayMonth);
  }
};

// node_modules/react-day-picker/dist/esm/classes/CalendarMonth.js
var CalendarMonth = class {
  constructor(month, weeks) {
    this.date = month;
    this.weeks = weeks;
  }
};

// node_modules/react-day-picker/dist/esm/classes/CalendarWeek.js
var CalendarWeek = class {
  constructor(weekNumber, days) {
    this.days = days;
    this.weekNumber = weekNumber;
  }
};

// node_modules/react-day-picker/dist/esm/helpers/getMonths.js
function getMonths(displayMonths, dates, props, dateLib2) {
  const { addDays: addDays2, endOfBroadcastWeek: endOfBroadcastWeek2, endOfISOWeek: endOfISOWeek2, endOfMonth: endOfMonth2, endOfWeek: endOfWeek2, getISOWeek: getISOWeek2, getWeek: getWeek2, startOfBroadcastWeek: startOfBroadcastWeek2, startOfISOWeek: startOfISOWeek2, startOfWeek: startOfWeek2 } = dateLib2;
  const dayPickerMonths = displayMonths.reduce((months, month) => {
    const firstDateOfFirstWeek = props.broadcastCalendar ? startOfBroadcastWeek2(month, dateLib2) : props.ISOWeek ? startOfISOWeek2(month) : startOfWeek2(month);
    const lastDateOfLastWeek = props.broadcastCalendar ? endOfBroadcastWeek2(month, dateLib2) : props.ISOWeek ? endOfISOWeek2(endOfMonth2(month)) : endOfWeek2(endOfMonth2(month));
    const monthDates = dates.filter((date) => {
      return date >= firstDateOfFirstWeek && date <= lastDateOfLastWeek;
    });
    const nrOfDaysWithFixedWeeks = props.broadcastCalendar ? 35 : 42;
    if (props.fixedWeeks && monthDates.length < nrOfDaysWithFixedWeeks) {
      const extraDates = dates.filter((date) => {
        const daysToAdd = nrOfDaysWithFixedWeeks - monthDates.length;
        return date > lastDateOfLastWeek && date <= addDays2(lastDateOfLastWeek, daysToAdd);
      });
      monthDates.push(...extraDates);
    }
    const weeks = monthDates.reduce((weeks2, date) => {
      const weekNumber = props.ISOWeek ? getISOWeek2(date) : getWeek2(date);
      const week2 = weeks2.find((week3) => week3.weekNumber === weekNumber);
      const day = new CalendarDay(date, month, dateLib2);
      if (!week2) {
        weeks2.push(new CalendarWeek(weekNumber, [day]));
      } else {
        week2.days.push(day);
      }
      return weeks2;
    }, []);
    const dayPickerMonth = new CalendarMonth(month, weeks);
    months.push(dayPickerMonth);
    return months;
  }, []);
  if (!props.reverseMonths) {
    return dayPickerMonths;
  } else {
    return dayPickerMonths.reverse();
  }
}

// node_modules/react-day-picker/dist/esm/helpers/getNavMonth.js
function getNavMonths(props, dateLib2) {
  let { startMonth, endMonth } = props;
  const { startOfYear: startOfYear2, startOfDay: startOfDay2, startOfMonth: startOfMonth2, endOfMonth: endOfMonth2, addYears: addYears2, endOfYear: endOfYear2, newDate, today } = dateLib2;
  const { fromYear, toYear, fromMonth, toMonth } = props;
  if (!startMonth && fromMonth) {
    startMonth = fromMonth;
  }
  if (!startMonth && fromYear) {
    startMonth = dateLib2.newDate(fromYear, 0, 1);
  }
  if (!endMonth && toMonth) {
    endMonth = toMonth;
  }
  if (!endMonth && toYear) {
    endMonth = newDate(toYear, 11, 31);
  }
  const hasYearDropdown = props.captionLayout === "dropdown" || props.captionLayout === "dropdown-years";
  if (startMonth) {
    startMonth = startOfMonth2(startMonth);
  } else if (fromYear) {
    startMonth = newDate(fromYear, 0, 1);
  } else if (!startMonth && hasYearDropdown) {
    startMonth = startOfYear2(addYears2(props.today ?? today(), -100));
  }
  if (endMonth) {
    endMonth = endOfMonth2(endMonth);
  } else if (toYear) {
    endMonth = newDate(toYear, 11, 31);
  } else if (!endMonth && hasYearDropdown) {
    endMonth = endOfYear2(props.today ?? today());
  }
  return [
    startMonth ? startOfDay2(startMonth) : startMonth,
    endMonth ? startOfDay2(endMonth) : endMonth
  ];
}

// node_modules/react-day-picker/dist/esm/helpers/getNextMonth.js
function getNextMonth(firstDisplayedMonth, calendarEndMonth, options, dateLib2) {
  if (options.disableNavigation) {
    return void 0;
  }
  const { pagedNavigation, numberOfMonths = 1 } = options;
  const { startOfMonth: startOfMonth2, addMonths: addMonths2, differenceInCalendarMonths: differenceInCalendarMonths2 } = dateLib2;
  const offset = pagedNavigation ? numberOfMonths : 1;
  const month = startOfMonth2(firstDisplayedMonth);
  if (!calendarEndMonth) {
    return addMonths2(month, offset);
  }
  const monthsDiff = differenceInCalendarMonths2(calendarEndMonth, firstDisplayedMonth);
  if (monthsDiff < numberOfMonths) {
    return void 0;
  }
  return addMonths2(month, offset);
}

// node_modules/react-day-picker/dist/esm/helpers/getPreviousMonth.js
function getPreviousMonth(firstDisplayedMonth, calendarStartMonth, options, dateLib2) {
  if (options.disableNavigation) {
    return void 0;
  }
  const { pagedNavigation, numberOfMonths } = options;
  const { startOfMonth: startOfMonth2, addMonths: addMonths2, differenceInCalendarMonths: differenceInCalendarMonths2 } = dateLib2;
  const offset = pagedNavigation ? numberOfMonths ?? 1 : 1;
  const month = startOfMonth2(firstDisplayedMonth);
  if (!calendarStartMonth) {
    return addMonths2(month, -offset);
  }
  const monthsDiff = differenceInCalendarMonths2(month, calendarStartMonth);
  if (monthsDiff <= 0) {
    return void 0;
  }
  return addMonths2(month, -offset);
}

// node_modules/react-day-picker/dist/esm/helpers/getWeeks.js
function getWeeks(months) {
  const initialWeeks = [];
  return months.reduce((weeks, month) => {
    return [...weeks, ...month.weeks];
  }, initialWeeks);
}

// node_modules/react-day-picker/dist/esm/helpers/useControlledValue.js
var import_react29 = __toESM(require_react(), 1);
function useControlledValue(defaultValue, controlledValue) {
  const [uncontrolledValue, setValue] = (0, import_react29.useState)(defaultValue);
  const value = controlledValue === void 0 ? uncontrolledValue : controlledValue;
  return [value, setValue];
}

// node_modules/react-day-picker/dist/esm/useCalendar.js
function useCalendar(props, dateLib2) {
  const [navStart, navEnd] = getNavMonths(props, dateLib2);
  const { startOfMonth: startOfMonth2, endOfMonth: endOfMonth2 } = dateLib2;
  const initialMonth = getInitialMonth(props, dateLib2);
  const [firstMonth, setFirstMonth] = useControlledValue(
    initialMonth,
    // initialMonth is always computed from props.month if provided
    props.month ? initialMonth : void 0
  );
  (0, import_react30.useEffect)(() => {
    const newInitialMonth = getInitialMonth(props, dateLib2);
    setFirstMonth(newInitialMonth);
  }, [props.timeZone]);
  const displayMonths = getDisplayMonths(firstMonth, navEnd, props, dateLib2);
  const dates = getDates(displayMonths, props.endMonth ? endOfMonth2(props.endMonth) : void 0, props, dateLib2);
  const months = getMonths(displayMonths, dates, props, dateLib2);
  const weeks = getWeeks(months);
  const days = getDays(months);
  const previousMonth = getPreviousMonth(firstMonth, navStart, props, dateLib2);
  const nextMonth = getNextMonth(firstMonth, navEnd, props, dateLib2);
  const { disableNavigation, onMonthChange } = props;
  const isDayInCalendar = (day) => weeks.some((week2) => week2.days.some((d) => d.isEqualTo(day)));
  const goToMonth = (date) => {
    if (disableNavigation) {
      return;
    }
    let newMonth = startOfMonth2(date);
    if (navStart && newMonth < startOfMonth2(navStart)) {
      newMonth = startOfMonth2(navStart);
    }
    if (navEnd && newMonth > startOfMonth2(navEnd)) {
      newMonth = startOfMonth2(navEnd);
    }
    setFirstMonth(newMonth);
    onMonthChange == null ? void 0 : onMonthChange(newMonth);
  };
  const goToDay = (day) => {
    if (isDayInCalendar(day)) {
      return;
    }
    goToMonth(day.date);
  };
  const calendar = {
    months,
    weeks,
    days,
    navStart,
    navEnd,
    previousMonth,
    nextMonth,
    goToMonth,
    goToDay
  };
  return calendar;
}

// node_modules/react-day-picker/dist/esm/useFocus.js
var import_react31 = __toESM(require_react(), 1);

// node_modules/react-day-picker/dist/esm/helpers/calculateFocusTarget.js
function calculateFocusTarget(days, getModifiers, isSelected, lastFocused) {
  let focusTarget;
  let index = 0;
  let found = false;
  while (index < days.length && !found) {
    const day = days[index];
    const modifiers = getModifiers(day);
    if (!modifiers[DayFlag.disabled] && !modifiers[DayFlag.hidden] && !modifiers[DayFlag.outside]) {
      if (modifiers[DayFlag.focused]) {
        focusTarget = day;
        found = true;
      } else if (lastFocused == null ? void 0 : lastFocused.isEqualTo(day)) {
        focusTarget = day;
        found = true;
      } else if (isSelected(day.date)) {
        focusTarget = day;
        found = true;
      } else if (modifiers[DayFlag.today]) {
        focusTarget = day;
        found = true;
      }
    }
    index++;
  }
  if (!focusTarget) {
    focusTarget = days.find((day) => {
      const m = getModifiers(day);
      return !m[DayFlag.disabled] && !m[DayFlag.hidden] && !m[DayFlag.outside];
    });
  }
  return focusTarget;
}

// node_modules/react-day-picker/dist/esm/utils/rangeIncludesDate.js
function rangeIncludesDate(range, date, excludeEnds = false, dateLib2 = defaultDateLib) {
  let { from, to } = range;
  const { differenceInCalendarDays: differenceInCalendarDays2, isSameDay: isSameDay2 } = dateLib2;
  if (from && to) {
    const isRangeInverted = differenceInCalendarDays2(to, from) < 0;
    if (isRangeInverted) {
      [from, to] = [to, from];
    }
    const isInRange = differenceInCalendarDays2(date, from) >= (excludeEnds ? 1 : 0) && differenceInCalendarDays2(to, date) >= (excludeEnds ? 1 : 0);
    return isInRange;
  }
  if (!excludeEnds && to) {
    return isSameDay2(to, date);
  }
  if (!excludeEnds && from) {
    return isSameDay2(from, date);
  }
  return false;
}
var isDateInRange = (range, date) => rangeIncludesDate(range, date, false, defaultDateLib);

// node_modules/react-day-picker/dist/esm/utils/typeguards.js
function isDateInterval(matcher) {
  return Boolean(matcher && typeof matcher === "object" && "before" in matcher && "after" in matcher);
}
function isDateRange(value) {
  return Boolean(value && typeof value === "object" && "from" in value);
}
function isDateAfterType(value) {
  return Boolean(value && typeof value === "object" && "after" in value);
}
function isDateBeforeType(value) {
  return Boolean(value && typeof value === "object" && "before" in value);
}
function isDayOfWeekType(value) {
  return Boolean(value && typeof value === "object" && "dayOfWeek" in value);
}
function isDatesArray(value, dateLib2) {
  return Array.isArray(value) && value.every(dateLib2.isDate);
}

// node_modules/react-day-picker/dist/esm/utils/dateMatchModifiers.js
function dateMatchModifiers(date, matchers, dateLib2 = defaultDateLib) {
  const matchersArr = !Array.isArray(matchers) ? [matchers] : matchers;
  const { isSameDay: isSameDay2, differenceInCalendarDays: differenceInCalendarDays2, isAfter: isAfter2 } = dateLib2;
  return matchersArr.some((matcher) => {
    if (typeof matcher === "boolean") {
      return matcher;
    }
    if (dateLib2.isDate(matcher)) {
      return isSameDay2(date, matcher);
    }
    if (isDatesArray(matcher, dateLib2)) {
      return matcher.includes(date);
    }
    if (isDateRange(matcher)) {
      return rangeIncludesDate(matcher, date, false, dateLib2);
    }
    if (isDayOfWeekType(matcher)) {
      if (!Array.isArray(matcher.dayOfWeek)) {
        return matcher.dayOfWeek === date.getDay();
      }
      return matcher.dayOfWeek.includes(date.getDay());
    }
    if (isDateInterval(matcher)) {
      const diffBefore = differenceInCalendarDays2(matcher.before, date);
      const diffAfter = differenceInCalendarDays2(matcher.after, date);
      const isDayBefore = diffBefore > 0;
      const isDayAfter = diffAfter < 0;
      const isClosedInterval = isAfter2(matcher.before, matcher.after);
      if (isClosedInterval) {
        return isDayAfter && isDayBefore;
      } else {
        return isDayBefore || isDayAfter;
      }
    }
    if (isDateAfterType(matcher)) {
      return differenceInCalendarDays2(date, matcher.after) > 0;
    }
    if (isDateBeforeType(matcher)) {
      return differenceInCalendarDays2(matcher.before, date) > 0;
    }
    if (typeof matcher === "function") {
      return matcher(date);
    }
    return false;
  });
}
var isMatch = dateMatchModifiers;

// node_modules/react-day-picker/dist/esm/helpers/getFocusableDate.js
function getFocusableDate(moveBy, moveDir, refDate, navStart, navEnd, props, dateLib2) {
  const { ISOWeek, broadcastCalendar } = props;
  const { addDays: addDays2, addMonths: addMonths2, addWeeks: addWeeks2, addYears: addYears2, endOfBroadcastWeek: endOfBroadcastWeek2, endOfISOWeek: endOfISOWeek2, endOfWeek: endOfWeek2, max: max2, min: min2, startOfBroadcastWeek: startOfBroadcastWeek2, startOfISOWeek: startOfISOWeek2, startOfWeek: startOfWeek2 } = dateLib2;
  const moveFns = {
    day: addDays2,
    week: addWeeks2,
    month: addMonths2,
    year: addYears2,
    startOfWeek: (date) => broadcastCalendar ? startOfBroadcastWeek2(date, dateLib2) : ISOWeek ? startOfISOWeek2(date) : startOfWeek2(date),
    endOfWeek: (date) => broadcastCalendar ? endOfBroadcastWeek2(date, dateLib2) : ISOWeek ? endOfISOWeek2(date) : endOfWeek2(date)
  };
  let focusableDate = moveFns[moveBy](refDate, moveDir === "after" ? 1 : -1);
  if (moveDir === "before" && navStart) {
    focusableDate = max2([navStart, focusableDate]);
  } else if (moveDir === "after" && navEnd) {
    focusableDate = min2([navEnd, focusableDate]);
  }
  return focusableDate;
}

// node_modules/react-day-picker/dist/esm/helpers/getNextFocus.js
function getNextFocus(moveBy, moveDir, refDay, calendarStartMonth, calendarEndMonth, props, dateLib2, attempt = 0) {
  if (attempt > 365) {
    return void 0;
  }
  const focusableDate = getFocusableDate(
    moveBy,
    moveDir,
    refDay.date,
    // should be refDay? or refDay.date?
    calendarStartMonth,
    calendarEndMonth,
    props,
    dateLib2
  );
  const isDisabled = Boolean(props.disabled && dateMatchModifiers(focusableDate, props.disabled, dateLib2));
  const isHidden = Boolean(props.hidden && dateMatchModifiers(focusableDate, props.hidden, dateLib2));
  const targetMonth = focusableDate;
  const focusDay = new CalendarDay(focusableDate, targetMonth, dateLib2);
  if (!isDisabled && !isHidden) {
    return focusDay;
  }
  return getNextFocus(moveBy, moveDir, focusDay, calendarStartMonth, calendarEndMonth, props, dateLib2, attempt + 1);
}

// node_modules/react-day-picker/dist/esm/useFocus.js
function useFocus(props, calendar, getModifiers, isSelected, dateLib2) {
  const { autoFocus } = props;
  const [lastFocused, setLastFocused] = (0, import_react31.useState)();
  const focusTarget = calculateFocusTarget(calendar.days, getModifiers, isSelected || (() => false), lastFocused);
  const [focusedDay, setFocused] = (0, import_react31.useState)(autoFocus ? focusTarget : void 0);
  const blur = () => {
    setLastFocused(focusedDay);
    setFocused(void 0);
  };
  const moveFocus = (moveBy, moveDir) => {
    if (!focusedDay)
      return;
    const nextFocus = getNextFocus(moveBy, moveDir, focusedDay, calendar.navStart, calendar.navEnd, props, dateLib2);
    if (!nextFocus)
      return;
    calendar.goToDay(nextFocus);
    setFocused(nextFocus);
  };
  const isFocusTarget = (day) => {
    return Boolean(focusTarget == null ? void 0 : focusTarget.isEqualTo(day));
  };
  const useFocus2 = {
    isFocusTarget,
    setFocused,
    focused: focusedDay,
    blur,
    moveFocus
  };
  return useFocus2;
}

// node_modules/react-day-picker/dist/esm/useGetModifiers.js
function useGetModifiers(days, props, dateLib2) {
  const { disabled, hidden, modifiers, showOutsideDays, broadcastCalendar, today } = props;
  const { isSameDay: isSameDay2, isSameMonth: isSameMonth2, startOfMonth: startOfMonth2, isBefore: isBefore2, endOfMonth: endOfMonth2, isAfter: isAfter2 } = dateLib2;
  const startMonth = props.startMonth && startOfMonth2(props.startMonth);
  const endMonth = props.endMonth && endOfMonth2(props.endMonth);
  const internalModifiersMap = {
    [DayFlag.focused]: [],
    [DayFlag.outside]: [],
    [DayFlag.disabled]: [],
    [DayFlag.hidden]: [],
    [DayFlag.today]: []
  };
  const customModifiersMap = {};
  for (const day of days) {
    const { date, displayMonth } = day;
    const isOutside = Boolean(displayMonth && !isSameMonth2(date, displayMonth));
    const isBeforeStartMonth = Boolean(startMonth && isBefore2(date, startMonth));
    const isAfterEndMonth = Boolean(endMonth && isAfter2(date, endMonth));
    const isDisabled = Boolean(disabled && dateMatchModifiers(date, disabled, dateLib2));
    const isHidden = Boolean(hidden && dateMatchModifiers(date, hidden, dateLib2)) || isBeforeStartMonth || isAfterEndMonth || // Broadcast calendar will show outside days as default
    !broadcastCalendar && !showOutsideDays && isOutside || broadcastCalendar && showOutsideDays === false && isOutside;
    const isToday = isSameDay2(date, today ?? dateLib2.today());
    if (isOutside)
      internalModifiersMap.outside.push(day);
    if (isDisabled)
      internalModifiersMap.disabled.push(day);
    if (isHidden)
      internalModifiersMap.hidden.push(day);
    if (isToday)
      internalModifiersMap.today.push(day);
    if (modifiers) {
      Object.keys(modifiers).forEach((name) => {
        const modifierValue = modifiers == null ? void 0 : modifiers[name];
        const isMatch2 = modifierValue ? dateMatchModifiers(date, modifierValue, dateLib2) : false;
        if (!isMatch2)
          return;
        if (customModifiersMap[name]) {
          customModifiersMap[name].push(day);
        } else {
          customModifiersMap[name] = [day];
        }
      });
    }
  }
  return (day) => {
    const dayFlags = {
      [DayFlag.focused]: false,
      [DayFlag.disabled]: false,
      [DayFlag.hidden]: false,
      [DayFlag.outside]: false,
      [DayFlag.today]: false
    };
    const customModifiers = {};
    for (const name in internalModifiersMap) {
      const days2 = internalModifiersMap[name];
      dayFlags[name] = days2.some((d) => d === day);
    }
    for (const name in customModifiersMap) {
      customModifiers[name] = customModifiersMap[name].some((d) => d === day);
    }
    return {
      ...dayFlags,
      // custom modifiers should override all the previous ones
      ...customModifiers
    };
  };
}

// node_modules/react-day-picker/dist/esm/selection/useMulti.js
function useMulti(props, dateLib2) {
  const { selected: initiallySelected, required, onSelect } = props;
  const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
  const selected = !onSelect ? internallySelected : initiallySelected;
  const { isSameDay: isSameDay2 } = dateLib2;
  const isSelected = (date) => {
    return (selected == null ? void 0 : selected.some((d) => isSameDay2(d, date))) ?? false;
  };
  const { min: min2, max: max2 } = props;
  const select = (triggerDate, modifiers, e) => {
    let newDates = [...selected ?? []];
    if (isSelected(triggerDate)) {
      if ((selected == null ? void 0 : selected.length) === min2) {
        return;
      }
      if (required && (selected == null ? void 0 : selected.length) === 1) {
        return;
      }
      newDates = selected == null ? void 0 : selected.filter((d) => !isSameDay2(d, triggerDate));
    } else {
      if ((selected == null ? void 0 : selected.length) === max2) {
        newDates = [triggerDate];
      } else {
        newDates = [...newDates, triggerDate];
      }
    }
    if (!onSelect) {
      setSelected(newDates);
    }
    onSelect == null ? void 0 : onSelect(newDates, triggerDate, modifiers, e);
    return newDates;
  };
  return {
    selected,
    select,
    isSelected
  };
}

// node_modules/react-day-picker/dist/esm/utils/addToRange.js
function addToRange(date, initialRange, min2 = 0, max2 = 0, required = false, dateLib2 = defaultDateLib) {
  const { from, to } = initialRange || {};
  const { isSameDay: isSameDay2, isAfter: isAfter2, isBefore: isBefore2 } = dateLib2;
  let range;
  if (!from && !to) {
    range = { from: date, to: min2 > 0 ? void 0 : date };
  } else if (from && !to) {
    if (isSameDay2(from, date)) {
      if (required) {
        range = { from, to: void 0 };
      } else {
        range = void 0;
      }
    } else if (isBefore2(date, from)) {
      range = { from: date, to: from };
    } else {
      range = { from, to: date };
    }
  } else if (from && to) {
    if (isSameDay2(from, date) && isSameDay2(to, date)) {
      if (required) {
        range = { from, to };
      } else {
        range = void 0;
      }
    } else if (isSameDay2(from, date)) {
      range = { from, to: min2 > 0 ? void 0 : date };
    } else if (isSameDay2(to, date)) {
      range = { from: date, to: min2 > 0 ? void 0 : date };
    } else if (isBefore2(date, from)) {
      range = { from: date, to };
    } else if (isAfter2(date, from)) {
      range = { from, to: date };
    } else if (isAfter2(date, to)) {
      range = { from, to: date };
    } else {
      throw new Error("Invalid range");
    }
  }
  if ((range == null ? void 0 : range.from) && (range == null ? void 0 : range.to)) {
    const diff = dateLib2.differenceInCalendarDays(range.to, range.from);
    if (max2 > 0 && diff > max2) {
      range = { from: date, to: void 0 };
    } else if (min2 > 1 && diff < min2) {
      range = { from: date, to: void 0 };
    }
  }
  return range;
}

// node_modules/react-day-picker/dist/esm/utils/rangeContainsDayOfWeek.js
function rangeContainsDayOfWeek(range, dayOfWeek, dateLib2 = defaultDateLib) {
  const dayOfWeekArr = !Array.isArray(dayOfWeek) ? [dayOfWeek] : dayOfWeek;
  let date = range.from;
  const totalDays = dateLib2.differenceInCalendarDays(range.to, range.from);
  const totalDaysLimit = Math.min(totalDays, 6);
  for (let i = 0; i <= totalDaysLimit; i++) {
    if (dayOfWeekArr.includes(date.getDay())) {
      return true;
    }
    date = dateLib2.addDays(date, 1);
  }
  return false;
}

// node_modules/react-day-picker/dist/esm/utils/rangeOverlaps.js
function rangeOverlaps(rangeLeft, rangeRight, dateLib2 = defaultDateLib) {
  return rangeIncludesDate(rangeLeft, rangeRight.from, false, dateLib2) || rangeIncludesDate(rangeLeft, rangeRight.to, false, dateLib2) || rangeIncludesDate(rangeRight, rangeLeft.from, false, dateLib2) || rangeIncludesDate(rangeRight, rangeLeft.to, false, dateLib2);
}

// node_modules/react-day-picker/dist/esm/utils/rangeContainsModifiers.js
function rangeContainsModifiers(range, modifiers, dateLib2 = defaultDateLib) {
  const matchers = Array.isArray(modifiers) ? modifiers : [modifiers];
  const nonFunctionMatchers = matchers.filter((matcher) => typeof matcher !== "function");
  const nonFunctionMatchersResult = nonFunctionMatchers.some((matcher) => {
    if (typeof matcher === "boolean")
      return matcher;
    if (dateLib2.isDate(matcher)) {
      return rangeIncludesDate(range, matcher, false, dateLib2);
    }
    if (isDatesArray(matcher, dateLib2)) {
      return matcher.some((date) => rangeIncludesDate(range, date, false, dateLib2));
    }
    if (isDateRange(matcher)) {
      if (matcher.from && matcher.to) {
        return rangeOverlaps(range, { from: matcher.from, to: matcher.to }, dateLib2);
      }
      return false;
    }
    if (isDayOfWeekType(matcher)) {
      return rangeContainsDayOfWeek(range, matcher.dayOfWeek, dateLib2);
    }
    if (isDateInterval(matcher)) {
      const isClosedInterval = dateLib2.isAfter(matcher.before, matcher.after);
      if (isClosedInterval) {
        return rangeOverlaps(range, {
          from: dateLib2.addDays(matcher.after, 1),
          to: dateLib2.addDays(matcher.before, -1)
        }, dateLib2);
      }
      return dateMatchModifiers(range.from, matcher, dateLib2) || dateMatchModifiers(range.to, matcher, dateLib2);
    }
    if (isDateAfterType(matcher) || isDateBeforeType(matcher)) {
      return dateMatchModifiers(range.from, matcher, dateLib2) || dateMatchModifiers(range.to, matcher, dateLib2);
    }
    return false;
  });
  if (nonFunctionMatchersResult) {
    return true;
  }
  const functionMatchers = matchers.filter((matcher) => typeof matcher === "function");
  if (functionMatchers.length) {
    let date = range.from;
    const totalDays = dateLib2.differenceInCalendarDays(range.to, range.from);
    for (let i = 0; i <= totalDays; i++) {
      if (functionMatchers.some((matcher) => matcher(date))) {
        return true;
      }
      date = dateLib2.addDays(date, 1);
    }
  }
  return false;
}

// node_modules/react-day-picker/dist/esm/selection/useRange.js
function useRange(props, dateLib2) {
  const { disabled, excludeDisabled, selected: initiallySelected, required, onSelect } = props;
  const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
  const selected = !onSelect ? internallySelected : initiallySelected;
  const isSelected = (date) => selected && rangeIncludesDate(selected, date, false, dateLib2);
  const select = (triggerDate, modifiers, e) => {
    const { min: min2, max: max2 } = props;
    const newRange = triggerDate ? addToRange(triggerDate, selected, min2, max2, required, dateLib2) : void 0;
    if (excludeDisabled && disabled && (newRange == null ? void 0 : newRange.from) && newRange.to) {
      if (rangeContainsModifiers({ from: newRange.from, to: newRange.to }, disabled, dateLib2)) {
        newRange.from = triggerDate;
        newRange.to = void 0;
      }
    }
    if (!onSelect) {
      setSelected(newRange);
    }
    onSelect == null ? void 0 : onSelect(newRange, triggerDate, modifiers, e);
    return newRange;
  };
  return {
    selected,
    select,
    isSelected
  };
}

// node_modules/react-day-picker/dist/esm/selection/useSingle.js
function useSingle(props, dateLib2) {
  const { selected: initiallySelected, required, onSelect } = props;
  const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
  const selected = !onSelect ? internallySelected : initiallySelected;
  const { isSameDay: isSameDay2 } = dateLib2;
  const isSelected = (compareDate) => {
    return selected ? isSameDay2(selected, compareDate) : false;
  };
  const select = (triggerDate, modifiers, e) => {
    let newDate = triggerDate;
    if (!required && selected && selected && isSameDay2(triggerDate, selected)) {
      newDate = void 0;
    }
    if (!onSelect) {
      setSelected(newDate);
    }
    if (required) {
      onSelect == null ? void 0 : onSelect(newDate, triggerDate, modifiers, e);
    } else {
      onSelect == null ? void 0 : onSelect(newDate, triggerDate, modifiers, e);
    }
    return newDate;
  };
  return {
    selected,
    select,
    isSelected
  };
}

// node_modules/react-day-picker/dist/esm/useSelection.js
function useSelection(props, dateLib2) {
  const single = useSingle(props, dateLib2);
  const multi = useMulti(props, dateLib2);
  const range = useRange(props, dateLib2);
  switch (props.mode) {
    case "single":
      return single;
    case "multiple":
      return multi;
    case "range":
      return range;
    default:
      return void 0;
  }
}

// node_modules/react-day-picker/dist/esm/DayPicker.js
function DayPicker(props) {
  const { components, formatters: formatters2, labels, dateLib: dateLib2, locale, classNames } = (0, import_react32.useMemo)(() => {
    const locale2 = { ...enUS, ...props.locale };
    const dateLib3 = new DateLib({
      locale: locale2,
      weekStartsOn: props.broadcastCalendar ? 1 : props.weekStartsOn,
      firstWeekContainsDate: props.firstWeekContainsDate,
      useAdditionalWeekYearTokens: props.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: props.useAdditionalDayOfYearTokens,
      timeZone: props.timeZone,
      numerals: props.numerals
    }, props.dateLib);
    return {
      dateLib: dateLib3,
      components: getComponents(props.components),
      formatters: getFormatters(props.formatters),
      labels: { ...labels_exports, ...props.labels },
      locale: locale2,
      classNames: { ...getDefaultClassNames(), ...props.classNames }
    };
  }, [
    props.locale,
    props.broadcastCalendar,
    props.weekStartsOn,
    props.firstWeekContainsDate,
    props.useAdditionalWeekYearTokens,
    props.useAdditionalDayOfYearTokens,
    props.timeZone,
    props.numerals,
    props.dateLib,
    props.components,
    props.formatters,
    props.labels,
    props.classNames
  ]);
  const { captionLayout, mode, onDayBlur, onDayClick, onDayFocus, onDayKeyDown, onDayMouseEnter, onDayMouseLeave, onNextClick, onPrevClick, showWeekNumber, styles } = props;
  const { formatCaption: formatCaption2, formatDay: formatDay2, formatMonthDropdown: formatMonthDropdown2, formatWeekNumber: formatWeekNumber2, formatWeekNumberHeader: formatWeekNumberHeader2, formatWeekdayName: formatWeekdayName2, formatYearDropdown: formatYearDropdown2 } = formatters2;
  const calendar = useCalendar(props, dateLib2);
  const { days, months, navStart, navEnd, previousMonth, nextMonth, goToMonth } = calendar;
  const getModifiers = useGetModifiers(days, props, dateLib2);
  const { isSelected, select, selected: selectedValue } = useSelection(props, dateLib2) ?? {};
  const { blur, focused, isFocusTarget, moveFocus, setFocused } = useFocus(props, calendar, getModifiers, isSelected ?? (() => false), dateLib2);
  const { labelDayButton: labelDayButton2, labelGridcell: labelGridcell2, labelGrid: labelGrid2, labelMonthDropdown: labelMonthDropdown2, labelNav: labelNav2, labelWeekday: labelWeekday2, labelWeekNumber: labelWeekNumber2, labelWeekNumberHeader: labelWeekNumberHeader2, labelYearDropdown: labelYearDropdown2 } = labels;
  const weekdays = (0, import_react32.useMemo)(() => getWeekdays(dateLib2, props.ISOWeek), [dateLib2, props.ISOWeek]);
  const isInteractive = mode !== void 0 || onDayClick !== void 0;
  const handlePreviousClick = (0, import_react32.useCallback)(() => {
    if (!previousMonth)
      return;
    goToMonth(previousMonth);
    onPrevClick == null ? void 0 : onPrevClick(previousMonth);
  }, [previousMonth, goToMonth, onPrevClick]);
  const handleNextClick = (0, import_react32.useCallback)(() => {
    if (!nextMonth)
      return;
    goToMonth(nextMonth);
    onNextClick == null ? void 0 : onNextClick(nextMonth);
  }, [goToMonth, nextMonth, onNextClick]);
  const handleDayClick = (0, import_react32.useCallback)((day, m) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFocused(day);
    select == null ? void 0 : select(day.date, m, e);
    onDayClick == null ? void 0 : onDayClick(day.date, m, e);
  }, [select, onDayClick, setFocused]);
  const handleDayFocus = (0, import_react32.useCallback)((day, m) => (e) => {
    setFocused(day);
    onDayFocus == null ? void 0 : onDayFocus(day.date, m, e);
  }, [onDayFocus, setFocused]);
  const handleDayBlur = (0, import_react32.useCallback)((day, m) => (e) => {
    blur();
    onDayBlur == null ? void 0 : onDayBlur(day.date, m, e);
  }, [blur, onDayBlur]);
  const handleDayKeyDown = (0, import_react32.useCallback)((day, modifiers) => (e) => {
    const keyMap = {
      ArrowLeft: ["day", props.dir === "rtl" ? "after" : "before"],
      ArrowRight: ["day", props.dir === "rtl" ? "before" : "after"],
      ArrowDown: ["week", "after"],
      ArrowUp: ["week", "before"],
      PageUp: [e.shiftKey ? "year" : "month", "before"],
      PageDown: [e.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      const [moveBy, moveDir] = keyMap[e.key];
      moveFocus(moveBy, moveDir);
    }
    onDayKeyDown == null ? void 0 : onDayKeyDown(day.date, modifiers, e);
  }, [moveFocus, onDayKeyDown, props.dir]);
  const handleDayMouseEnter = (0, import_react32.useCallback)((day, modifiers) => (e) => {
    onDayMouseEnter == null ? void 0 : onDayMouseEnter(day.date, modifiers, e);
  }, [onDayMouseEnter]);
  const handleDayMouseLeave = (0, import_react32.useCallback)((day, modifiers) => (e) => {
    onDayMouseLeave == null ? void 0 : onDayMouseLeave(day.date, modifiers, e);
  }, [onDayMouseLeave]);
  const handleMonthChange = (0, import_react32.useCallback)((date) => (e) => {
    const selectedMonth = Number(e.target.value);
    const month = dateLib2.setMonth(dateLib2.startOfMonth(date), selectedMonth);
    goToMonth(month);
  }, [dateLib2, goToMonth]);
  const handleYearChange = (0, import_react32.useCallback)((date) => (e) => {
    const selectedYear = Number(e.target.value);
    const month = dateLib2.setYear(dateLib2.startOfMonth(date), selectedYear);
    goToMonth(month);
  }, [dateLib2, goToMonth]);
  const { className, style } = (0, import_react32.useMemo)(() => ({
    className: [classNames[UI.Root], props.className].filter(Boolean).join(" "),
    style: { ...styles == null ? void 0 : styles[UI.Root], ...props.style }
  }), [classNames, props.className, props.style, styles]);
  const dataAttributes = getDataAttributes(props);
  const rootElRef = (0, import_react32.useRef)(null);
  useAnimation(rootElRef, Boolean(props.animate), {
    classNames,
    months,
    focused,
    dateLib: dateLib2
  });
  const contextValue = {
    dayPickerProps: props,
    selected: selectedValue,
    select,
    isSelected,
    months,
    nextMonth,
    previousMonth,
    goToMonth,
    getModifiers,
    components,
    classNames,
    styles,
    labels,
    formatters: formatters2
  };
  return import_react32.default.createElement(
    dayPickerContext.Provider,
    { value: contextValue },
    import_react32.default.createElement(
      components.Root,
      { rootRef: props.animate ? rootElRef : void 0, className, style, dir: props.dir, id: props.id, lang: props.lang, nonce: props.nonce, title: props.title, role: props.role, "aria-label": props["aria-label"], ...dataAttributes },
      import_react32.default.createElement(
        components.Months,
        { className: classNames[UI.Months], style: styles == null ? void 0 : styles[UI.Months] },
        !props.hideNavigation && import_react32.default.createElement(components.Nav, { className: classNames[UI.Nav], style: styles == null ? void 0 : styles[UI.Nav], "aria-label": labelNav2(), onPreviousClick: handlePreviousClick, onNextClick: handleNextClick, previousMonth, nextMonth }),
        months.map((calendarMonth, displayIndex) => {
          const dropdownMonths = getMonthOptions(calendarMonth.date, navStart, navEnd, formatters2, dateLib2);
          const dropdownYears = getYearOptions(navStart, navEnd, formatters2, dateLib2);
          return import_react32.default.createElement(
            components.Month,
            { "data-animated-month": props.animate ? "true" : void 0, className: classNames[UI.Month], style: styles == null ? void 0 : styles[UI.Month], key: displayIndex, displayIndex, calendarMonth },
            import_react32.default.createElement(components.MonthCaption, { "data-animated-caption": props.animate ? "true" : void 0, className: classNames[UI.MonthCaption], style: styles == null ? void 0 : styles[UI.MonthCaption], calendarMonth, displayIndex }, (captionLayout == null ? void 0 : captionLayout.startsWith("dropdown")) ? import_react32.default.createElement(
              components.DropdownNav,
              { className: classNames[UI.Dropdowns], style: styles == null ? void 0 : styles[UI.Dropdowns] },
              captionLayout === "dropdown" || captionLayout === "dropdown-months" ? import_react32.default.createElement(components.MonthsDropdown, { className: classNames[UI.MonthsDropdown], "aria-label": labelMonthDropdown2(), classNames, components, disabled: Boolean(props.disableNavigation), onChange: handleMonthChange(calendarMonth.date), options: dropdownMonths, style: styles == null ? void 0 : styles[UI.Dropdown], value: dateLib2.getMonth(calendarMonth.date) }) : import_react32.default.createElement("span", { role: "status", "aria-live": "polite" }, formatMonthDropdown2(calendarMonth.date, dateLib2)),
              captionLayout === "dropdown" || captionLayout === "dropdown-years" ? import_react32.default.createElement(components.YearsDropdown, { className: classNames[UI.YearsDropdown], "aria-label": labelYearDropdown2(dateLib2.options), classNames, components, disabled: Boolean(props.disableNavigation), onChange: handleYearChange(calendarMonth.date), options: dropdownYears, style: styles == null ? void 0 : styles[UI.Dropdown], value: dateLib2.getYear(calendarMonth.date) }) : import_react32.default.createElement("span", { role: "status", "aria-live": "polite" }, formatYearDropdown2(calendarMonth.date, dateLib2))
            ) : import_react32.default.createElement(components.CaptionLabel, { className: classNames[UI.CaptionLabel], role: "status", "aria-live": "polite" }, formatCaption2(calendarMonth.date, dateLib2.options, dateLib2))),
            import_react32.default.createElement(
              components.MonthGrid,
              { role: "grid", "aria-multiselectable": mode === "multiple" || mode === "range", "aria-label": labelGrid2(calendarMonth.date, dateLib2.options, dateLib2) || void 0, className: classNames[UI.MonthGrid], style: styles == null ? void 0 : styles[UI.MonthGrid] },
              !props.hideWeekdays && import_react32.default.createElement(
                components.Weekdays,
                { "data-animated-weekdays": props.animate ? "true" : void 0, className: classNames[UI.Weekdays], style: styles == null ? void 0 : styles[UI.Weekdays] },
                showWeekNumber && import_react32.default.createElement(components.WeekNumberHeader, { "aria-label": labelWeekNumberHeader2(dateLib2.options), className: classNames[UI.WeekNumberHeader], style: styles == null ? void 0 : styles[UI.WeekNumberHeader], scope: "col" }, formatWeekNumberHeader2()),
                weekdays.map((weekday, i) => import_react32.default.createElement(components.Weekday, { "aria-label": labelWeekday2(weekday, dateLib2.options, dateLib2), className: classNames[UI.Weekday], key: i, style: styles == null ? void 0 : styles[UI.Weekday], scope: "col" }, formatWeekdayName2(weekday, dateLib2.options, dateLib2)))
              ),
              import_react32.default.createElement(components.Weeks, { "data-animated-weeks": props.animate ? "true" : void 0, className: classNames[UI.Weeks], style: styles == null ? void 0 : styles[UI.Weeks] }, calendarMonth.weeks.map((week2, weekIndex) => {
                return import_react32.default.createElement(
                  components.Week,
                  { className: classNames[UI.Week], key: week2.weekNumber, style: styles == null ? void 0 : styles[UI.Week], week: week2 },
                  showWeekNumber && import_react32.default.createElement(components.WeekNumber, { week: week2, style: styles == null ? void 0 : styles[UI.WeekNumber], "aria-label": labelWeekNumber2(week2.weekNumber, {
                    locale
                  }), className: classNames[UI.WeekNumber], scope: "row", role: "rowheader" }, formatWeekNumber2(week2.weekNumber)),
                  week2.days.map((day) => {
                    const { date } = day;
                    const modifiers = getModifiers(day);
                    modifiers[DayFlag.focused] = !modifiers.hidden && Boolean(focused == null ? void 0 : focused.isEqualTo(day));
                    modifiers[SelectionState.selected] = (isSelected == null ? void 0 : isSelected(date)) || modifiers.selected;
                    if (isDateRange(selectedValue)) {
                      const { from, to } = selectedValue;
                      modifiers[SelectionState.range_start] = Boolean(from && to && dateLib2.isSameDay(date, from));
                      modifiers[SelectionState.range_end] = Boolean(from && to && dateLib2.isSameDay(date, to));
                      modifiers[SelectionState.range_middle] = rangeIncludesDate(selectedValue, date, true, dateLib2);
                    }
                    const style2 = getStyleForModifiers(modifiers, styles, props.modifiersStyles);
                    const className2 = getClassNamesForModifiers(modifiers, classNames, props.modifiersClassNames);
                    const ariaLabel = !isInteractive && !modifiers.hidden ? labelGridcell2(date, modifiers, dateLib2.options, dateLib2) : void 0;
                    return import_react32.default.createElement(components.Day, { key: `${dateLib2.format(date, "yyyy-MM-dd")}_${dateLib2.format(day.displayMonth, "yyyy-MM")}`, day, modifiers, className: className2.join(" "), style: style2, role: "gridcell", "aria-selected": modifiers.selected || void 0, "aria-label": ariaLabel, "data-day": dateLib2.format(date, "yyyy-MM-dd"), "data-month": day.outside ? dateLib2.format(date, "yyyy-MM") : void 0, "data-selected": modifiers.selected || void 0, "data-disabled": modifiers.disabled || void 0, "data-hidden": modifiers.hidden || void 0, "data-outside": day.outside || void 0, "data-focused": modifiers.focused || void 0, "data-today": modifiers.today || void 0 }, !modifiers.hidden && isInteractive ? import_react32.default.createElement(components.DayButton, { className: classNames[UI.DayButton], style: styles == null ? void 0 : styles[UI.DayButton], type: "button", day, modifiers, disabled: modifiers.disabled || void 0, tabIndex: isFocusTarget(day) ? 0 : -1, "aria-label": labelDayButton2(date, modifiers, dateLib2.options, dateLib2), onClick: handleDayClick(day, modifiers), onBlur: handleDayBlur(day, modifiers), onFocus: handleDayFocus(day, modifiers), onKeyDown: handleDayKeyDown(day, modifiers), onMouseEnter: handleDayMouseEnter(day, modifiers), onMouseLeave: handleDayMouseLeave(day, modifiers) }, formatDay2(date, dateLib2.options, dateLib2)) : !modifiers.hidden && formatDay2(day.date, dateLib2.options, dateLib2));
                  })
                );
              }))
            )
          );
        })
      ),
      props.footer && import_react32.default.createElement(components.Footer, { className: classNames[UI.Footer], style: styles == null ? void 0 : styles[UI.Footer], role: "status", "aria-live": "polite" }, props.footer)
    )
  );
}

// node_modules/react-day-picker/dist/esm/types/deprecated.js
var Caption = MonthCaption;
var Row = Week;
var useNavigation = useDayPicker;
export {
  Animation,
  Button,
  CalendarDay,
  CalendarMonth,
  CalendarWeek,
  Caption,
  CaptionLabel,
  Chevron,
  DateLib,
  Day,
  DayButton,
  DayFlag,
  DayPicker,
  Dropdown,
  DropdownNav,
  Footer,
  Month,
  MonthCaption,
  MonthGrid,
  Months,
  MonthsDropdown,
  Nav,
  NextMonthButton,
  Option,
  PreviousMonthButton,
  Root,
  Row,
  Select,
  SelectionState,
  TZDate,
  UI,
  Week,
  WeekNumber,
  WeekNumberHeader,
  Weekday,
  Weekdays,
  Weeks,
  YearsDropdown,
  addToRange,
  dateLib,
  dateMatchModifiers,
  dayPickerContext,
  defaultDateLib,
  enUS as defaultLocale,
  formatCaption,
  formatDay,
  formatMonthCaption,
  formatMonthDropdown,
  formatWeekNumber,
  formatWeekNumberHeader,
  formatWeekdayName,
  formatYearCaption,
  formatYearDropdown,
  getDefaultClassNames,
  isDateAfterType,
  isDateBeforeType,
  isDateInRange,
  isDateInterval,
  isDateRange,
  isDatesArray,
  isDayOfWeekType,
  isMatch,
  labelCaption,
  labelDay,
  labelDayButton,
  labelGrid,
  labelGridcell,
  labelMonthDropdown,
  labelNav,
  labelNext,
  labelPrevious,
  labelWeekNumber,
  labelWeekNumberHeader,
  labelWeekday,
  labelYearDropdown,
  rangeContainsDayOfWeek,
  rangeContainsModifiers,
  rangeIncludesDate,
  rangeOverlaps,
  useDayPicker,
  useNavigation
};
//# sourceMappingURL=react-day-picker.js.map
