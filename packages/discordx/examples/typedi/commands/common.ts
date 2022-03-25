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
      const myClass = Container.get(ConstructorInjection);
      interaction.reply(
        `${myClass.database.query()}, same class: ${
          myClass === this
        } and ${myClass.namedDatabase.query()} comes from "NamedDatabase"`
      );
    } else {
      interaction.reply("Not using typedi");
    }
  }

  @Slash("typedi2")
  typedi2(interaction: CommandInteraction): void {
    if (DIService.container) {
      interaction.reply(this.database.query());
    } else {
      interaction.reply("Not using typedi");
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
      const myClass = Container.get(PropertyInjectionExample);
      interaction.reply(
        `${myClass.database?.query()}, same class: ${
          myClass === this
        } and ${myClass.namedDatabase?.query()} comes from "NamedDatabase"`
      );
    } else {
      interaction.reply("Not using typedi");
    }
  }
  @Slash("typedi_prop_injection")
  typedi2(interaction: CommandInteraction): void {
    if (DIService.container) {
      if (this.database) {
        interaction.reply(this.database.query());
      }
    } else {
      interaction.reply("Not using typedi");
    }
  }
}
