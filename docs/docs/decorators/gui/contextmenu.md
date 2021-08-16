# @ContextMenu

create discord context menu options with ease!

Here are some example screenshots:

![](../../../static/img/user-context.jpg)
![](../../../static/img/message-context.jpg)

# Example

```ts
@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "message context")
  async messageHandler(interaction: Interaction) {
    console.log("I am message");
  }

  @ContextMenu("USER", "user context")
  async userHandler(interaction: Interaction) {
    console.log("I am user");
  }
}
```

## Signature

```ts
ContextMenu(
  type: "USER" | "MESSAGE",
  name?: string,
  params?: ApplicationCommandParams
)
```

## Parameters

### type

`USER | MESSAGE`

Context menu type.

### name

`string`

Name of context menu. Name and handler have the same value currently.

### ApplicationCommandParams

`object`

Multiple options, check below.

#### botIds

`string[]`

Array of bot ids, for which only the event will be executed.

#### defaultPermission

`boolean` `default: true`

"You can also set a default_permission on your commands if you want them to be disabled by default when your app is added to a new guild. Setting default_permission to false will disallow anyone in a guild from using the command--even Administrators and guild owners--unless a specific overwrite is configured. It will also disable the command from being usable in DMs."

#### Description

`string`
The Slash command description

#### Guilds

`string[]`
The guilds where the command is created
