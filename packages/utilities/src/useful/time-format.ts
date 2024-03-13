import myDayJS from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from "dayjs/plugin/relativeTime";

/**
 * Extend dayjs with relativeTime plugin
 */
myDayJS.extend(relativeTime);

/**
 * Extend myDayJS with custom date parser
 */
myDayJS.extend(customParseFormat);

/**
 * Extend myDayJS with object support
 */
myDayJS.extend(objectSupport);

/**
 * Export dayjs
 */
export const dayjs = myDayJS;

/**
 * Type for time
 */
export type Time = myDayJS.ConfigType;

/**
 * TimeFormat
 *
 * Format time to various discord time format.
 */
export const TimeFormat = {
  /**
   * Get the formatted date according to the string of tokens passed in.
   *
   * To escape characters, wrap them in square brackets (e.g. [MM]).
   * ```
   * TimeFormat.format() // => current date in ISO8601, without fraction seconds e.g. '2020-04-02T08:02:17-05:00'
   * TimeFormat.format('2019-01-25', '[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') // 'YYYYescape 2019-01-25T00:00:00-02:00Z'
   * TimeFormat.format('2019-01-25', 'DD/MM/YYYY') // '25/01/2019'
   * ```
   * Docs: https://day.js.org/docs/en/display/format
   */
  Custom: (time: Time, template?: string | undefined): string =>
    dayjs(time).format(template),

  /**
   * 12 Hour Clock: November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: 28 November 2018 09:01
   */
  Default: (time: Time): string => `<t:${dayjs(time).unix()}>`,

  /**
   * 12 Hour Clock: November 28, 2018
   *
   * 24 Hour Clock: 28 November 2018
   */
  LongDate: (time: Time): string => `<t:${dayjs(time).unix()}:D>`,

  /**
   * 12 Hour Clock: Wednesday, November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: Wednesday, 28 November 2018 09:01
   */
  LongDateTime: (time: Time): string => `<t:${dayjs(time).unix()}:F>`,

  /**
   * 12 Hour Clock: 9:01:00 AM
   *
   * 24 Hour Clock: 09:01:00
   */
  LongTime: (time: Time): string => `<t:${dayjs(time, "").unix()}:T>`,

  /**
   * The Discord relative time updates every second.
   *
   * 12 Hour Clock: 3 years ago
   *
   * 24 Hour Clock: 3 years ago
   */
  RelativeTime: (time: Time): string => `<t:${dayjs(time).unix()}:R>`,

  /**
   * 12 Hour Clock: 11/28/2018
   *
   * 24 Hour Clock: 28/11/2018
   */
  ShortDate: (time: Time): string => `<t:${dayjs(time).unix()}:d>`,

  /**
   * 12 Hour Clock: November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: 28 November 2018 09:01
   */
  ShortDateTime: (time: Time): string => `<t:${dayjs(time).unix()}:f>`,

  /**
   * 12 Hour Clock: 9:01 AM
   *
   * 24 Hour Clock: 09:01
   */
  ShortTime: (time: Time): string => `<t:${dayjs(time).unix()}:t>`,

  /**
   * Unlike Discord relative time which updates every second, this remain static.
   *
   * 12 Hour Clock: 3 years ago
   *
   * 24 Hour Clock: 3 years ago
   */
  StaticRelativeTime: (
    time: Time,
    withoutSuffix?: boolean | undefined,
  ): string => dayjs(time).fromNow(withoutSuffix),
};
