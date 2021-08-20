# @DefaultPermission

The default permission used to set permission for everyone in your slash or simple command.

## Examples

[check here](/docs/decorators/general/permission)

## Signature

```ts
@DefaultPermission(true | false)
```

## Parameters

### permission

`boolean` `default: true`

When true, the command can be used by anyone except those who have been denied by the @Permission decorator, vice versa.

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@Discord](/docs/decorators/general/discord)

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
