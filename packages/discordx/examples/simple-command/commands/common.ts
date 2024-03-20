/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { GuildMember, Role, User } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";

@Discord()
export class Example {
  @SimpleCommand()
  bool(
    @SimpleCommandOption({
      name: "state",
      type: SimpleCommandOptionType.Boolean,
    })
    state: boolean | undefined,
    command: SimpleCommandMessage,
  ): void {
    command.message.reply(state ? String(state) : "state is required");
  }

  @SimpleCommand({ prefix: ["&", ">"] })
  race(command: SimpleCommandMessage): void {
    command.sendUsageSyntax();
  }

  @SimpleCommand({
    description: "simple command example",
    name: "race car",
    prefix: ["&", ">"],
  })
  car(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    @SimpleCommandOption({
      description: "mention the role you wish to grant",
      name: "role",
      type: SimpleCommandOptionType.Role,
    })
    role: Role | Error | undefined,
    command: SimpleCommandMessage,
  ): void {
    !user || user instanceof Error
      ? command.sendUsageSyntax()
      : command.message.reply(
          `command prefix: \`\`${command.prefix.toString()}\`\`\ncommand name: \`\`${
            command.name
          }\`\`\nargument string: \`\`${command.argString}\`\``,
        );
  }

  @SimpleCommand({ name: "race bike", prefix: ["&", ">"] })
  bike(command: SimpleCommandMessage): void {
    command.message.reply(
      `command prefix: \`\`${command.prefix.toString()}\`\`\ncommand name: \`\`${
        command.name
      }\`\`\nargument string: \`\`${command.argString}\`\``,
    );
  }

  @SimpleCommand({ name: "test-x", prefix: ["&", ">"] })
  testX(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    command: SimpleCommandMessage,
  ): void {
    command.message.reply(`${user}`);
  }
}
