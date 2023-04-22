import type { CommandInteraction } from "discord.js";
import { GuildMember } from "discord.js";

import { Discord, Slash } from "../../../discordx/src/index.js";
import { Queue } from "../../src/v2/index.js";
import { Main } from "../main.js";

@Discord()
export class music {
  queue: Queue;

  constructor() {
    this.queue = new Queue(Main.Client);
  }

  @Slash({ description: "Play a song", name: "play-v2" })
  async play(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    this.queue.join({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.member.voice.channel.guildId,
    });

    this.queue.play({
      guildId: interaction.member.voice.channel.guildId,
      payload: {
        query: "https://www.youtube.com/watch?v=hp_-RlwNg04",
      },
    });

    interaction.followUp("The requested song is being played");
  }
}
