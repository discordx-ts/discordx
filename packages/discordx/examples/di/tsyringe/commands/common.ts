/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { tsyringeDependencyRegistryEngine } from "@discordx/di";
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
export class Example {
  constructor(private readonly database: Database) {
    // I am just a empty constructor :(
  }

  @Slash({ description: "tsyringe" })
  async tsyringe(interaction: CommandInteraction): Promise<void> {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      const clazz = container.resolve(Example);
      await interaction.reply(
        `${clazz.database.query()}, same class: ${String(clazz === this)}`,
      );
    } else {
      await interaction.reply("Not using TSyringe");
    }
  }

  @Slash({ description: "tsyringe2" })
  async tsyringe2(interaction: CommandInteraction): Promise<void> {
    if (DIService.engine === tsyringeDependencyRegistryEngine) {
      await interaction.reply(this.database.query());
    } else {
      await interaction.reply("Not using TSyringe");
    }
  }
}
