/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

export function fromMS(duration: number): string {
  const seconds = Math.floor((duration / 1e3) % 60);
  const minutes = Math.floor((duration / 6e4) % 60);
  const hours = Math.floor(duration / 36e5);
  const secondsPad = seconds.toString().padStart(2, "0");
  const minutesPad = minutes.toString().padStart(2, "0");
  const hoursPad = hours.toString().padStart(2, "0");
  return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
}

export function toMS(duration: string): number {
  const parts = duration.split(":").map(parseFloat);
  if (parts.some(Number.isNaN)) {
    throw new Error(`Invalid duration format: "${duration}"`);
  }

  // Calculate total seconds (supports hh:mm:ss, mm:ss, or ss)
  const seconds = parts.reduce((total, value) => total * 60 + value, 0);

  return Math.round(seconds * 1000);
}
