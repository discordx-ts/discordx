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
      "NzExNzUyMTU2Mjg5Njk1Nzk2.XsHk3w.-Ifb_17Zu787EbqdEdC_Seo3-V4",
      `${__dirname}/discords/*.ts`, // glob string to load the classes
      `${__dirname}/discords/*.js` // If you compile your bot, the file extension will be .js
    );

    console.log(Client.getCommands());
  }
}

Main.start();
