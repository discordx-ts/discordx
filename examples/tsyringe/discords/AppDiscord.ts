import { DIService, Discord, Slash } from "../../../src";
import { CommandInteraction } from "discord.js";
import { singleton } from "tsyringe";

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
@singleton() // singleton must defined under @Discord
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AppDiscord {
  constructor(private database: Database) {
    // I am just a empty constructor :(
  }

  @Slash("tsyringe")
  tsyringe(interaction: CommandInteraction): void {
    if (DIService.container) {
      const myClass = DIService.container.resolve(AppDiscord);
      interaction.reply(
        `${myClass.database.query()}, same class: ${myClass === this}`
      );
    } else {
      interaction.reply("Not using tsyringe");
    }
  }

  @Slash("tsyringe2")
  tsyringe2(interaction: CommandInteraction): void {
    if (DIService.container) {
      interaction.reply(this.database.query());
    } else {
      interaction.reply("Not using tsyringe");
    }
  }
}
