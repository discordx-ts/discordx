import { Discord, On, Client, ArgsOf, Guard } from "../../../src";
import { Say } from "../guards/Say";

@Discord()
export abstract class AppDiscord {
  @On("message")
  @Guard(Say("hello"))
  onMessage(
    [message]: ArgsOf<"message">,
    client: Client
  ) {
    console.log(message.content);
  }
}
