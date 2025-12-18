(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /**
   * @module constants
   * @summary Useful constants
   * @description
   * Collection of useful date constants.
   *
   * The constants could be imported from `date-fns/constants`:
   *
   * ```ts
   * import { maxTime, minTime } from "./constants/date-fns/constants";
   *
   * function isAllowedTime(time) {
   *   return time <= maxTime && time >= minTime;
   * }
   * ```
   */

  /**
   * @constant
   * @name millisecondsInMinute
   * @summary Milliseconds in 1 minute
   */
  const millisecondsInMinute = 60000;

  /**
   * @constant
   * @name millisecondsInHour
   * @summary Milliseconds in 1 hour
   */
  const millisecondsInHour = 3600000;

  /**
   * @constant
   * @name minutesInYear
   * @summary Minutes in 1 year.
   */
  const minutesInYear = 525600;

  /**
   * @constant
   * @name minutesInMonth
   * @summary Minutes in 1 month.
   */
  const minutesInMonth = 43200;

  /**
   * @constant
   * @name minutesInDay
   * @summary Minutes in 1 day.
   */
  const minutesInDay = 1440;

  /**
   * @constant
   * @name constructFromSymbol
   * @summary Symbol enabling Date extensions to inherit properties from the reference date.
   *
   * The symbol is used to enable the `constructFrom` function to construct a date
   * using a reference date and a value. It allows to transfer extra properties
   * from the reference date to the new date. It's useful for extensions like
   * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
   * a constructor argument.
   */
  const constructFromSymbol = Symbol.for("constructDateFrom");

  /**
   * @name constructFrom
   * @category Generic Helpers
   * @summary Constructs a date using the reference date and the value
   *
   * @description
   * The function constructs a new date using the constructor from the reference
   * date and the given value. It helps to build generic functions that accept
   * date extensions.
   *
   * It defaults to `Date` if the passed reference date is a number or a string.
   *
   * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
   * enabling to transfer extra properties from the reference date to the new date.
   * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
   * that accept a time zone as a constructor argument.
   *
   * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
   *
   * @param date - The reference date to take constructor from
   * @param value - The value to create the date
   *
   * @returns Date initialized using the given date and value
   *
   * @example
   * import { constructFrom } from "./constructFrom/date-fns";
   *
   * // A function that clones a date preserving the original type
   * function cloneDate<DateType extends Date>(date: DateType): DateType {
   *   return constructFrom(
   *     date, // Use constructor from the given date
   *     date.getTime() // Use the date value to create a new date
   *   );
   * }
   */
  function constructFrom(date, value) {
    if (typeof date === "function") return date(value);

    if (date && typeof date === "object" && constructFromSymbol in date)
      return date[constructFromSymbol](value);

    if (date instanceof Date) return new date.constructor(value);

    return new Date(value);
  }

  /**
   * @name constructNow
   * @category Generic Helpers
   * @summary Constructs a new current date using the passed value constructor.
   * @pure false
   *
   * @description
   * The function constructs a new current date using the constructor from
   * the reference date. It helps to build generic functions that accept date
   * extensions and use the current date.
   *
   * It defaults to `Date` if the passed reference date is a number or a string.
   *
   * @param date - The reference date to take constructor from
   *
   * @returns Current date initialized using the given date constructor
   *
   * @example
   * import { constructNow, isSameDay } from 'date-fns'
   *
   * function isToday<DateType extends Date>(
   *   date: DateArg<DateType>,
   * ): boolean {
   *   // If we were to use `new Date()` directly, the function would  behave
   *   // differently in different timezones and return false for the same date.
   *   return isSameDay(date, constructNow(date));
   * }
   */
  function constructNow(date) {
    return constructFrom(date, Date.now());
  }

  const formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds",
    },

    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds",
    },

    halfAMinute: "half a minute",

    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes",
    },

    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes",
    },

    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours",
    },

    xHours: {
      one: "1 hour",
      other: "{{count}} hours",
    },

    xDays: {
      one: "1 day",
      other: "{{count}} days",
    },

    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks",
    },

    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks",
    },

    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months",
    },

    xMonths: {
      one: "1 month",
      other: "{{count}} months",
    },

    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years",
    },

    xYears: {
      one: "1 year",
      other: "{{count}} years",
    },

    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years",
    },

    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years",
    },
  };

  const formatDistance$1 = (token, count, options) => {
    let result;

    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace("{{count}}", count.toString());
    }

    if (options?.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }

    return result;
  };

  function buildFormatLongFn(args) {
    return (options = {}) => {
      // TODO: Remove String()
      const width = options.width ? String(options.width) : args.defaultWidth;
      const format = args.formats[width] || args.formats[args.defaultWidth];
      return format;
    };
  }

  const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy",
  };

  const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a",
  };

  const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}",
  };

  const formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full",
    }),

    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full",
    }),

    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full",
    }),
  };

  const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P",
  };

  const formatRelative = (token, _date, _baseDate, _options) =>
    formatRelativeLocale[token];

  /**
   * The localize function argument callback which allows to convert raw value to
   * the actual type.
   *
   * @param value - The value to convert
   *
   * @returns The converted value
   */

  /**
   * The map of localized values for each width.
   */

  /**
   * The index type of the locale unit value. It types conversion of units of
   * values that don't start at 0 (i.e. quarters).
   */

  /**
   * Converts the unit value to the tuple of values.
   */

  /**
   * The tuple of localized era values. The first element represents BC,
   * the second element represents AD.
   */

  /**
   * The tuple of localized quarter values. The first element represents Q1.
   */

  /**
   * The tuple of localized day values. The first element represents Sunday.
   */

  /**
   * The tuple of localized month values. The first element represents January.
   */

  function buildLocalizeFn(args) {
    return (value, options) => {
      const context = options?.context ? String(options.context) : "standalone";

      let valuesArray;
      if (context === "formatting" && args.formattingValues) {
        const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        const width = options?.width ? String(options.width) : defaultWidth;

        valuesArray =
          args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        const defaultWidth = args.defaultWidth;
        const width = options?.width ? String(options.width) : args.defaultWidth;

        valuesArray = args.values[width] || args.values[defaultWidth];
      }
      const index = args.argumentCallback ? args.argumentCallback(value) : value;

      // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
      return valuesArray[index];
    };
  }

  const eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"],
  };

  const quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
  };

  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  const monthValues = {
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
      "Dec",
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
      "December",
    ],
  };

  const dayValues = {
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
      "Saturday",
    ],
  };

  const dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
  };

  const formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
  };

  const ordinalNumber = (dirtyNumber, _options) => {
    const number = Number(dirtyNumber);

    // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`.
    //
    // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'.

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

  const localize = {
    ordinalNumber,

    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide",
    }),

    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: (quarter) => quarter - 1,
    }),

    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide",
    }),

    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide",
    }),

    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide",
    }),
  };

  function buildMatchFn(args) {
    return (string, options = {}) => {
      const width = options.width;

      const matchPattern =
        (width && args.matchPatterns[width]) ||
        args.matchPatterns[args.defaultMatchWidth];
      const matchResult = string.match(matchPattern);

      if (!matchResult) {
        return null;
      }
      const matchedString = matchResult[0];

      const parsePatterns =
        (width && args.parsePatterns[width]) ||
        args.parsePatterns[args.defaultParseWidth];

      const key = Array.isArray(parsePatterns)
        ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
        : // [TODO] -- I challenge you to fix the type
          findKey(parsePatterns, (pattern) => pattern.test(matchedString));

      let value;

      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback
        ? // [TODO] -- I challenge you to fix the type
          options.valueCallback(value)
        : value;

      const rest = string.slice(matchedString.length);

      return { value, rest };
    };
  }

  function findKey(object, predicate) {
    for (const key in object) {
      if (
        Object.prototype.hasOwnProperty.call(object, key) &&
        predicate(object[key])
      ) {
        return key;
      }
    }
    return undefined;
  }

  function findIndex(array, predicate) {
    for (let key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return undefined;
  }

  function buildMatchPatternFn(args) {
    return (string, options = {}) => {
      const matchResult = string.match(args.matchPattern);
      if (!matchResult) return null;
      const matchedString = matchResult[0];

      const parseResult = string.match(args.parsePattern);
      if (!parseResult) return null;
      let value = args.valueCallback
        ? args.valueCallback(parseResult[0])
        : parseResult[0];

      // [TODO] I challenge you to fix the type
      value = options.valueCallback ? options.valueCallback(value) : value;

      const rest = string.slice(matchedString.length);

      return { value, rest };
    };
  }

  const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  const parseOrdinalNumberPattern = /\d+/i;

  const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  };
  const parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i],
  };

  const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  };
  const parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i],
  };

  const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  };
  const parseMonthPatterns = {
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
      /^d/i,
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
      /^d/i,
    ],
  };

  const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  };
  const parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  };

  const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  };
  const parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  };

  const match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (value) => parseInt(value, 10),
    }),

    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any",
    }),

    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: (index) => index + 1,
    }),

    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any",
    }),

    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any",
    }),

    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any",
    }),
  };

  /**
   * @category Locales
   * @summary English locale (United States).
   * @language English
   * @iso-639-2 eng
   * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
   * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
   */
  const enUS = {
    code: "en-US",
    formatDistance: formatDistance$1,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
      weekStartsOn: 0 /* Sunday */,
      firstWeekContainsDate: 1,
    },
  };

  let defaultOptions = {};

  function getDefaultOptions() {
    return defaultOptions;
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
   * enabling to transfer extra properties from the reference date to the new date.
   * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
   * that accept a time zone as a constructor argument.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
   * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
   *
   * @param argument - The value to convert
   *
   * @returns The parsed date in the local time zone
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */
  function toDate(argument, context) {
    // [TODO] Get rid of `toDate` or `constructFrom`?
    return constructFrom(context || argument, argument);
  }

  /**
   * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
   * They usually appear for dates that denote time before the timezones were introduced
   * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
   * and GMT+01:00:00 after that date)
   *
   * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
   * which would lead to incorrect calculations.
   *
   * This function returns the timezone offset in milliseconds that takes seconds in account.
   */
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
        _date.getMilliseconds(),
      ),
    );
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
  }

  function normalizeDates(context, ...dates) {
    const normalize = constructFrom.bind(
      null,
      context || dates.find((date) => typeof date === "object"),
    );
    return dates.map(normalize);
  }

  /**
   * @name compareAsc
   * @category Common Helpers
   * @summary Compare the two dates and return -1, 0 or 1.
   *
   * @description
   * Compare the two dates and return 1 if the first date is after the second,
   * -1 if the first date is before the second or 0 if dates are equal.
   *
   * @param dateLeft - The first date to compare
   * @param dateRight - The second date to compare
   *
   * @returns The result of the comparison
   *
   * @example
   * // Compare 11 February 1987 and 10 July 1989:
   * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
   * //=> -1
   *
   * @example
   * // Sort the array of dates:
   * const result = [
   *   new Date(1995, 6, 2),
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * ].sort(compareAsc)
   * //=> [
   * //   Wed Feb 11 1987 00:00:00,
   * //   Mon Jul 10 1989 00:00:00,
   * //   Sun Jul 02 1995 00:00:00
   * // ]
   */
  function compareAsc(dateLeft, dateRight) {
    const diff = +toDate(dateLeft) - +toDate(dateRight);

    if (diff < 0) return -1;
    else if (diff > 0) return 1;

    // Return 0 if diff is 0; return NaN if diff is NaN
    return diff;
  }

  /**
   * The {@link differenceInCalendarMonths} function options.
   */

  /**
   * @name differenceInCalendarMonths
   * @category Month Helpers
   * @summary Get the number of calendar months between the given dates.
   *
   * @description
   * Get the number of calendar months between the given dates.
   *
   * @param laterDate - The later date
   * @param earlierDate - The earlier date
   * @param options - An object with options
   *
   * @returns The number of calendar months
   *
   * @example
   * // How many calendar months are between 31 January 2014 and 1 September 2014?
   * const result = differenceInCalendarMonths(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 0, 31)
   * )
   * //=> 8
   */
  function differenceInCalendarMonths(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      earlierDate,
    );

    const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
    const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();

    return yearsDiff * 12 + monthsDiff;
  }

  /**
   * The {@link endOfDay} function options.
   */

  /**
   * @name endOfDay
   * @category Day Helpers
   * @summary Return the end of a day for the given date.
   *
   * @description
   * Return the end of a day for the given date.
   * The result will be in the local timezone.
   *
   * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
   * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
   *
   * @param date - The original date
   * @param options - An object with options
   *
   * @returns The end of a day
   *
   * @example
   * // The end of a day for 2 September 2014 11:55:00:
   * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 23:59:59.999
   */
  function endOfDay(date, options) {
    const _date = toDate(date, options?.in);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }

  /**
   * The {@link endOfMonth} function options.
   */

  /**
   * @name endOfMonth
   * @category Month Helpers
   * @summary Return the end of a month for the given date.
   *
   * @description
   * Return the end of a month for the given date.
   * The result will be in the local timezone.
   *
   * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
   * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
   *
   * @param date - The original date
   * @param options - An object with options
   *
   * @returns The end of a month
   *
   * @example
   * // The end of a month for 2 September 2014 11:55:00:
   * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 23:59:59.999
   */
  function endOfMonth(date, options) {
    const _date = toDate(date, options?.in);
    const month = _date.getMonth();
    _date.setFullYear(_date.getFullYear(), month + 1, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }

  /**
   * @name isLastDayOfMonth
   * @category Month Helpers
   * @summary Is the given date the last day of a month?
   *
   * @description
   * Is the given date the last day of a month?
   *
   * @param date - The date to check
   * @param options - An object with options
   *
   * @returns The date is the last day of a month
   *
   * @example
   * // Is 28 February 2014 the last day of a month?
   * const result = isLastDayOfMonth(new Date(2014, 1, 28))
   * //=> true
   */
  function isLastDayOfMonth(date, options) {
    const _date = toDate(date, options?.in);
    return +endOfDay(_date, options) === +endOfMonth(_date, options);
  }

  /**
   * The {@link differenceInMonths} function options.
   */

  /**
   * @name differenceInMonths
   * @category Month Helpers
   * @summary Get the number of full months between the given dates.
   *
   * @param laterDate - The later date
   * @param earlierDate - The earlier date
   * @param options - An object with options
   *
   * @returns The number of full months
   *
   * @example
   * // How many full months are between 31 January 2014 and 1 September 2014?
   * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
   * //=> 7
   */
  function differenceInMonths(laterDate, earlierDate, options) {
    const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(
      options?.in,
      laterDate,
      laterDate,
      earlierDate,
    );

    const sign = compareAsc(workingLaterDate, earlierDate_);
    const difference = Math.abs(
      differenceInCalendarMonths(workingLaterDate, earlierDate_),
    );

    if (difference < 1) return 0;

    if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27)
      workingLaterDate.setDate(30);

    workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);

    let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;

    if (
      isLastDayOfMonth(laterDate_) &&
      difference === 1 &&
      compareAsc(laterDate_, earlierDate_) === 1
    ) {
      isLastMonthNotFull = false;
    }

    const result = sign * (difference - +isLastMonthNotFull);
    return result === 0 ? 0 : result;
  }

  function getRoundingMethod(method) {
    return (number) => {
      const round = method ? Math[method] : Math.trunc;
      const result = round(number);
      // Prevent negative zero
      return result === 0 ? 0 : result;
    };
  }

  /**
   * @name differenceInMilliseconds
   * @category Millisecond Helpers
   * @summary Get the number of milliseconds between the given dates.
   *
   * @description
   * Get the number of milliseconds between the given dates.
   *
   * @param laterDate - The later date
   * @param earlierDate - The earlier date
   *
   * @returns The number of milliseconds
   *
   * @example
   * // How many milliseconds are between
   * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
   * const result = differenceInMilliseconds(
   *   new Date(2014, 6, 2, 12, 30, 21, 700),
   *   new Date(2014, 6, 2, 12, 30, 20, 600)
   * )
   * //=> 1100
   */
  function differenceInMilliseconds(laterDate, earlierDate) {
    return +toDate(laterDate) - +toDate(earlierDate);
  }

  /**
   * The {@link differenceInSeconds} function options.
   */

  /**
   * @name differenceInSeconds
   * @category Second Helpers
   * @summary Get the number of seconds between the given dates.
   *
   * @description
   * Get the number of seconds between the given dates.
   *
   * @param laterDate - The later date
   * @param earlierDate - The earlier date
   * @param options - An object with options.
   *
   * @returns The number of seconds
   *
   * @example
   * // How many seconds are between
   * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
   * const result = differenceInSeconds(
   *   new Date(2014, 6, 2, 12, 30, 20, 0),
   *   new Date(2014, 6, 2, 12, 30, 7, 999)
   * )
   * //=> 12
   */
  function differenceInSeconds(laterDate, earlierDate, options) {
    const diff = differenceInMilliseconds(laterDate, earlierDate) / 1000;
    return getRoundingMethod(options?.roundingMethod)(diff);
  }

  /**
   * The {@link formatDistance} function options.
   */

  /**
   * @name formatDistance
   * @category Common Helpers
   * @summary Return the distance between the given dates in words.
   *
   * @description
   * Return the distance between the given dates in words.
   *
   * | Distance between dates                                            | Result              |
   * |-------------------------------------------------------------------|---------------------|
   * | 0 ... 30 secs                                                     | less than a minute  |
   * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
   * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
   * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
   * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
   * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
   * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
   * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
   * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
   * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
   * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
   * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
   * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
   * | N yrs ... N yrs 3 months                                          | about N years       |
   * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
   * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
   *
   * With `options.includeSeconds == true`:
   * | Distance between dates | Result               |
   * |------------------------|----------------------|
   * | 0 secs ... 5 secs      | less than 5 seconds  |
   * | 5 secs ... 10 secs     | less than 10 seconds |
   * | 10 secs ... 20 secs    | less than 20 seconds |
   * | 20 secs ... 40 secs    | half a minute        |
   * | 40 secs ... 60 secs    | less than a minute   |
   * | 60 secs ... 90 secs    | 1 minute             |
   *
   * @param laterDate - The date
   * @param earlierDate - The date to compare with
   * @param options - An object with options
   *
   * @returns The distance in words
   *
   * @throws `date` must not be Invalid Date
   * @throws `baseDate` must not be Invalid Date
   * @throws `options.locale` must contain `formatDistance` property
   *
   * @example
   * // What is the distance between 2 July 2014 and 1 January 2015?
   * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
   * //=> '6 months'
   *
   * @example
   * // What is the distance between 1 January 2015 00:00:15
   * // and 1 January 2015 00:00:00, including seconds?
   * const result = formatDistance(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   new Date(2015, 0, 1, 0, 0, 0),
   *   { includeSeconds: true }
   * )
   * //=> 'less than 20 seconds'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, with a suffix?
   * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
   *   addSuffix: true
   * })
   * //=> 'about 1 year ago'
   *
   * @example
   * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
   * import { eoLocale } from 'date-fns/locale/eo'
   * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
   *   locale: eoLocale
   * })
   * //=> 'pli ol 1 jaro'
   */
  function formatDistance(laterDate, earlierDate, options) {
    const defaultOptions = getDefaultOptions();
    const locale = options?.locale ?? defaultOptions.locale ?? enUS;
    const minutesInAlmostTwoDays = 2520;

    const comparison = compareAsc(laterDate, earlierDate);

    if (isNaN(comparison)) throw new RangeError("Invalid time value");

    const localizeOptions = Object.assign({}, options, {
      addSuffix: options?.addSuffix,
      comparison: comparison,
    });

    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      ...(comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]),
    );

    const seconds = differenceInSeconds(earlierDate_, laterDate_);
    const offsetInSeconds =
      (getTimezoneOffsetInMilliseconds(earlierDate_) -
        getTimezoneOffsetInMilliseconds(laterDate_)) /
      1000;
    const minutes = Math.round((seconds - offsetInSeconds) / 60);
    let months;

    // 0 up to 2 mins
    if (minutes < 2) {
      if (options?.includeSeconds) {
        if (seconds < 5) {
          return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
        } else if (seconds < 10) {
          return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
        } else if (seconds < 20) {
          return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
        } else if (seconds < 40) {
          return locale.formatDistance("halfAMinute", 0, localizeOptions);
        } else if (seconds < 60) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", 1, localizeOptions);
        }
      } else {
        if (minutes === 0) {
          return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
        } else {
          return locale.formatDistance("xMinutes", minutes, localizeOptions);
        }
      }

      // 2 mins up to 0.75 hrs
    } else if (minutes < 45) {
      return locale.formatDistance("xMinutes", minutes, localizeOptions);

      // 0.75 hrs up to 1.5 hrs
    } else if (minutes < 90) {
      return locale.formatDistance("aboutXHours", 1, localizeOptions);

      // 1.5 hrs up to 24 hrs
    } else if (minutes < minutesInDay) {
      const hours = Math.round(minutes / 60);
      return locale.formatDistance("aboutXHours", hours, localizeOptions);

      // 1 day up to 1.75 days
    } else if (minutes < minutesInAlmostTwoDays) {
      return locale.formatDistance("xDays", 1, localizeOptions);

      // 1.75 days up to 30 days
    } else if (minutes < minutesInMonth) {
      const days = Math.round(minutes / minutesInDay);
      return locale.formatDistance("xDays", days, localizeOptions);

      // 1 month up to 2 months
    } else if (minutes < minutesInMonth * 2) {
      months = Math.round(minutes / minutesInMonth);
      return locale.formatDistance("aboutXMonths", months, localizeOptions);
    }

    months = differenceInMonths(earlierDate_, laterDate_);

    // 2 months up to 12 months
    if (months < 12) {
      const nearestMonth = Math.round(minutes / minutesInMonth);
      return locale.formatDistance("xMonths", nearestMonth, localizeOptions);

      // 1 year up to max Date
    } else {
      const monthsSinceStartOfYear = months % 12;
      const years = Math.trunc(months / 12);

      // N years up to 1 years 3 months
      if (monthsSinceStartOfYear < 3) {
        return locale.formatDistance("aboutXYears", years, localizeOptions);

        // N years 3 months up to N years 9 months
      } else if (monthsSinceStartOfYear < 9) {
        return locale.formatDistance("overXYears", years, localizeOptions);

        // N years 9 months up to N year 12 months
      } else {
        return locale.formatDistance("almostXYears", years + 1, localizeOptions);
      }
    }
  }

  /**
   * The {@link formatDistanceToNow} function options.
   */

  /**
   * @name formatDistanceToNow
   * @category Common Helpers
   * @summary Return the distance between the given date and now in words.
   * @pure false
   *
   * @description
   * Return the distance between the given date and now in words.
   *
   * | Distance to now                                                   | Result              |
   * |-------------------------------------------------------------------|---------------------|
   * | 0 ... 30 secs                                                     | less than a minute  |
   * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
   * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
   * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
   * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
   * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
   * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
   * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
   * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
   * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
   * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
   * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
   * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
   * | N yrs ... N yrs 3 months                                          | about N years       |
   * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
   * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
   *
   * With `options.includeSeconds == true`:
   * | Distance to now     | Result               |
   * |---------------------|----------------------|
   * | 0 secs ... 5 secs   | less than 5 seconds  |
   * | 5 secs ... 10 secs  | less than 10 seconds |
   * | 10 secs ... 20 secs | less than 20 seconds |
   * | 20 secs ... 40 secs | half a minute        |
   * | 40 secs ... 60 secs | less than a minute   |
   * | 60 secs ... 90 secs | 1 minute             |
   *
   * @param date - The given date
   * @param options - The object with options
   *
   * @returns The distance in words
   *
   * @throws `date` must not be Invalid Date
   * @throws `options.locale` must contain `formatDistance` property
   *
   * @example
   * // If today is 1 January 2015, what is the distance to 2 July 2014?
   * const result = formatDistanceToNow(
   *   new Date(2014, 6, 2)
   * )
   * //=> '6 months'
   *
   * @example
   * // If now is 1 January 2015 00:00:00,
   * // what is the distance to 1 January 2015 00:00:15, including seconds?
   * const result = formatDistanceToNow(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   {includeSeconds: true}
   * )
   * //=> 'less than 20 seconds'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 January 2016, with a suffix?
   * const result = formatDistanceToNow(
   *   new Date(2016, 0, 1),
   *   {addSuffix: true}
   * )
   * //=> 'in about 1 year'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 August 2016 in Esperanto?
   * const eoLocale = require('date-fns/locale/eo')
   * const result = formatDistanceToNow(
   *   new Date(2016, 7, 1),
   *   {locale: eoLocale}
   * )
   * //=> 'pli ol 1 jaro'
   */
  function formatDistanceToNow(date, options) {
    return formatDistance(date, constructNow(date), options);
  }

  /**
   * The {@link formatDistanceStrict} function options.
   */

  /**
   * The unit used to format the distance in {@link formatDistanceStrict}.
   */

  /**
   * @name formatDistanceStrict
   * @category Common Helpers
   * @summary Return the distance between the given dates in words.
   *
   * @description
   * Return the distance between the given dates in words, using strict units.
   * This is like `formatDistance`, but does not use helpers like 'almost', 'over',
   * 'less than' and the like.
   *
   * | Distance between dates | Result              |
   * |------------------------|---------------------|
   * | 0 ... 59 secs          | [0..59] seconds     |
   * | 1 ... 59 mins          | [1..59] minutes     |
   * | 1 ... 23 hrs           | [1..23] hours       |
   * | 1 ... 29 days          | [1..29] days        |
   * | 1 ... 11 months        | [1..11] months      |
   * | 1 ... N years          | [1..N]  years       |
   *
   * @param laterDate - The date
   * @param earlierDate - The date to compare with
   * @param options - An object with options
   *
   * @returns The distance in words
   *
   * @throws `date` must not be Invalid Date
   * @throws `baseDate` must not be Invalid Date
   * @throws `options.unit` must be 'second', 'minute', 'hour', 'day', 'month' or 'year'
   * @throws `options.locale` must contain `formatDistance` property
   *
   * @example
   * // What is the distance between 2 July 2014 and 1 January 2015?
   * const result = formatDistanceStrict(new Date(2014, 6, 2), new Date(2015, 0, 2))
   * //=> '6 months'
   *
   * @example
   * // What is the distance between 1 January 2015 00:00:15
   * // and 1 January 2015 00:00:00?
   * const result = formatDistanceStrict(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   new Date(2015, 0, 1, 0, 0, 0)
   * )
   * //=> '15 seconds'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, with a suffix?
   * const result = formatDistanceStrict(new Date(2015, 0, 1), new Date(2016, 0, 1), {
   *   addSuffix: true
   * })
   * //=> '1 year ago'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, in minutes?
   * const result = formatDistanceStrict(new Date(2016, 0, 1), new Date(2015, 0, 1), {
   *   unit: 'minute'
   * })
   * //=> '525600 minutes'
   *
   * @example
   * // What is the distance from 1 January 2015
   * // to 28 January 2015, in months, rounded up?
   * const result = formatDistanceStrict(new Date(2015, 0, 28), new Date(2015, 0, 1), {
   *   unit: 'month',
   *   roundingMethod: 'ceil'
   * })
   * //=> '1 month'
   *
   * @example
   * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
   * import { eoLocale } from 'date-fns/locale/eo'
   * const result = formatDistanceStrict(new Date(2016, 7, 1), new Date(2015, 0, 1), {
   *   locale: eoLocale
   * })
   * //=> '1 jaro'
   */

  function formatDistanceStrict(laterDate, earlierDate, options) {
    const defaultOptions = getDefaultOptions();
    const locale = options?.locale ?? defaultOptions.locale ?? enUS;

    const comparison = compareAsc(laterDate, earlierDate);

    if (isNaN(comparison)) {
      throw new RangeError("Invalid time value");
    }

    const localizeOptions = Object.assign({}, options, {
      addSuffix: options?.addSuffix,
      comparison: comparison,
    });

    const [laterDate_, earlierDate_] = normalizeDates(
      options?.in,
      ...(comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]),
    );

    const roundingMethod = getRoundingMethod(options?.roundingMethod ?? "round");

    const milliseconds = earlierDate_.getTime() - laterDate_.getTime();
    const minutes = milliseconds / millisecondsInMinute;

    const timezoneOffset =
      getTimezoneOffsetInMilliseconds(earlierDate_) -
      getTimezoneOffsetInMilliseconds(laterDate_);

    // Use DST-normalized difference in minutes for years, months and days;
    // use regular difference in minutes for hours, minutes and seconds.
    const dstNormalizedMinutes =
      (milliseconds - timezoneOffset) / millisecondsInMinute;

    const defaultUnit = options?.unit;
    let unit;
    if (!defaultUnit) {
      if (minutes < 1) {
        unit = "second";
      } else if (minutes < 60) {
        unit = "minute";
      } else if (minutes < minutesInDay) {
        unit = "hour";
      } else if (dstNormalizedMinutes < minutesInMonth) {
        unit = "day";
      } else if (dstNormalizedMinutes < minutesInYear) {
        unit = "month";
      } else {
        unit = "year";
      }
    } else {
      unit = defaultUnit;
    }

    // 0 up to 60 seconds
    if (unit === "second") {
      const seconds = roundingMethod(milliseconds / 1000);
      return locale.formatDistance("xSeconds", seconds, localizeOptions);

      // 1 up to 60 mins
    } else if (unit === "minute") {
      const roundedMinutes = roundingMethod(minutes);
      return locale.formatDistance("xMinutes", roundedMinutes, localizeOptions);

      // 1 up to 24 hours
    } else if (unit === "hour") {
      const hours = roundingMethod(minutes / 60);
      return locale.formatDistance("xHours", hours, localizeOptions);

      // 1 up to 30 days
    } else if (unit === "day") {
      const days = roundingMethod(dstNormalizedMinutes / minutesInDay);
      return locale.formatDistance("xDays", days, localizeOptions);

      // 1 up to 12 months
    } else if (unit === "month") {
      const months = roundingMethod(dstNormalizedMinutes / minutesInMonth);
      return months === 12 && defaultUnit !== "month"
        ? locale.formatDistance("xYears", 1, localizeOptions)
        : locale.formatDistance("xMonths", months, localizeOptions);

      // 1 year up to max Date
    } else {
      const years = roundingMethod(dstNormalizedMinutes / minutesInYear);
      return locale.formatDistance("xYears", years, localizeOptions);
    }
  }

  /**
   * The {@link formatDistanceToNowStrict} function options.
   */

  /**
   * @name formatDistanceToNowStrict
   * @category Common Helpers
   * @summary Return the distance between the given date and now in words.
   * @pure false
   *
   * @description
   * Return the distance between the given dates in words, using strict units.
   * This is like `formatDistance`, but does not use helpers like 'almost', 'over',
   * 'less than' and the like.
   *
   * | Distance between dates | Result              |
   * |------------------------|---------------------|
   * | 0 ... 59 secs          | [0..59] seconds     |
   * | 1 ... 59 mins          | [1..59] minutes     |
   * | 1 ... 23 hrs           | [1..23] hours       |
   * | 1 ... 29 days          | [1..29] days        |
   * | 1 ... 11 months        | [1..11] months      |
   * | 1 ... N years          | [1..N]  years       |
   *
   * @param date - The given date
   * @param options - An object with options.
   *
   * @returns The distance in words
   *
   * @throws `date` must not be Invalid Date
   * @throws `options.locale` must contain `formatDistance` property
   *
   * @example
   * // If today is 1 January 2015, what is the distance to 2 July 2014?
   * const result = formatDistanceToNowStrict(
   *   new Date(2014, 6, 2)
   * )
   * //=> '6 months'
   *
   * @example
   * // If now is 1 January 2015 00:00:00,
   * // what is the distance to 1 January 2015 00:00:15, including seconds?
   * const result = formatDistanceToNowStrict(
   *   new Date(2015, 0, 1, 0, 0, 15)
   * )
   * //=> '15 seconds'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 January 2016, with a suffix?
   * const result = formatDistanceToNowStrict(
   *   new Date(2016, 0, 1),
   *   {addSuffix: true}
   * )
   * //=> 'in 1 year'
   *
   * @example
   * // If today is 28 January 2015,
   * // what is the distance to 1 January 2015, in months, rounded up??
   * const result = formatDistanceToNowStrict(new Date(2015, 0, 1), {
   *   unit: 'month',
   *   roundingMethod: 'ceil'
   * })
   * //=> '1 month'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 January 2016 in Esperanto?
   * const eoLocale = require('date-fns/locale/eo')
   * const result = formatDistanceToNowStrict(
   *   new Date(2016, 0, 1),
   *   {locale: eoLocale}
   * )
   * //=> '1 jaro'
   */
  function formatDistanceToNowStrict(date, options) {
    return formatDistanceStrict(date, constructNow(date), options);
  }

  /**
   * The {@link parseISO} function options.
   */

  /**
   * @name parseISO
   * @category Common Helpers
   * @summary Parse ISO string
   *
   * @description
   * Parse the given string in ISO 8601 format and return an instance of Date.
   *
   * Function accepts complete ISO 8601 formats as well as partial implementations.
   * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
   *
   * If the argument isn't a string, the function cannot parse the string or
   * the values are invalid, it returns Invalid Date.
   *
   * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
   * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
   *
   * @param argument - The value to convert
   * @param options - An object with options
   *
   * @returns The parsed date in the local time zone
   *
   * @example
   * // Convert string '2014-02-11T11:30:30' to date:
   * const result = parseISO('2014-02-11T11:30:30')
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert string '+02014101' to date,
   * // if the additional number of digits in the extended year format is 1:
   * const result = parseISO('+02014101', { additionalDigits: 1 })
   * //=> Fri Apr 11 2014 00:00:00
   */
  function parseISO(argument, options) {
    const invalidDate = () => constructFrom(options?.in, NaN);

    const additionalDigits = options?.additionalDigits ?? 2;
    const dateStrings = splitDateString(argument);

    let date;
    if (dateStrings.date) {
      const parseYearResult = parseYear(dateStrings.date, additionalDigits);
      date = parseDate(parseYearResult.restDateString, parseYearResult.year);
    }

    if (!date || isNaN(+date)) return invalidDate();

    const timestamp = +date;
    let time = 0;
    let offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
      if (isNaN(time)) return invalidDate();
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
      if (isNaN(offset)) return invalidDate();
    } else {
      const tmpDate = new Date(timestamp + time);
      const result = toDate(0, options?.in);
      result.setFullYear(
        tmpDate.getUTCFullYear(),
        tmpDate.getUTCMonth(),
        tmpDate.getUTCDate(),
      );
      result.setHours(
        tmpDate.getUTCHours(),
        tmpDate.getUTCMinutes(),
        tmpDate.getUTCSeconds(),
        tmpDate.getUTCMilliseconds(),
      );
      return result;
    }

    return toDate(timestamp + time + offset, options?.in);
  }

  const patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/,
  };

  const dateRegex =
    /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
  const timeRegex =
    /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
  const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;

  function splitDateString(dateString) {
    const dateStrings = {};
    const array = dateString.split(patterns.dateTimeDelimiter);
    let timeString;

    // The regex match should only return at maximum two array elements.
    // [date], [time], or [date, time].
    if (array.length > 2) {
      return dateStrings;
    }

    if (/:/.test(array[0])) {
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
      if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
        dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
        timeString = dateString.substr(
          dateStrings.date.length,
          dateString.length,
        );
      }
    }

    if (timeString) {
      const token = patterns.timezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], "");
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }

    return dateStrings;
  }

  function parseYear(dateString, additionalDigits) {
    const regex = new RegExp(
      "^(?:(\\d{4}|[+-]\\d{" +
        (4 + additionalDigits) +
        "})|(\\d{2}|[+-]\\d{" +
        (2 + additionalDigits) +
        "})$)",
    );

    const captures = dateString.match(regex);
    // Invalid ISO-formatted year
    if (!captures) return { year: NaN, restDateString: "" };

    const year = captures[1] ? parseInt(captures[1]) : null;
    const century = captures[2] ? parseInt(captures[2]) : null;

    // either year or century is null, not both
    return {
      year: century === null ? year : century * 100,
      restDateString: dateString.slice((captures[1] || captures[2]).length),
    };
  }

  function parseDate(dateString, year) {
    // Invalid ISO-formatted year
    if (year === null) return new Date(NaN);

    const captures = dateString.match(dateRegex);
    // Invalid ISO-formatted string
    if (!captures) return new Date(NaN);

    const isWeekDate = !!captures[4];
    const dayOfYear = parseDateUnit(captures[1]);
    const month = parseDateUnit(captures[2]) - 1;
    const day = parseDateUnit(captures[3]);
    const week = parseDateUnit(captures[4]);
    const dayOfWeek = parseDateUnit(captures[5]) - 1;

    if (isWeekDate) {
      if (!validateWeekDate(year, week, dayOfWeek)) {
        return new Date(NaN);
      }
      return dayOfISOWeekYear(year, week, dayOfWeek);
    } else {
      const date = new Date(0);
      if (
        !validateDate(year, month, day) ||
        !validateDayOfYearDate(year, dayOfYear)
      ) {
        return new Date(NaN);
      }
      date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
      return date;
    }
  }

  function parseDateUnit(value) {
    return value ? parseInt(value) : 1;
  }

  function parseTime(timeString) {
    const captures = timeString.match(timeRegex);
    if (!captures) return NaN; // Invalid ISO-formatted time

    const hours = parseTimeUnit(captures[1]);
    const minutes = parseTimeUnit(captures[2]);
    const seconds = parseTimeUnit(captures[3]);

    if (!validateTime(hours, minutes, seconds)) {
      return NaN;
    }

    return (
      hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1000
    );
  }

  function parseTimeUnit(value) {
    return (value && parseFloat(value.replace(",", "."))) || 0;
  }

  function parseTimezone(timezoneString) {
    if (timezoneString === "Z") return 0;

    const captures = timezoneString.match(timezoneRegex);
    if (!captures) return 0;

    const sign = captures[1] === "+" ? -1 : 1;
    const hours = parseInt(captures[2]);
    const minutes = (captures[3] && parseInt(captures[3])) || 0;

    if (!validateTimezone(hours, minutes)) {
      return NaN;
    }

    return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
  }

  function dayOfISOWeekYear(isoWeekYear, week, day) {
    const date = new Date(0);
    date.setUTCFullYear(isoWeekYear, 0, 4);
    const fourthOfJanuaryDay = date.getUTCDay() || 7;
    const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }

  // Validation functions

  // February is null to handle the leap year (using ||)
  const daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function isLeapYearIndex(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
  }

  function validateDate(year, month, date) {
    return (
      month >= 0 &&
      month <= 11 &&
      date >= 1 &&
      date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28))
    );
  }

  function validateDayOfYearDate(year, dayOfYear) {
    return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
  }

  function validateWeekDate(_year, week, day) {
    return week >= 1 && week <= 53 && day >= 0 && day <= 6;
  }

  function validateTime(hours, minutes, seconds) {
    if (hours === 24) {
      return minutes === 0 && seconds === 0;
    }

    return (
      seconds >= 0 &&
      seconds < 60 &&
      minutes >= 0 &&
      minutes < 60 &&
      hours >= 0 &&
      hours < 25
    );
  }

  function validateTimezone(_hours, minutes) {
    return minutes >= 0 && minutes <= 59;
  }

  /**
   * @name isPast
   * @category Common Helpers
   * @summary Is the given date in the past?
   * @pure false
   *
   * @description
   * Is the given date in the past?
   *
   * @param date - The date to check
   *
   * @returns The date is in the past
   *
   * @example
   * // If today is 6 October 2014, is 2 July 2014 in the past?
   * const result = isPast(new Date(2014, 6, 2))
   * //=> true
   */
  function isPast(date) {
    return +toDate(date) < Date.now();
  }

  let locale = null;
  function TimeAgo(Alpine) {
    Alpine.directive("timeago", (el, {
      expression,
      modifiers
    }, {
      evaluateLater,
      effect,
      cleanup
    }) => {
      let evaluateDate = evaluateLater(expression);
      const render = date => {
        if (typeof date === "string") {
          date = parseISO(date);
        }
        try {
          if (modifiers.includes("strict")) {
            let unit = modifiers.includes("unit") ? modifiers[modifiers.findIndex(modifier => modifier === "unit") + 1] || undefined : undefined;
            if (!["second", "minute", "hour", "day", "month", "year"].includes(unit)) {
              unit = undefined;
            }
            let roundingMethod = modifiers.includes("rounding") ? modifiers[modifiers.findIndex(modifier => modifier === "rounding") + 1] || undefined : undefined;
            if (!["floor", "ceil", "round"].includes(roundingMethod)) {
              roundingMethod = undefined;
            }
            el.textContent = formatDistanceToNowStrict(date, {
              addSuffix: !modifiers.includes("pure"),
              unit,
              roundingMethod,
              locale
            });
          } else {
            el.textContent = formatDistanceToNow(date, {
              addSuffix: !modifiers.includes("pure"),
              includeSeconds: modifiers.includes("seconds"),
              locale
            });
          }
          dispatch(date);
        } catch (e) {
          console.error(e);
        }
      };
      let interval;
      const dispatch = date => {
        el.dispatchEvent(new CustomEvent("timeago:render", {
          detail: {
            isPast: isPast(date)
          },
          bubbles: false
        }));
      };
      const setupInterval = date => {
        let intervalDuration = 30000;
        if (modifiers.includes("seconds")) {
          intervalDuration = 5000;
        }
        interval = setInterval(() => {
          render(date);
        }, intervalDuration);
      };
      const intersectionObserver = new IntersectionObserver(entries => {
        const [entry] = entries;
        const {
          isIntersecting
        } = entry;
        if (isIntersecting) {
          evaluateDate(date => {
            if (!interval) {
              setupInterval(date);
              render(date);
            }
          });
        } else {
          if (interval) {
            clearInterval(interval);
            interval = undefined;
          }
        }
      });
      intersectionObserver.observe(el);
      effect(() => {
        evaluateDate(date => {
          if (interval) {
            clearInterval(interval);
          }
          render(date);
          setupInterval(date);
        });
      });
      cleanup(() => clearInterval(interval));
    });
    Alpine.magic("timeago", () => (expression, pure, seconds, strictOptions) => {
      if (pure == null) {
        pure = false;
      }
      if (seconds == null) {
        seconds = false;
      }
      if (strictOptions != null && (strictOptions["strict"] || undefined)) {
        return formatDistanceToNowStrict(expression, {
          addSuffix: !pure,
          unit: strictOptions["unit"] || undefined,
          roundingMethod: strictOptions["roundingMethod"] || undefined,
          locale
        });
      }
      return formatDistanceToNow(expression, {
        addSuffix: !pure,
        includeSeconds: seconds,
        locale
      });
    });
  }
  TimeAgo.configure = config => {
    if (config.hasOwnProperty("locale") && typeof config.locale === "object") {
      if (config.locale.hasOwnProperty("formatDistance")) {
        locale = config.locale;
      }
    }
    return TimeAgo;
  };

  document.addEventListener('alpine:init', () => {
    TimeAgo(window.Alpine);
  });

}));
//# sourceMappingURL=alpine-timeago.js.map
