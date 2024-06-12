/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

export enum RepeatMode {
  OFF = "OFF",
  REPEAT_ALL = "REPEAT_ALL",
  REPEAT_ONE = "REPEAT_ONE",
}

export function fromMS(duration: number): string {
  const seconds = Math.floor((duration / 1e3) % 60).toString();
  const minutes = Math.floor((duration / 6e4) % 60).toString();
  const hours = Math.floor(duration / 36e5).toString();
  const secondsPad = seconds.padStart(2, "0");
  const minutesPad = minutes.padStart(2, "0");
  const hoursPad = hours.padStart(2, "0");
  return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
}
