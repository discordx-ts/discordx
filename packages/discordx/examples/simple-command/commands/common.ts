/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { GuildMember, Role, User } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ name: "toggle" })
  toggleState(
    @SimpleCommandOption({
      name: "state",
      description: "Enter 'true' to enable, 'false' to disable",
      type: SimpleCommandOptionType.Boolean,
    })
    state: boolean | undefined,
    command: SimpleCommandMessage,
  ): void {
    command.message.reply(
      state !== undefined
        ? `State is set to ${state}.`
        : "Please specify a state.",
    );
  }

  @SimpleCommand({ name: "help" })
  displayHelp(command: SimpleCommandMessage): void {
    command.sendUsageSyntax();
  }

  @SimpleCommand({
    description: "Grant a role to a user.",
    name: "grant-role",
  })
  grantRole(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    @SimpleCommandOption({
      description: "Mention the role you wish to grant.",
      name: "role",
      type: SimpleCommandOptionType.Role,
    })
    role: Role | Error | undefined,
    command: SimpleCommandMessage,
  ): void {
    if (!user || user instanceof Error) {
      command.sendUsageSyntax();
      return;
    }
    command.message.reply(
      `Granting ${role?.name} role to ${user instanceof GuildMember ? user.displayName : user.username}.`,
    );
  }

  @SimpleCommand({ name: "display-info" })
  displayInfo(command: SimpleCommandMessage): void {
    command.message.reply(
      `Command Prefix: \`\`${command.prefix.toString()}\`\`\nCommand Name: \`\`${command.name}\`\`\nArgument String: \`\`${command.argString}\`\``,
    );
  }

  @SimpleCommand({ name: "target" })
  testX(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    command: SimpleCommandMessage,
  ): void {
    command.message.reply(
      `Target: ${user instanceof GuildMember ? user.displayName : user}`,
    );
  }
}
