import type { ContextMenuCommandInteraction } from "discord.js";
import { ApplicationCommandType } from "discord.js";
import type { GuardFunction } from "discordx";
import { ContextMenu, Discord, Guard } from "discordx";

export const InteractionGuard: GuardFunction<
  ContextMenuCommandInteraction
> = async (interaction, client, next) => {
  await next();
};

@Discord()
export class Example {
  @ContextMenu({ name: "Check details", type: ApplicationCommandType.User })
  @Guard(InteractionGuard)
  userHandler(interaction: ContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
