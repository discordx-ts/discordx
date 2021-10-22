import { DApplicationCommand } from "..";
import { Guild } from "discord.js";

export class ApplicationGuildMixin {
  guild: Guild;
  instance: DApplicationCommand;
  constructor(guild: Guild, instance: DApplicationCommand) {
    this.guild = guild;
    this.instance = instance;
  }

  get name(): string {
    return this.instance.name;
  }

  get description(): string {
    return this.instance.description;
  }
}
