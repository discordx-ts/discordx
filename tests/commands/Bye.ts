import { Command, CommandMessage, Rule, Rules, On } from "../../src";

export abstract class Bye {
  bindingTest = "pass";

  @On("messageDelete")
  onMessageDelete() {
    return "messagedeleted" + this.bindingTest;
  }

  @Command(Rule("bye").caseSensitive())
  @Rules(Rule(/test/).space("me"))
  bye(command: CommandMessage) {
    return command.content + this.bindingTest;
  }
}
