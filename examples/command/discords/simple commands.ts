import { Discord, SimpleCommand, SimpleCommandMessage } from "../../../src";

@Discord()
export abstract class commandTest {
  @SimpleCommand("race")
  async race(command: SimpleCommandMessage) {
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

  @SimpleCommand("race car")
  async car(command: SimpleCommandMessage) {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("race bike")
  async bike(command: SimpleCommandMessage) {
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }
}
