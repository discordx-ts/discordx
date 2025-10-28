/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import "@discordx/plugin-ytdl-player";

import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";

// biome-ignore lint/complexity/noStaticOnlyClass: ignore
export class Main {
  private static _client: Client;

  static get Client(): Client {
    return Main._client;
  }

  static async start(): Promise<void> {
    Main._client = new Client({
      // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
      silent: false,
    });

    Main._client.once(Events.ClientReady, () => {
      void Main._client.initApplicationCommands();

      console.log("Bot started");
    });

    Main._client.on(Events.InteractionCreate, (interaction) => {
      Main._client.executeInteraction(interaction);
    });

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }
    await Main._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
