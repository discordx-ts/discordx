# @SlashGroup

You can group your command like this

```
command
|
|__ subcommand
|
|__ subcommand

```

```
command
|
|__ subcommand-group
    |
    |__ subcommand
|
|__ subcommand-group
    |
    |__ subcommand
```

## Example

Here you create a Slash command group that groups "permissions" commands

The permissions commands also grouped by "user" or "role"

![](../../../static/img/permissions.png)

## Create a group

We use @SlashGroup at two level, on the class and on methods

### group on class level

When @SlashGroup decorate a class it groups all the Slash commands in the class

```
maths
|
|__ add
|
|__ multiply
```

```ts
@Discord()
@SlashGroup({ description: "maths group description", name: "maths" })
export abstract class AppDiscord {
  @Slash("add")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  multiply(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
  }
}
```

![](../../../static/img/group1.png)

### SlashGroup on method level

When @SlashGroup decorate a method it creates sub-groups inside the class group

**You have to list the groups that are in the class in the @SlashGroup parameters that decorate the class, or they will not appear**

```ts
@SlashGroup({ name: "testing" })
@SlashGroup({ name: "maths", root: "testing" })
@SlashGroup({ name: "text", root: "testing" })
```

```
testing
|
|__ maths
    |
    |__ add
    |
    |__ multiply
```

```ts
@Discord()
@SlashGroup({ name: "testing" })
@SlashGroup({ name: "maths", root: "testing" })
export abstract class Group {
  @Slash("add")
  @SlashGroup({ name: "maths", root: "testing" })
  add(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @SlashGroup({ name: "maths", root: "testing" })
  multiply(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }
}
```

![](../../../static/img/group2.png)

## Signature

```ts
SlashGroup(info: SlashGroupParams): ClassMethodDecorator
```

## SlashGroupParams Parameters

### name

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

### description

| type   | default   | required |
| ------ | --------- | -------- |
| string | undefined | No       |

### root

| type   | default   | required |
| ------ | --------- | -------- |
| string | undefined | No       |
