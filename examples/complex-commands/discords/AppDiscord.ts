import {
  Discord,
  Client,
  Rule,
  CommandMessage,
  Command,
  Expression,
  Description,
  Infos,
  DOn,
} from "../../../src";

async function getRulesFromServer(command: CommandMessage) {
  return /compute$/;
}

@Discord(Rule("-hello").spaceOrEnd()) // => /^-hello(${1,}|$)/
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
  @Command(Rule("bye").space("alias").end())
  @Command(/[0-9]$/)
  @Command(getRulesFromServer)
  bye(command: CommandMessage) {
    console.log(command.content);
  }
}
