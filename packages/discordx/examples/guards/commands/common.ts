import type { CommandInteraction } from "discord.js";

import type { ArgsOf, Client } from "../../../src/index.js";
import { Discord, Guard, On, Slash } from "../../../src/index.js";
import { ErrorHandler } from "../guards/Error.js";
import { NotBot } from "../guards/NotBot.js";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  @Guard(NotBot)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage([message]: ArgsOf<"messageCreate">, _client: Client): void {
    console.log(message.content);
  }

  @Slash("hello")
  @Guard(NotBot)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hello(interaction: CommandInteraction, _client: Client): void {
    console.log(interaction);
  }

  @Slash("error-guard")
  @Guard(ErrorHandler, NotBot)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  errorGuard(interaction: CommandInteraction, _client: Client): void {
    throw Error("My custom error");
  }
}
