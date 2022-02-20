# @SelectMenuComponent

add select menu interaction handler for your bot using `@SelectMenuComponent` decorator

Here are some example screenshots:

![](../../../static/img/select-menu-example.jpg)

## Example

```ts
const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
class buttons {
  @SelectMenuComponent("role-menu")
  async handle(interaction: SelectMenuInteraction) {
    await interaction.deferReply();

    // extract selected value by member
    const roleValue = interaction.values?.[0];

    // if value not found
    if (!roleValue)
      return await interaction.followUp("invalid role id, select again");
    await interaction.followUp(
      `you have selected role: ${
        roles.find((r) => r.value === roleValue).label
      }`
    );
    return;
  }

  @Slash("my-roles", { description: "roles menu" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new MessageSelectMenu()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow = new MessageActionRow().addComponents(menu);

    // send it
    interaction.editReply({
      content: "select your role!",
      components: [buttonRow],
    });
    return;
  }
}
```

## Signature

```ts
@SelectMenuComponent(custom_id: string, options?: { guilds?: Snowflake[]; botIds?: string[] )
```

## Parameters

### custom_id

A unique id for your button interaction to be handled under.

| type   | default       | required |
| ------ | ------------- | -------- |
| string | function name | No       |

:::caution
As per discord latest announcement, `custom_ids` being unique within a message. [read here more](https://discord.com/developers/docs/interactions/message-components#custom-id)
:::

### options

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### `botIds`

Array of bot ids, for which only the event will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

#### `Guilds`

The guilds where the command is created

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |
