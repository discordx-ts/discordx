/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { NotBot } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  Discord,
  Guard,
  On,
  SimpleCommand,
  type ArgsOf,
  type SimpleCommandMessage,
} from "discordx";

@Discord()
@Guard(NotBot)
export class Example {
  @On({ event: Events.MessageCreate })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message([message]: ArgsOf<"messageCreate">) {
    //...
  }

  @SimpleCommand({ name: "hello" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hello(command: SimpleCommandMessage) {
    //...
  }
}
