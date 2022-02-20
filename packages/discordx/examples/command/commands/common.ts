import type { GuildMember, Role, User } from "discord.js";

import type { SimpleCommandMessage } from "../../../src/index.js";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "../../../src/index.js";

@Discord()
export abstract class commandTest {
  @SimpleCommand("race", { prefix: ["&", ">"] })
  race(command: SimpleCommandMessage): void {
    command.sendUsageSyntax();
  }

  @SimpleCommand("race car", {
    description: "simple command example",
    prefix: ["&", ">"],
  })
  car(
    @SimpleCommandOption("user", { type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    @SimpleCommandOption("role", {
      description: "mention the role you wish to grant",
      type: SimpleCommandOptionType.Role,
    })
    role: Role | Error | undefined,
    command: SimpleCommandMessage
  ): void {
    !user || user instanceof Error
      ? command.sendUsageSyntax()
      : command.message.reply(
          `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
        );
  }

  @SimpleCommand("race bike", { prefix: ["&", ">"] })
  bike(command: SimpleCommandMessage): void {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("test-x", { prefix: ["&", ">"] })
  testX(
    @SimpleCommandOption("user", { type: SimpleCommandOptionType.User })
    user: GuildMember | User | Error | undefined,
    command: SimpleCommandMessage
  ): void {
    command.message.reply(`${user}`);
  }
}
