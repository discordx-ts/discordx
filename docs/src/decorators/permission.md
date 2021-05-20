# @Permission
You can set some permissions to your Slash commands

The permissions are based on a **role id** that you specify on the @Permission decorator

The permissions will be set when you call `client.initSlashes()`

> You can manage it by yourself using your own the Slashes `Client` API and creating your own `client.initSlashes()` implementation

## Setup permissions
You just decorate your parameter with one or multiple @Choice ! 

```ts
@Discord()
class DiscordBot {
  @Permission("ROLE_ID", "ROLE_ID2") // Only the role that has this ROLE_ID can use this command
  @Slash("hello")
  private hello(
  ) {
    // ...
  }
}
```

## Params
`@Permission(roleID: string)`

### roleID
`string`  
The role ID
