# @SelectMenuComponent

add select menu interaction handler for your bot using `@SelectMenuComponent` decorator

Here are some example screenshots:

![](../../../../../../static/img/select-menu-example.jpg)

## Example

```ts
const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
class Example {
  @SelectMenuComponent({ id: "role-menu" })
  async handle(interaction: SelectMenuInteraction): Promise<unknown> {
    await interaction.deferReply();

    // extract selected value by member
    const roleValue = interaction.values?.[0];

    // if value not found
    if (!roleValue) {
      return interaction.followUp("invalid role id, select again");
    }

    interaction.followUp(
      `you have selected role: ${
        roles.find((r) => r.value === roleValue)?.label ?? "unknown"
      }`
    );
    return;
  }

  @Slash({ description: "roles menu", name: "my-roles" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new SelectMenuBuilder()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu
      );

    // send it
    interaction.editReply({
      components: [buttonRow],
      content: "select your role!",
    });
    return;
  }
}
```

## Signature

```ts
@SelectMenuComponent(options: ComponentOptions)
```

### options

The button options

| type             | default   | required |
| ---------------- | --------- | -------- |
| ComponentOptions | undefined | NO       |

## Type: ComponentOptions

### botIds

Array of bot ids, for which only the event will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### Guilds

The guilds where the command is created

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### id

A unique id for your button interaction to be handled under.

| type             | default       | required |
| ---------------- | ------------- | -------- |
| string \| RegExp | function name | No       |
