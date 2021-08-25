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
  async race(command: SimpleCommandMessage): Promise<void> {
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
  async car(
    @SimpleCommandOption("user", { type: "USER" }) user: User,
    @SimpleCommandOption("role", {
      type: "ROLE",
      description: "mention the role you wish to grant",
    })
    role: Role,
    command: SimpleCommandMessage
  ): Promise<unknown> {
    if (!user) return command.sendUsageSyntax();
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("race bike")
  async bike(command: SimpleCommandMessage): Promise<void> {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("testx")
  async testx(
    @SimpleCommandOption("user") user: GuildMember,
    command: SimpleCommandMessage
  ): Promise<void> {
    console.log(user);
    command.message.reply("done");
  }
}
