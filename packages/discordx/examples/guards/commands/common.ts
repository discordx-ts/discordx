import type { CommandInteraction } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, Guard, On, Slash } from "discordx";

import { ErrorHandler } from "../guards/Error.js";
import { NotBot } from "../guards/NotBot.js";

@Discord()
export class Example {
  @On()
  @Guard(NotBot)
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    console.log(message.content);
  }

  @Slash({ description: "hello" })
  @Guard(NotBot)
  hello(interaction: CommandInteraction): void {
    console.log(interaction);
  }

  @Slash({ description: "errorGuard", name: "error-guard" })
  @Guard(ErrorHandler, NotBot)
  errorGuard(): void {
    throw Error("My custom error");
  }
}
