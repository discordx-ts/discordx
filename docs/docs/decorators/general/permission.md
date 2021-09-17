# @Permission

Define permission for your application command or simple command.

The permissions are based on a **role id** or **user id** that you specify on the @Permission decorator

The permissions will be set when you call `client.initApplicationCommands()`

> You can manage it by yourself using your own the Slashes `Client` API and creating your own `client.initApplicationCommands()` implementation

:::warning
From discord developer docs:

For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will not be hidden.
:::

## Setup permissions

You can decorate your method with one or more @Permission decorators.

```ts
@Discord()
class DiscordBot {
  @Permission(false) // We will enable command for specific users/roles only, so disable it for everyone
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
@Permission(false) // We will enable command for specific users/roles only, so disable it for everyone
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

## Signature

```ts
@Permission(boolean | { id: Snowflake, type: "USER" | "ROLE", permission: boolean }[])
```

## Parameter

| type                                        | required |
| ------------------------------------------- | -------- |
| boolean \| ApplicationCommandPermissionData | Yes      |

## type: boolean

Boolean overwrite default permission (aka permission for everyone) for application/simple command.

## type: ApplicationCommandPermissionData

### id

The id if the user or role

| type      | required |
| --------- | -------- |
| Snowflake | Yes      |

### type

It specify if the permission is given to a user or a role

| type         | required |
| ------------ | -------- |
| ROLE \| USER | Yes      |

### permission

It specify if the permission is granted or restricated

| type    | required |
| ------- | -------- |
| boolean | Yes      |

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@Discord](/docs/decorators/general/discord)

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
