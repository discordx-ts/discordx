/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { Events, IntentsBitField, Partials } from "discord.js";
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
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
      silent: false,
    });

    Main.Client.on(Events.ClientReady, () => {
      void Main._client.initApplicationCommands().then(() => {
        console.log("Bot started...");
      });
    });

    Main.Client.on(Events.MessageReactionAdd, (reaction, user) => {
      void Main.Client.executeReaction(reaction, user);
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
