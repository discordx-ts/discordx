import "reflect-metadata";

import { Intents } from "discord.js";

import { Client } from "../../discordx/src/index.js";
import { dirname, importx } from "../../importer/build/esm/index.mjs";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      silent: false,
    });

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();
      // await this._client.initApplicationPermissions();

      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      // do not execute interaction, if it's pagination (avoid warning: select-menu/button interaction not found)
      if (interaction.isButton() || interaction.isSelectMenu()) {
        if (interaction.customId.startsWith("discordx@pagination@")) {
          return;
        }
      }
      this._client.executeInteraction(interaction);
    });

    this._client.on("messageCreate", (message) => {
      this._client.executeCommand(message);
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
