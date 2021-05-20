# @Group
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

![](https://discord.com/assets/4cfea1bfc6d3ed0396c16cd47e0a7154.png)

## Create a Group
We use @Group at two level, on the class and on methods

### Group on class level
When @Group decorate a class it groups all the Slash commands in the class
```
maths
|
|__ add
|
|__ multiply
```

```ts
@Discord()
@Group(
  "maths",
  "maths group description",
)
export abstract class AppDiscord {
  @Slash("add")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  multiply(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
  }
}
```
![](/discord.ts/group1.png)

### Group on method level
When @Group decorate a method it creates sub-groups inside the class group

**You have to list the groups that are in the class in the @Group parameters that decorate the class, or they will not appear**
```ts
@Group(
  "testing",
  "Testing group description",
  {
    maths: "maths group description", // Specify the groups that are in the class with th description
    text: "text group description"    // Specify the groups that are in the class with th description
  }
)
```

```
testing
|
|__ maths
    |
    |__ add
    |
    |__ multiply
|
|__ text
    |
    |__ hello
|
|__ root
```
```ts
@Discord()
@Group(
  "testing",
  "Testing group description",
  {
    maths: "maths group description",
    text: "text group description"
  }
)
export abstract class AppDiscord {
  @Slash("add")
  @Group("maths")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @Group("maths")
  multiply(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @Group("text")
  hello(
    @Option("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }

  @Slash("root")
  root(interaction: CommandInteraction) {
    interaction.reply("root");
  }
}
```

![](/discord.ts/group2.png)

