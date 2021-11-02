import "reflect-metadata";
import { Client, MetadataStorage } from "../../src";
import { Intents } from "discord.js";

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
});

botB.once("ready", async () => {
  await botB.initApplicationCommands();
  await botB.initApplicationPermissions();

  console.log("Bot started");
});

botB.on("interactionCreate", (interaction) => {
  botB.executeInteraction(interaction);
});

MetadataStorage.instance.build([`${__dirname}/discords/*.{js,ts}`]).then(() => {
  botA.login("bot token");
  botB.login("bot token");
});
