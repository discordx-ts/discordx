import { Command, CommandMessage, Rule } from "../../src";

export abstract class Bye {
  @Command(Rule("bye").caseSensitive())
  bye(command: CommandMessage) {
    return command.content;
  }
}
