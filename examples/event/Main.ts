import "reflect-metadata";
import { Client } from "../../build/cjs/index.js";
import { Intents } from "discord.js";
import { importx } from "../../packages/importer/build/cjs/index.cjs";

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
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
    });

    this.Client.on("ready", () => {
      console.log("Bot started...");
    });

    await importx(__dirname + "/commands/**/*.{js,ts}");
    await this._client.login(process.env.BOT_TOKEN ?? "");
  }
}

Main.start();
