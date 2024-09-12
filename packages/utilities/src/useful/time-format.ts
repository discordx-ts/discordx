/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import myDayJS from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import objectSupport from "dayjs/plugin/objectSupport.js";
import relativeTime from "dayjs/plugin/relativeTime.js";

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
   * 12 Hour Clock: November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: 28 November 2018 09:01
   */
  Default: (time: Time): string => `<t:${String(dayjs(time).unix())}>`,

  /**
   * 12 Hour Clock: November 28, 2018
   *
   * 24 Hour Clock: 28 November 2018
   */
  LongDate: (time: Time): string => `<t:${String(dayjs(time).unix())}:D>`,

  /**
   * 12 Hour Clock: Wednesday, November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: Wednesday, 28 November 2018 09:01
   */
  LongDateTime: (time: Time): string => `<t:${String(dayjs(time).unix())}:F>`,

  /**
   * 12 Hour Clock: 9:01:00 AM
   *
   * 24 Hour Clock: 09:01:00
   */
  LongTime: (time: Time): string => `<t:${String(dayjs(time, "").unix())}:T>`,

  /**
   * The Discord relative time updates every second.
   *
   * 12 Hour Clock: 3 years ago
   *
   * 24 Hour Clock: 3 years ago
   */
  RelativeTime: (time: Time): string => `<t:${String(dayjs(time).unix())}:R>`,

  /**
   * 12 Hour Clock: 11/28/2018
   *
   * 24 Hour Clock: 28/11/2018
   */
  ShortDate: (time: Time): string => `<t:${String(dayjs(time).unix())}:d>`,

  /**
   * 12 Hour Clock: November 28, 2018 9:01 AM
   *
   * 24 Hour Clock: 28 November 2018 09:01
   */
  ShortDateTime: (time: Time): string => `<t:${String(dayjs(time).unix())}:f>`,

  /**
   * 12 Hour Clock: 9:01 AM
   *
   * 24 Hour Clock: 09:01
   */
  ShortTime: (time: Time): string => `<t:${String(dayjs(time).unix())}:t>`,

  /**
   * Unlike Discord relative time which updates every second, this remain static.
   *
   * 12 Hour Clock: 3 years ago
   *
   * 24 Hour Clock: 3 years ago
   */
  StaticRelativeTime: (time: Time, withoutSuffix?: boolean): string =>
    dayjs(time).fromNow(withoutSuffix),
};
