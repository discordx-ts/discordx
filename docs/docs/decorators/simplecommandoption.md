# @SimpleCommandOption

A simple command can have multiple options (parameters)

## Declare an option

To declare an option you simply use the `@SimpleCommandOption` decorator before a method parameter

```ts
  @SimpleCommand("hello")
  async testCommand(
    @SimpleCommandOption() name: string,

    message: CommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    message.reply(`hello ${name}`);
  }
```

## Signature

```ts
function SimpleCommandOption(name?: string): ParameterDecoratorEx;
function SimpleCommandOption(
  name: string,
  params?: { description?: string; type?: "string" | "number" | "boolean" }
): ParameterDecoratorEx;
```

## Params

`SimpleCommandOption( name: string, params?: { description?: string; type?: "string" | "number" | "boolean" } ): ParameterDecoratorEx;`

### name

`string`
The name of your command option

### description

`string`
The description of command option

### type

`string | number | boolean`
The type of your command option
