/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { GuildMember, type Role, type User } from "discord.js";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  type SimpleCommandMessage,
} from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ name: "toggle" })
  async toggleState(
    @SimpleCommandOption({
      name: "state",
      description: "Enter 'true' to enable, 'false' to disable",
      type: SimpleCommandOptionType.Boolean,
    })
    state: boolean | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    await command.message.reply(
      state !== undefined
        ? `State is set to ${String(state)}.`
        : "Please specify a state.",
    );
  }

  @SimpleCommand({ name: "help" })
  async displayHelp(command: SimpleCommandMessage): Promise<void> {
    await command.sendUsageSyntax();
  }

  @SimpleCommand({
    description: "Grant a role to a user.",
    name: "grant-role",
  })
  async grantRole(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    @SimpleCommandOption({
      description: "Mention the role you wish to grant.",
      name: "role",
      type: SimpleCommandOptionType.Role,
    })
    role: Role | Error | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (!user || user instanceof Error) {
      await command.sendUsageSyntax();
      return;
    }

    await command.message.reply(
      `Granting ${role?.name ?? "unknown"} role to ${user instanceof GuildMember ? user.displayName : user.username}.`,
    );
  }

  @SimpleCommand({ name: "display-info" })
  async displayInfo(command: SimpleCommandMessage): Promise<void> {
    await command.message.reply(
      `Command Prefix: \`\`${command.prefix}\`\`\nCommand Name: \`\`${command.name}\`\`\nArgument String: \`\`${command.argString}\`\``,
    );
  }

  @SimpleCommand({ name: "target" })
  async testX(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    const target = user instanceof GuildMember ? user.displayName : user;
    await command.message.reply(`Target: ${target?.toString() ?? "unknown"}`);
  }
}
