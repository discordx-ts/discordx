import "reflect-metadata";
import { Client } from "../../src";
import { Intents } from "discord.js";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start() {
    this._client = new Client({
      // prefix: "!",
      prefix: async (message) => {
        // let's use different command prefix for dm
        if (message.channel.type === "DM") return "+";

        // common command prefix for all guild
        return "!";
      },

      // commandUnauthorizedHandler: "you are not authorized to use this command",
      commandUnauthorizedHandler: async (command) => {
        if (command.message.channel.type === "DM") {
          command.message.reply(
            "do you have permission to access this command?"
          );
          return;
        }

        // let's have different message for guild command
        command.message.reply(
          `${command.message.member} you are not authorized to access ${command.prefix}${command.name} command`
        );
        return;
      },
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
      ],
      // enable partials to recieve direct messages
      partials: ["CHANNEL", "MESSAGE"],
      classes: [
        `${__dirname}/discords/*.ts`, // glob string to load the classes
        `${__dirname}/discords/*.js`, // If you compile your bot, the file extension will be .js
      ],
      // botGuilds: [YOUR_GUILD_ID],
      silent: false,
      requiredByDefault: true,
    });

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    await this._client.login(process.env.BOT_TOKEN);

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
  }
}

Main.start();
