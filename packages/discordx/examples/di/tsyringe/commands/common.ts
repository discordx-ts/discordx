import { tsyringeDependencyRegistryEngine } from "@discordx/di";
import type { CommandInteraction } from "discord.js";
import { container, injectable, singleton } from "tsyringe";

import { Discord, DIService, Slash } from "../../../../src/index.js";

@singleton()
class Database {
  database: string;

  constructor() {
    console.log("I am database");
    this.database = "connected";
  }

  query() {
    return this.database;
  }
}

@Discord()
@injectable()
export class Example {
  constructor(private database: Database) {
    // I am just a empty constructor :(
  }

  @Slash({ description: "tsyringe" })
  tsyringe(interaction: CommandInteraction): void {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      const clazz = container.resolve(Example);
      interaction.reply(
        `${clazz.database.query()}, same class: ${clazz === this}`
      );
    } else {
      interaction.reply("Not using TSyringe");
    }
  }

  @Slash({ description: "tsyringe2" })
  tsyringe2(interaction: CommandInteraction): void {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      interaction.reply(this.database.query());
    } else {
      interaction.reply("Not using TSyringe");
    }
  }
}
