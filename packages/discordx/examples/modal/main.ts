/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";

// biome-ignore lint/complexity/noStaticOnlyClass: ignore
export class Main {
  private static client: Client;

  static async start(): Promise<void> {
    Main.client = new Client({
      // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
      ],
      silent: false,
    });

    Main.client.once(Events.ClientReady, () => {
      void Main.client.initApplicationCommands();

      console.log(">> Bot started");
    });

    Main.client.on(Events.InteractionCreate, (interaction) => {
      Main.client.executeInteraction(interaction);
    });

    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);

    // let's start the bot
    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    await Main.client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
