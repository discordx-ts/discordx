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
      ],
    });

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands({
        global: { log: true },
        guild: { log: true },
      });
      await this._client.initApplicationPermissions(true);

      console.log(">> Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    await importx(__dirname + "/discords/**/*.{js,ts}");
    await this._client.login(process.env.BOT_TOKEN ?? "");
  }
}

Main.start();
