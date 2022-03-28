import type { CommandInteraction } from "discord.js";
import { Container, Inject, Service } from "typedi";

import { Discord, DIService, Slash } from "../../../src/index.js";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ConstructorInjection {
  constructor(
    private database: Database,
    @Inject("myDb") private namedDatabase: NamedDatabase
  ) {
    // I am just a empty constructor :(
  }

  @Slash("typedi")
  typedi(interaction: CommandInteraction): void {
    if (DIService.container) {
      const clazz = Container.get(ConstructorInjection);
      interaction.reply(
        `${clazz.database.query()}, same class: ${
          clazz === this
        } and ${clazz.namedDatabase.query()} comes from "NamedDatabase"`
      );
    } else {
      interaction.reply("Not using TypeDI");
    }
  }

  @Slash("typedi2")
  typedi2(interaction: CommandInteraction): void {
    if (DIService.container) {
      interaction.reply(this.database.query());
    } else {
      interaction.reply("Not using TypeDI");
    }
  }
}

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PropertyInjectionExample {
  @Inject()
  private database!: Database;

  @Inject("myDb")
  private namedDatabase!: NamedDatabase;

  @Slash("typedi_prop_injection")
  typedi(interaction: CommandInteraction): void {
    if (DIService.container && this.namedDatabase && this.database) {
      const clazz = Container.get(PropertyInjectionExample);
      interaction.reply(
        `${clazz.database?.query()}, same class: ${
          clazz === this
        } and ${clazz.namedDatabase?.query()} comes from "NamedDatabase"`
      );
    } else {
      interaction.reply("Not using TypeDI");
    }
  }
  @Slash("typedi_prop_injection")
  typedi2(interaction: CommandInteraction): void {
    if (DIService.container) {
      if (this.database) {
        interaction.reply(this.database.query());
      }
    } else {
      interaction.reply("Not using TypeDI");
    }
  }
}
