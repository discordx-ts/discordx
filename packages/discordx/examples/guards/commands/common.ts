/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
