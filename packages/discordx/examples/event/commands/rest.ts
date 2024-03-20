/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { RestArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
