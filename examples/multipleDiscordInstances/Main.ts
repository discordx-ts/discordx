import { Client } from "../../src";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start() {
    this._client = new Client();
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      "YOUR_TOKEN",
      `${__dirname}/Discords/*.ts` // glob string to load the classes
    );

    console.log(Client.getCommands());
  }
}

Main.start();
