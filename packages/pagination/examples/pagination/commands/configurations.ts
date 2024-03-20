/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Pagination, PaginationType } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { GeneratePages } from "../util/common functions.js";

@Discord()
export class Example {
  // example: simple slash with menu pagination
  @Slash({
    description: "Custom page name for select menu",
    name: "config-example",
  })
  configExample(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      pageText: "My custom page: {page}, Index: {page}",
      type: PaginationType.SelectMenu,
    }).send();
  }
}
