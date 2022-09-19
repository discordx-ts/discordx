import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";

import { Client } from "../../src/index.js";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
      silent: false,
    });

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    await importx(dirname(import.meta.url) + "/commands/**/*.{js,ts}");

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }
    await this._client.login(process.env.BOT_TOKEN);
  }
}

Main.start();
