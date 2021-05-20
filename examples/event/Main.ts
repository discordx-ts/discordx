import "reflect-metadata";
import { Client } from "../../src";
import { Intents } from "discord.js";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start() {
    this._client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
      ]
    });

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    await this._client.login(
      "YOUR_TOKEN",
      `${__dirname}/discords/*.ts`, // glob string to load the classes
      `${__dirname}/discords/*.js` // If you compile your bot, the file extension will be .js
    );
  }
}

Main.start();
