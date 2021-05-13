import {
  Discord,
  CommandMessage,
  Command,
  Description,
  Infos,
} from "../../../src";

interface HelloArgs {
  slug: string;
  number: number;
}

@Discord("!")
@Description("My super app")
@Infos({ hello: "world" })
export abstract class AppDiscord {
  @Command("hello :slug :number")
  hello(command: CommandMessage<HelloArgs>) {
    const { slug, number } = command.args;
    console.log(slug, number);
  }
}
