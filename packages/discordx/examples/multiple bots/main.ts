/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { Events, IntentsBitField } from "discord.js";
import { Client, MetadataStorage } from "discordx";

const botA = new Client({
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

botA.once(Events.ClientReady, () => {
  void botA.initApplicationCommands();

  console.log("Bot started");
});

botA.on(Events.InteractionCreate, (interaction) => {
  botA.executeInteraction(interaction);
});

const botB = new Client({
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  silent: false,
});

botB.once(Events.ClientReady, () => {
  void botB.initApplicationCommands();

  console.log("Bot started");
});

botB.on(Events.InteractionCreate, (interaction) => {
  botB.executeInteraction(interaction);
});

void importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`).then(() => {
  void MetadataStorage.instance.build().then(() => {
    void botA.login("bot token");
    void botB.login("bot token");
  });
});
