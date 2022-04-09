import "reflect-metadata";

import { Intents } from "discord.js";

import { dirname, importx } from "../../../importer/build/esm/index.mjs";
import { Client, MetadataStorage } from "../../src/index.js";

const botA = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

botA.once("ready", async () => {
  await botA.initApplicationCommands();
  await botA.initApplicationPermissions();

  console.log("Bot started");
});

botA.on("interactionCreate", (interaction) => {
  botA.executeInteraction(interaction);
});

const botB = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  silent: false,
});

botB.once("ready", async () => {
  await botB.initApplicationCommands();
  await botB.initApplicationPermissions();

  console.log("Bot started");
});

botB.on("interactionCreate", (interaction) => {
  botB.executeInteraction(interaction);
});

importx(dirname(import.meta.url) + "/commands/**/*.{js,ts}").then(() => {
  MetadataStorage.instance.build().then(() => {
    botA.login("bot token");
    botB.login("bot token");
  });
});
