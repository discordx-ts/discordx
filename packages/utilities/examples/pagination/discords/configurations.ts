import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";
import { GeneratePages } from "../util/common functions.js";
import { Pagination } from "../../../build/cjs/index.cjs";

@Discord()
export abstract class Example {
  // example: simple slash with menu pagination
  @Slash("configexample", { description: "Custom page name for select menu" })
  pagex(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      pageText: "My custom page: {page}, Index: {page}",
      type: "SELECT_MENU",
    }).send();
  }
}
