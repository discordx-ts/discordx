/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { NotBot } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandMessage,
} from "discordx";

@Discord()
@Guard(NotBot)
class Example {
  @On({ event: Events.MessageCreate })
  message([message]: ArgsOf<"messageCreate">) {
    //...
  }

  @SimpleCommand({ name: "hello" })
  hello(command: SimpleCommandMessage) {
    //...
  }
}
