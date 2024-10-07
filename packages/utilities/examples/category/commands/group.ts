/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ICategory } from "@discordx/utilities";
import { Category } from "@discordx/utilities";
import type { CommandInteraction } from "discord.js";
import type { DApplicationCommand } from "discordx";
import { Discord, MetadataStorage, Slash, SlashGroup } from "discordx";

@Discord()
@Category("Admin Commands")
@SlashGroup({ description: "my-group", name: "my-group" })
@SlashGroup("my-group")
export class SlashExample {
  @Slash({ description: "subgroup" })
  async subgroup(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    MetadataStorage.instance.applicationCommandSlashesFlat.forEach(
      (cmd: DApplicationCommand & ICategory) => {
        void interaction.followUp(
          `Name: \`${cmd.name}\`, Category: \`${cmd.category}\``,
        );
      },
    );
  }
}
