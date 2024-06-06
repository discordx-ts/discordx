/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { Discord, SelectMenuComponent, Slash } from "discordx";

const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
export class Example {
  @SelectMenuComponent({ id: "role-menu" })
  async handle(interaction: StringSelectMenuInteraction): Promise<unknown> {
    await interaction.deferReply();

    // extract selected value by member
    const roleValue = interaction.values?.[0];

    // if value not found
    if (!roleValue) {
      return interaction.followUp("invalid role id, select again");
    }

    await interaction.followUp(
      `you have selected role: ${
        roles.find((r) => r.value === roleValue)?.label ?? "unknown"
      }`,
    );
    return;
  }

  @Slash({ description: "roles menu", name: "my-roles" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new StringSelectMenuBuilder()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu,
      );

    // send it
    await interaction.editReply({
      components: [buttonRow],
      content: "select your role!",
    });
    return;
  }
}
