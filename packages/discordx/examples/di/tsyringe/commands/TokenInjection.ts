/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  TsyringeDependencyRegistryEngine,
  tsyringeDependencyRegistryEngine,
} from "@discordx/di";
import type { CommandInteraction } from "discord.js";
import { Discord, DIService, Slash } from "discordx";
import { container, injectable, singleton } from "tsyringe";

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
  constructor(private readonly database: Database) {
    // I am just a empty constructor :(
  }

  @Slash({ description: "tsyringe", name: "tsyringe_token" })
  tsyringe(interaction: CommandInteraction): void {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      const allDiscordClasses = container.resolveAll(
        TsyringeDependencyRegistryEngine.token,
      );
      const clazz = container.resolve(ExampleToken);
      const resolvedClassInTokenisedClasses = allDiscordClasses.includes(clazz);
      interaction.reply(
        `${clazz.database.query()}, same class: ${
          clazz === this
        }\ntokenized class included in resolved class: ${resolvedClassInTokenisedClasses}`,
      );
    } else {
      interaction.reply("Not using TSyringe");
    }
  }
}
