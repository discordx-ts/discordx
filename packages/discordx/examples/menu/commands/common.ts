import {
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import {
  Discord,
  SelectMenuComponent,
  Slash,
} from "../../../src/index.js";

const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
export abstract class buttons {
  @SelectMenuComponent("role-menu")
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

  @Slash("myroles", { description: "roles menu" })
  async myroles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roels
    const menu = new MessageSelectMenu()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for meessage actions
    const buttonRow = new MessageActionRow().addComponents(menu);

    // send it
    interaction.editReply({
      components: [buttonRow],
      content: "select your role!",
    });
    return;
  }
}
