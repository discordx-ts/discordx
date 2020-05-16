import { Command, CommandMessage, Rule, Rules, RuleBuilder } from "../../src";

export abstract class Bye {
  @Command(Rule("bye").caseSensitive())
  @Rules(RuleBuilder.atLeastOneSpace, [
    /test/i,
    /me/i
  ])
  bye(command: CommandMessage) {
    return command.content;
  }
}
