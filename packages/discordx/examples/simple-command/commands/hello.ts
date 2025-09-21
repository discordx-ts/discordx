/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Discord, SimpleCommand, type SimpleCommandMessage } from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ aliases: ["hey", "hi"], name: "hello" })
  async hello(command: SimpleCommandMessage): Promise<void> {
    await command.message.reply(
      "This command should work both with `!` and `$` as a prefix.",
    );
  }
}
