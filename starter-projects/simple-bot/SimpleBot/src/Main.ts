import { Client } from "@typeit/discord";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start(): void {
    this._client = new Client();

    this._client.login(
      "ADD_YOUR_DISCORD_BOT_TOKEN_HERE",
      `${__dirname}/*.ts`,
      `${__dirname}/*.js`
    );
  }
}

Main.start();
