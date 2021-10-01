import "reflect-metadata";
import { CategoryClient } from "../../src/category/client";
import { Intents } from "discord.js";

export class Main {
  private static _client: CategoryClient;

  static get Client(): CategoryClient {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new CategoryClient({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      classes: [
        // glob string to load the classes. If you compile your bot, the file extension will be .js
        `${__dirname}/discords/*.{js,ts}`,
      ],
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    await this._client.login(process.env.BOT_TOKEN ?? "");

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();
      await this._client.initApplicationPermissions();

      console.log("Bot started");

      this._client.categories.forEach((cat) => {
        console.log(cat.name, JSON.stringify(cat.items));
      });
    });

    this._client.on("interactionCreate", (interaction) => {
      // do not execute interaction, if it's pagination (avoid warning: selectmenu/button interaction not found)
      if (interaction.isButton() || interaction.isSelectMenu()) {
        if (interaction.customId.startsWith("discordx@pagination@")) {
          return;
        }
      }
      this._client.executeInteraction(interaction);
    });
  }
}

Main.start();
