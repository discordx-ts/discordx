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

## Example - Dynamic permission resolver

Whenever permissions are required, dynamic resolvers are called. Such as, When `initApplicationPermissions` or simple command execution is performed. A dynamic permission resolver is helpful for saving permissions in the database.

Note: In order to refresh application permissions dynamically, run `initApplicationPermissions` anywhere.

```ts
@Discord()
@Permission(false) // We will enable command for specific users/roles only, so disable it for everyone
@Permission(
  async (guild: Guild | null): Promise<ApplicationCommandPermissionData> => {
    const getResponse = () => {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve(true);
        }, 5000);
      });
    };
    await getResponse(); // add delay
    return { id: "462341082919731200", permission: true, type: "USER" };
  }
)
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
@Permission(
  permission: boolean | IPermissions
): ClassMethodDecorator
```

## type: Boolean

Overwrite default permission (aka permission for everyone) for application/simple command. When true, the command can be used by anyone except those who have been denied by the @Permission decorator, vice versa.

## type: IPermissions

```ts
type IPermissions =
  | ApplicationCommandPermissionData
  | ApplicationCommandPermissionData[]
  | ((
      guild: Guild | null
    ) =>
      | ApplicationCommandPermissionData
      | ApplicationCommandPermissionData[]
      | Promise<ApplicationCommandPermissionData>
      | Promise<ApplicationCommandPermissionData[]>);
```

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
