import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
  SelectMenuInteraction,
} from "discord.js";
import {
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "discord.js";

import { Discord, SelectMenuComponent, Slash } from "../../../src/index.js";

const roles = [
  new SelectMenuOptionBuilder({ label: "Principal", value: "principal" }),
  new SelectMenuOptionBuilder({ label: "Teacher", value: "teacher" }),
  new SelectMenuOptionBuilder({ label: "Student", value: "student" }),
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
        roles.find((r) => r.data.value === roleValue)?.data.label ?? "unknown"
      }`
    );
    return;
  }

  @Slash("my-roles", { description: "roles menu" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new SelectMenuBuilder()
      .addOptions(...roles)
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
