import { dirname, importx } from "@discordx/importer";
import { ChannelType, IntentsBitField, Partials } from "discord.js";

import { Client } from "../../src/index.js";

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
      ],
      // enable partials to receive direct messages
      partials: [Partials.Channel, Partials.Message],

      silent: false,

      simpleCommand: {
        // prefix: "!",
        prefix: (message): string | string[] => {
          // let's use different command prefix for dm
          if (message.channel.type === ChannelType.DM) {
            return "+";
          }

          // common command prefix for all guild
          return ["!"];
        },

        responses: {
          notFound: "command not found, use !help",
        },
      },
    });

    this._client.on("messageCreate", (message) => {
      this._client.executeCommand(message);
    });

    this._client.once("ready", async () => {
      await this._client.initApplicationCommands();

      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
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

Main.start();
