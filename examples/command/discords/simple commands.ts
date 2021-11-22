import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "../../../build/cjs/index.js";
import { GuildMember, Role, User } from "discord.js";

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
    @SimpleCommandOption("user", { type: "USER" }) user: User,
    @SimpleCommandOption("role", {
      description: "mention the role you wish to grant",
      type: "ROLE",
    })
    role: Role,
    command: SimpleCommandMessage
  ): void {
    !user
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

  @SimpleCommand("testx", { prefix: ["&", ">"] })
  testx(
    @SimpleCommandOption("user", { type: "USER" }) user: GuildMember | User,
    command: SimpleCommandMessage
  ): void {
    command.message.reply(`${user}`);
  }
}
