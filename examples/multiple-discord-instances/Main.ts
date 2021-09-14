import { Client } from "../../src";
import { Intents } from "discord.js";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      classes: [
        // glob string to load the classes. If you compile your bot, the file extension will be .js
        `${__dirname}/discords/*.{js,ts}`,
      ],
      botGuilds: [process.env.GUILD_ID ?? ""],
    });

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    await this._client.login(process.env.BOT_TOKEN ?? "");

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });
  }
}

Main.start();
