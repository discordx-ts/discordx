/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import {
  Discord,
  DIService,
  Slash,
  typeDiDependencyRegistryEngine,
} from "discordx";
import { Container, Inject, Service } from "typedi";

@Service()
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

@Service("myDb")
class NamedDatabase {
  database: string;

  constructor() {
    console.log("I am database");
    this.database = "myDb";
  }

  query() {
    return this.database;
  }
}

@Discord()
export class ConstructorInjection {
  constructor(
    private database: Database,
    @Inject("myDb") private namedDatabase: NamedDatabase,
  ) {
    console.log(namedDatabase);
  }

  @Slash({ description: "typedi" })
  async typedi(interaction: CommandInteraction): Promise<void> {
    if (DIService.engine === typeDiDependencyRegistryEngine) {
      const clazz = Container.get(ConstructorInjection);
      await interaction.reply(
        `${clazz.database.query()}, same class: ${
          clazz === this
        } and ${clazz.namedDatabase.query()} comes from "NamedDatabase"`,
      );
    } else {
      await interaction.reply("Not using TypeDI");
    }
  }

  @Slash({ description: "typedi2" })
  async typedi2(interaction: CommandInteraction): Promise<void> {
    if (DIService.engine === typeDiDependencyRegistryEngine) {
      await interaction.reply(this.database.query());
    } else {
      await interaction.reply("Not using TypeDI");
    }
  }
}

@Discord()
export class PropertyInjectionExample {
  @Inject()
  private database!: Database;

  @Inject("myDb")
  private namedDatabase!: NamedDatabase;

  @Slash({
    description: "typedi_prop_injection",
    name: "typedi_prop_injection",
  })
  async typedi(interaction: CommandInteraction): Promise<void> {
    if (
      DIService.engine === typeDiDependencyRegistryEngine &&
      this.namedDatabase &&
      this.database
    ) {
      const clazz = Container.get(PropertyInjectionExample);
      await interaction.reply(
        `${clazz.database?.query()}, same class: ${
          clazz === this
        } and ${clazz.namedDatabase?.query()} comes from "NamedDatabase"`,
      );
    } else {
      await interaction.reply("Not using TypeDI");
    }
  }

  @Slash({
    description: "typedi_prop_injection2",
    name: "typedi_prop_injection2",
  })
  async typedi2(interaction: CommandInteraction): Promise<void> {
    if (DIService.engine === typeDiDependencyRegistryEngine) {
      if (this.database) {
        await interaction.reply(this.database.query());
      }
    } else {
      await interaction.reply("Not using TypeDI");
    }
  }
}
