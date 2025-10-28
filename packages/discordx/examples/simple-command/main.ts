/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";

// biome-ignore lint/complexity/noStaticOnlyClass: ignore
export class Main {
  private static _client: Client;

  static get Client(): Client {
    return Main._client;
  }

  static async start(): Promise<void> {
    Main._client = new Client({
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

    Main._client.on(Events.MessageCreate, (message) => {
      void Main._client.executeCommand(message);
    });

    Main._client.once(Events.ClientReady, () => {
      void Main._client.initApplicationCommands();

      console.log("Bot started");
    });

    Main._client.on(Events.InteractionCreate, (interaction) => {
      Main._client.executeInteraction(interaction);
    });

    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }
    await Main._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
