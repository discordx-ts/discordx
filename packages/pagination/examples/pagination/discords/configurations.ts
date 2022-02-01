import type { ChatInputCommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { Pagination } from "../../../build/cjs/index.js";
import { GeneratePages } from "../util/common functions.js";

@Discord()
export abstract class Example {
  // example: simple slash with menu pagination
  @Slash("configexample", { description: "Custom page name for select menu" })
  pagex(interaction: ChatInputCommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      pageText: "My custom page: {page}, Index: {page}",
      type: "SELECT_MENU",
    }).send();
  }
}
