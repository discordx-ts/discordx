# ArgsOf

`ArgsOf` type your events payload as an array, just pass an event (as string) in the type parameter and it types your array with the related event's parameters

You can get the list of the events and the payload type in the ["List of events" section](/docs/general/events)

```ts
import { Discord, On, Client, ArgsOf } from "discordx";

@Discord()
class Example {
  @On("messageCreate")
  private onMessage(
    // The type of message is Message
    [message]: ArgsOf<"messageCreate">
  ) {
    // ...
  }

  @On("channelUpdate")
  private onMessage(
    // The type of channel1 and channel2 is TextChannel
    [channel1, channel2]: ArgsOf<"channelUpdate">
  ) {
    // ...
  }
}
```
