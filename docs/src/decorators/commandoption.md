# @CommandOption

A simple command can have multiple options (parameters)

## Declare an option

To declare an option you simply use the `@CommandOption` decorator before a method parameter

```ts
  @Command("hello")
  async testCommand(
    @CommandOption() name: string,

    message: CommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    message.reply(`hello ${name}`);
  }
```

## Signature

```ts
function CommandOption(name?: string): ParameterDecoratorEx;
function CommandOption(
  name: string,
  params?: { description?: string; type?: "string" | "number" | "boolean" }
): ParameterDecoratorEx;
```

## Params

`CommandOption( name: string, params?: { description?: string; type?: "string" | "number" | "boolean" } ): ParameterDecoratorEx;`

### name

`string`
The name of your command option

### description

`string`
The description of command option

### type

`string | number | boolean`
The type of your command option
