import type { CommandInteraction, SelectMenuInteraction } from "discord.js";
import { ActionRow, SelectMenuComponent, SelectMenuOption } from "discord.js";

import { Discord, SelectMenu, Slash } from "../../../src/index.js";

const roles = [
  new SelectMenuOption({ label: "Principal", value: "principal" }),
  new SelectMenuOption({ label: "Teacher", value: "teacher" }),
  new SelectMenuOption({ label: "Student", value: "student" }),
];

@Discord()
export abstract class buttons {
  @SelectMenu("role-menu")
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

  @Slash("my-roles", { description: "roles menu" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new SelectMenuComponent()
      .addOptions(...roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow = new ActionRow().addComponents(menu);

    // send it
    interaction.editReply({
      components: [buttonRow],
      content: "select your role!",
    });
    return;
  }
}
