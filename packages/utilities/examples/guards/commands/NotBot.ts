/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { NotBot } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  type ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  type SimpleCommandMessage,
} from "discordx";

@Discord()
@Guard(NotBot)
export class Example {
  @On({ event: Events.MessageCreate })
  message([_message]: ArgsOf<Events.MessageCreate>) {
    //...
  }

  @SimpleCommand({ name: "hello" })
  hello(_command: SimpleCommandMessage) {
    //...
  }
}
