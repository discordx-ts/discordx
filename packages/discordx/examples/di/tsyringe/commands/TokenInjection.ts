import type { CommandInteraction } from "discord.js";
import { container, injectable, singleton } from "tsyringe";

import { tsyringeDependencyRegistryEngine } from "../../../../../di/src/index.js";
import { TsyringeDependencyRegistryEngine } from "../../../../../di/src/logic/impl/index.js";
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
export class ExampleToken {
  constructor(private database: Database) {
    // I am just a empty constructor :(
  }

  @Slash({ description: "tsyringe" })
  tsyringe_token(interaction: CommandInteraction): void {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      const allDiscordClasses = container.resolveAll(
        TsyringeDependencyRegistryEngine.token
      );
      const clazz = container.resolve(ExampleToken);
      const resolvedClassInTokenisedClasses = allDiscordClasses.includes(clazz);
      interaction.reply(
        `${clazz.database.query()}, same class: ${
          clazz === this
        }\ntokenized class included in resolved class: ${resolvedClassInTokenisedClasses}`
      );
    } else {
      interaction.reply("Not using TSyringe");
    }
  }
}
