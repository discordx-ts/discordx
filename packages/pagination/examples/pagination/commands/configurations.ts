/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
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
  async configExample(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(interaction, GeneratePages(), {
      pageText: "My custom page: {page}, Index: {page}",
      type: PaginationType.SelectMenu,
    });

    await pagination.send();
  }
}
