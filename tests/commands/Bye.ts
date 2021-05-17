import { Command, CommandMessage, Rule, On } from "../../src";

export abstract class Bye {
  bindingTest = "pass";

  @On("messageDelete")
  onMessageDelete() {
    return "messagedeleted" + this.bindingTest;
  }

  @Command(Rule("bye").caseSensitive())
  bye(command: CommandMessage) {
    return command.content + this.bindingTest;
  }
}
