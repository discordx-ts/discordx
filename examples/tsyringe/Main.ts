import "reflect-metadata";
import { Client, DIService } from "../../src/index.js";
import { Intents } from "discord.js";
import { container } from "tsyringe";
// import { fileURLToPath } from "url";
// import path from "path";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// initialize tsyringe container
// it's important, this done before calling bot.login
DIService.container = container;

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

    await this._client.login(process.env.BOT_TOKEN ?? "");

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();
      await this._client.initApplicationPermissions();

      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });
  }
}

Main.start();
