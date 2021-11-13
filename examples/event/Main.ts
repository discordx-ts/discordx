import "reflect-metadata";
import { dirname, importx } from "../../packages/importer/src/esm/index.js";
import { Client } from "../../src/index.js";
import { Intents } from "discord.js";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    await importx(dirname(import.meta.url) + "/discords/**/*.{js,ts}");
    await this._client.login(process.env.BOT_TOKEN ?? "");
  }
}

Main.start();
