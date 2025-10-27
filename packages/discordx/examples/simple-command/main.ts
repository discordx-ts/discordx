/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      // (client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
      ],
      // enable partials to receive direct messages
      partials: [Partials.Channel, Partials.Message],

      silent: false,

      simpleCommand: {
        prefix: ["$", "!"],
      },
    });

    this._client.on(Events.MessageCreate, (message) => {
      void this._client.executeCommand(message);
    });

    this._client.once(Events.ClientReady, () => {
      void this._client.initApplicationCommands();

      console.log("Bot started");
    });

    this._client.on(Events.InteractionCreate, (interaction) => {
      this._client.executeInteraction(interaction);
    });

    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }
    await this._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
