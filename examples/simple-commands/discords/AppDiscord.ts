import {
  Discord,
  CommandMessage,
  Command,
  Description,
  Infos,
} from "../../../src";

interface HelloArgs {
  SLUG: string;
  NUMBER: number;
}

@Discord("!")
@Description("My super app")
@Infos({ hello: "world" })
export abstract class AppDiscord {
  @Command("hello", "SLUG", "NUMBER")
  hello(command: CommandMessage<HelloArgs>) {
    const { SLUG, NUMBER } = command.params;
    console.log(SLUG, NUMBER);
  }
}
