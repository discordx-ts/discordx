/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

export interface LyricsLine {
  /**
   * The duration of the line in milliseconds
   */
  duration: number | null;
  /**
   * The lyrics line
   */
  line: string;
  /**
   * Additional plugin specific data
   */
  plugin: any;
  /**
   * The timestamp of the line in milliseconds
   */
  timestamp: number;
}

export interface Lyrics {
  /**
   * The lyrics lines
   */
  lines: LyricsLine[];
  /**
   * Additional plugin specific data
   */
  plugin: any;
  /**
   * The name of the provider the lyrics was fetched from on the source
   */
  provider: string;
  /**
   * The name of the source where the lyrics were fetched from
   */
  sourceName: string;
  /**
   * The lyrics text
   */
  text: string | null;
}
