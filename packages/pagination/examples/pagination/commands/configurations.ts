import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { Pagination, PaginationType } from "../../../src/index.js";
import { GeneratePages } from "../util/common functions.js";

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Example {
  // example: simple slash with menu pagination
  @Slash("config-example", { description: "Custom page name for select menu" })
  configExample(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      pageText: "My custom page: {page}, Index: {page}",
      type: PaginationType.SelectMenu,
    }).send();
  }
}
