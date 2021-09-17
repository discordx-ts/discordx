import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "../../../src";
import { GuildMember, Role, User } from "discord.js";

@Discord()
export abstract class commandTest {
  @SimpleCommand("race")
  race(command: SimpleCommandMessage): void {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${
        command.name
      }\`\`\nargument string: \`\`${
        !command.argString.length ? " " : command.argString
      }\`\`` +
        `\nRelated Commands: \`\`${
          !command.getRelatedCommands().length
            ? "none"
            : command
                .getRelatedCommands()
                .map((cmd) => cmd.name)
                .join(", ")
        }\`\``
    );
  }

  @SimpleCommand("race car", { description: "simple command example" })
  car(
    @SimpleCommandOption("user", { type: "USER" }) user: User,
    @SimpleCommandOption("role", {
      type: "ROLE",
      description: "mention the role you wish to grant",
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

  @SimpleCommand("race bike")
  bike(command: SimpleCommandMessage): void {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("testx")
  testx(
    @SimpleCommandOption("user", { type: "USER" }) user: GuildMember | User,
    command: SimpleCommandMessage
  ): void {
    command.message.reply(`${user}`);
  }
}
