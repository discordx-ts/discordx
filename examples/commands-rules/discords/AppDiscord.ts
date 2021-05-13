import {
  Discord,
  Client,
  Rule,
  CommandMessage,
  Command,
  Rules,
  ComputedRules,
  Expression,
  Description,
  Infos,
  DOn,
} from "../../../src";

async function getRulesFromServer(command: CommandMessage) {
  let rules: Expression[] = [/compute$/];

  return rules;
}

@Discord(Rule().startWith("-hello").spaceOrEnd()) // => /^-hello(${1,}|$)/
@Description("My app part of the bot that is prefixed by -hello")
@Infos({ hello: "world" })
export abstract class AppDiscord {
  @Command()
  @Description("My hello command")
  @Infos({ admin: true })
  hello(command: CommandMessage, client: Client) {
    console.log(command.content);
  }

  // Called if the message is:
  // "-hello bye"
  // "-hello bye alias"
  // "-hello 1" or "-hello 2", ...
  // "-hello " + your server rules (/compute$/) => "-hello compute"
  @Command("bye") // Auto end ($)
  @Rules("bye", Rule("alias").end())
  @Rules(/[0-9]$/)
  @ComputedRules(getRulesFromServer)
  bye(command: CommandMessage) {
    console.log(command.content);
  }
}
