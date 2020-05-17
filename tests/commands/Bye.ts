import { Command, CommandMessage, Rule, Rules, RuleBuilder } from "../../src";

export abstract class Bye {
  @Command(Rule("bye").caseSensitive())
  @Rules(Rule(/test/).space("me"))
  bye(command: CommandMessage) {
    return command.content;
  }
}
