/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { SimpleCommandMessage } from "discordx";
import { Discord, SimpleCommand } from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ aliases: ["hey", "hi"], name: "hello" })
  hello(command: SimpleCommandMessage): void {
    command.message.reply(":wave:");
  }
}
