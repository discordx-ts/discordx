# @Permission
You can set some permissions to your Slash commands

The permissions are based on a **role id** or **user id** that you specify on the @Permission decorator

The permissions will be set when you call `client.initSlashes()`

::: danger
Permissions are only available for Guild specific Slash commands  
[More informations](https://discord.js.org/#/docs/main/master/class/ApplicationCommand?scrollTo=setPermissions)
:::

> You can manage it by yourself using your own the Slashes `Client` API and creating your own `client.initSlashes()` implementation

## Setup permissions
You just decorate your parameter with one or multiple @Permission ! 

```ts
@Discord()
class DiscordBot {
  @Permission("USER_ID", "USER") // Only the role that has this USER_ID can use this command
  @Permission("ROLE_ID", "ROLE") // Only the role that has this ROLE_ID can use this command
  @Slash("hello")
  private hello(
  ) {
    // ...
  }
}
```

## Permissions at class level
You can set the permissions for all @Slash inside the class by decorating the class with @Permission
```ts
@Discord()
@Permission("USER_ID", "USER") // Only the role that has this USER_ID can use this command
@Permission("ROLE_ID", "ROLE") // Only the role that has this ROLE_ID can use this command
class DiscordBot {
  @Slash("hello") // Only the role that has this ROLE_ID can use this command
  private hello(
  ) {
    // ...
  }

  @Slash("hello2") // Only the role that has this ROLE_ID can use this command
  private hello2(
  ) {
    // ...
  }
}
```

## Params
`@Permission(id: string, type: "USER" | "ROLE")`

### id
`string`  
The id if the user or role

### type
`"ROLE" | "USER"`  
It specify if the permission is given to a user or a role
