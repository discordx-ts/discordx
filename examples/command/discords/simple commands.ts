import { Discord, SimpleCommand, CommandMessage } from "../../../src";

@Discord()
export abstract class commandTest {
  @SimpleCommand("race")
  async race(message: CommandMessage) {
    message.reply(
      `command prefix: \`\`${message.command.prefix}\`\`\ncommand name: \`\`${message.command.name}\`\`\nargument string: \`\`${message.command.argString}\`\``
    );
  }

  @SimpleCommand("race car")
  async car(message: CommandMessage) {
    message.reply(
      `command prefix: \`\`${message.command.prefix}\`\`\ncommand name: \`\`${message.command.name}\`\`\nargument string: \`\`${message.command.argString}\`\``
    );
  }

  @SimpleCommand("race bike")
  async bike(message: CommandMessage) {
    message.reply(
      `command prefix: \`\`${message.command.prefix}\`\`\ncommand name: \`\`${message.command.name}\`\`\nargument string: \`\`${message.command.argString}\`\``
    );
  }
}
