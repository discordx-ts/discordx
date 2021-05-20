# ArgsOf 
`ArgsOf` type your events payload as an array, just pass an event (as string) in the type parameter and it types your array with the related event's parameters

You can get the list of the events and the payload type in the ["List of events" section](/discord.ts/general/events)

```ts
import {
  Discord,
  On,
  Client,
  ArgsOf
} from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage(
    // The type of message is Message
    [message]: ArgsOf<"message">
  ) {
    // ...
  }

  @On("channelUpdate")
  private onMessage(
    // The type of channel1 and channel2 is TextChannel
    [channel1, channel2]: ArgsOf<"channelUpdate">,
  ) {
    // ...
  }
}
```
