import type { CommandInteraction } from "discord.js";
import type { DApplicationCommand } from "discordx";
import { Discord, MetadataStorage, Slash, SlashGroup } from "discordx";

import type { ICategory } from "../../../src/index.js";
import { Category } from "../../../src/index.js";

@Discord()
@Category("Admin Commands")
@SlashGroup({ name: "my-group" })
@SlashGroup("my-group")
export class SlashExample {
  @Slash()
  async subgroup(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    MetadataStorage.instance.applicationCommandSlashesFlat.forEach(
      (cmd: DApplicationCommand & ICategory) => {
        interaction.followUp(
          `Name: \`${cmd.name}\`, Category: \`${cmd.category}\``
        );
      }
    );
  }
}
