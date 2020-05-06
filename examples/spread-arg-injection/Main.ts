import "reflect-metadata";
import {
  Client // Use the Client that is provided by @typeit/discord NOT discord.js
} from "../../src";

export class Main {
  static start() {
    const client = new Client({
      payloadInjection: "spread"
    });

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    client.login(
      "YOUR_TOKEN",
      `${__dirname}/discords/*Discord.ts` // glob string to load the classes
    );
  }
}

Main.start();
