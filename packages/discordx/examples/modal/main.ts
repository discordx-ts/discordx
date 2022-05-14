import "reflect-metadata";

import { Intents } from "discord.js";
import path from "path";

import { dirname, importx } from "../../../importer/build/esm/index.mjs";
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
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
      silent: false,
    });

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands({
        global: { log: true },
        guild: { log: true },
      });

      // await this._client.initApplicationPermissions(true);

      console.log(">> Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    await importx(
      path
        .join(dirname(import.meta.url), "/commands/**/*.{js,ts}")
        .replaceAll("\\", "/")
    );

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    await this._client.login(process.env.BOT_TOKEN);
  }
}

Main.start();
