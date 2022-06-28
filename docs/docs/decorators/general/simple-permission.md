# @SimplePermission

Define permission for your simple command.

The permissions are based on a **role id** or **user id** that you specify on the @SimplePermission decorator

## Supported with

- [@SimpleCommand](../commands/simple-command)

## Setup permissions

You can decorate your method with one or more @SimplePermission decorators.

```ts
@Discord()
class Example {
  // We will enable command for specific users/roles only, so disable it for everyone
  @SimplePermission(false)
  // This command is available only to the user whose USER_ID is mentioned
  @SimplePermission({ id: "USER_ID", type: "USER", permission: true })
  // Users with the specified ROLE_ID can run this command
  @SimplePermission({ id: "ROLE_ID", type: "ROLE", permission: true })
  @SimpleCommand("hello")
  private hello() {
    // ...
  }
}
```

## Permissions at class level

You can set the permissions for all @SimpleCommand inside the class by decorating the class with @SimplePermission

```ts
@Discord()
// We will enable command for specific users/roles only, so disable it for everyone
@SimplePermission(false)
// Below commands are available only to the user whose USER_ID is mentioned
@SimplePermission({ id: "USER_ID", type: "USER", permission: true })
// Users with the specified ROLE_ID can run this class commands
@SimplePermission({ id: "ROLE_ID", type: "ROLE", permission: true })
class Example {
  @SimpleCommand("hello")
  private hello() {
    // ...
  }

  @SimpleCommand("hello2")
  private hello2() {
    // ...
  }
}
```

## Example - Dynamic permission resolver

Whenever permissions are required, dynamic resolvers are called. Such as, When simple command execution is performed. A dynamic permission resolver is helpful for saving permissions in the database.

```ts
@Discord()
@SimplePermission(false) // We will enable command for specific users/roles only, so disable it for everyone
@SimplePermission(
  async (guild, cmd): Promise<SimpleCommandPermissionData[]> => {
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
class Example {
  @SimpleCommand("hello") // Only the role that has this ROLE_ID can use this command
  private hello() {
    // ...
  }

  @SimpleCommand("hello2") // Only the role that has this ROLE_ID can use this command
  private hello2() {
    // ...
  }
}
```

## Signature

```ts
@SimplePermission(
  permission: boolean | IPermissions
): ClassMethodDecorator
```

## type: Boolean

Overwrite default permission (aka permission for everyone) for simple command. When true, the command can be used by anyone except those who have been denied by the @SimplePermission decorator, vice versa.

## type: IPermissions

```ts
type IPermissions =
  | ApplicationCommandPermissions
  | ApplicationCommandPermissions[]
  | ((
      guild: Guild,
      command: ApplicationCommandMixin | SimpleCommandMessage
    ) =>
      | ApplicationCommandPermissions
      | ApplicationCommandPermissions[]
      | Promise<ApplicationCommandPermissions>
      | Promise<ApplicationCommandPermissions[]>);
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

It specify if the permission is granted or restricted

| type    | required |
| ------- | -------- |
| boolean | Yes      |

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@Discord](/docs/decorators/general/discord)

[@SimpleCommand](/docs/decorators/commands/simple-command)
