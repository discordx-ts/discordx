import { DApplicationCommand } from "..";
import { Guild } from "discord.js";

export class ApplicationGuildMixin {
  constructor(public guild: Guild, public instance: DApplicationCommand) {}

  get name(): string {
    return this.instance.name;
  }

  get description(): string {
    return this.instance.description;
  }
}
