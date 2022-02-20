import type { Guild } from "discord.js";

import type { DApplicationCommand } from "../../index.js";

export class ApplicationGuildMixin {
  constructor(public guild: Guild, public instance: DApplicationCommand) {}

  get name(): string {
    return this.instance.name;
  }

  get description(): string {
    return this.instance.description;
  }
}
