# @Command

Create a simple command handler for messages using `@Command`. Example `!hello world`

# Example

```ts
@Discord()
class commandTest {
  @Command("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200" as Snowflake,
    type: "USER",
    permission: true,
  })
  async permFunc(message: CommandMessage) {
    message.reply("access granted");
  }
}
```
