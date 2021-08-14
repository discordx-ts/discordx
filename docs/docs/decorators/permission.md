# @Permission

You can set some permissions to your Slash commands or normal commands

The permissions are based on a **role id** or **user id** that you specify on the @Permission decorator

The permissions will be set when you call `client.initSlashes()`

> You can manage it by yourself using your own the Slashes `Client` API and creating your own `client.initSlashes()` implementation

## Setup permissions

You just decorate your parameter with one or multiple @Permission !

```ts
@Discord()
class DiscordBot {
  @DefaultPermission(false)
  @Permission({ id: "USER_ID", type: "USER", permission: true }) // Only the role that has this USER_ID can use this command
  @Permission({ id: "ROLE_ID", type: "ROLE", permission: true }) // Only the role that has this ROLE_ID can use this command
  @Slash("hello")
  private hello() {
    // ...
  }
}
```

## Permissions at class level

You can set the permissions for all @Slash inside the class by decorating the class with @Permission

```ts
@Discord()
@DefaultPermission(false)
@Permission({ id: "USER_ID", type: "USER", permission: true }) // Only the role that has this USER_ID can use this command
@Permission({ id: "ROLE_ID", type: "ROLE", permission: true }) // Only the role that has this ROLE_ID can use this command
class DiscordBot {
  @Slash("hello") // Only the role that has this ROLE_ID can use this command
  private hello() {
    // ...
  }

  @Slash("hello2") // Only the role that has this ROLE_ID can use this command
  private hello2() {
    // ...
  }
}
```

## Params

`@Permission({ id: Snowflake, type: "USER" | "ROLE", permission: true | false })`

### id

`Snowflake`
The id if the user or role

### type

`"ROLE" | "USER"`
It specify if the permission is given to a user or a role

### permission

`true | false`
It specify if the permission is granted or restricated

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@Discord](/docs/decorators/discord)

[@SimpleCommand](/docs/decorators/simeplcommand)

[@Slash](/docs/decorators/slash)
