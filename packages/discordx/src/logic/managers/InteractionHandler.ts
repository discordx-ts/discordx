/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { DIService } from "@discordx/di";
import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  ContextMenuCommandInteraction,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionType,
} from "discord.js";

import type { Client, DComponent } from "../../index.js";

export class InteractionHandler {
  constructor(private client: Client) {}

  executeInteraction(interaction: Interaction): Awaited<unknown> {
    if (interaction.isPrimaryEntryPointCommand()) {
      return null;
    }

    if (interaction.isButton()) {
      return this.executeComponent(this.client.buttonComponents, interaction);
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      return this.executeComponent(this.client.modalComponents, interaction);
    }

    if (interaction.isAnySelectMenu()) {
      return this.executeComponent(
        this.client.selectMenuComponents,
        interaction,
      );
    }

    if (interaction.isContextMenuCommand()) {
      return this.executeContextMenu(interaction);
    }

    return this.executeCommandInteraction(interaction);
  }

  async executeCommandInteraction(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction,
  ): Promise<unknown> {
    const tree = this.getApplicationCommandGroupTree(interaction);
    const applicationCommand = this.getApplicationCommandFromTree(tree);

    if (!applicationCommand?.isBotAllowed(this.client.botId)) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> interaction not found, commandName: ${interaction.commandName}`,
        );
      }
      return null;
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const focusOption = interaction.options.getFocused(true);
      const option = applicationCommand.options.find(
        (op) => op.name === focusOption.name,
      );

      if (option && typeof option.autocomplete === "function") {
        await option.autocomplete.call(
          DIService.engine.getService(option.from),
          interaction,
          applicationCommand,
        );
        return null;
      }
    }

    return applicationCommand.execute(
      this.client.guards,
      interaction,
      this.client,
    );
  }

  async executeComponent(
    components: readonly DComponent[],
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | AnySelectMenuInteraction,
  ): Promise<unknown> {
    const executes = components.filter((component) => {
      return (
        component.isId(interaction.customId) &&
        component.isBotAllowed(this.client.botId)
      );
    });

    if (!executes.length) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> ${
            interaction.isButton()
              ? "button"
              : interaction.isAnySelectMenu()
                ? "select menu"
                : "modal"
          } component handler not found, interactionId: ${
            interaction.id
          } | customId: ${interaction.customId}`,
        );
      }

      return null;
    }

    const results = await Promise.all(
      executes.map(async (component) => {
        if (
          !(await component.isGuildAllowed(this.client, interaction.guildId))
        ) {
          return null;
        }

        return component.execute(this.client.guards, interaction, this.client);
      }),
    );

    return results;
  }

  executeContextMenu(
    interaction: ContextMenuCommandInteraction,
  ): Awaited<unknown> {
    const applicationCommand = interaction.isUserContextMenuCommand()
      ? this.client.applicationCommandUsers.find(
          (cmd) => cmd.name === interaction.commandName,
        )
      : this.client.applicationCommandMessages.find(
          (cmd) => cmd.name === interaction.commandName,
        );

    if (!applicationCommand?.isBotAllowed(this.client.botId)) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> context interaction not found, name: ${interaction.commandName}`,
        );
      }
      return null;
    }

    return applicationCommand.execute(
      this.client.guards,
      interaction,
      this.client,
    );
  }

  private getApplicationCommandGroupTree(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction,
  ): string[] {
    const tree: string[] = [];

    const getOptionsTree = (
      option: Partial<CommandInteractionOption> | undefined,
    ): void => {
      if (!option) {
        return;
      }

      if (
        !option.type ||
        option.type === ApplicationCommandOptionType.SubcommandGroup ||
        option.type === ApplicationCommandOptionType.Subcommand
      ) {
        if (option.name) {
          tree.push(option.name);
        }

        getOptionsTree(Array.from(option.options?.values() ?? [])[0]);
      }
    };

    getOptionsTree({
      name: interaction.commandName,
      options: Array.from(interaction.options.data.values()),
      type: undefined,
    });

    return tree;
  }

  private getApplicationCommandFromTree(tree: string[]) {
    return this.client.applicationCommandSlashesFlat.find((slash) => {
      switch (tree.length) {
        case 1:
          return (
            slash.group === undefined &&
            slash.subgroup === undefined &&
            slash.name === tree[0] &&
            slash.type === ApplicationCommandType.ChatInput
          );

        case 2:
          return (
            slash.group === tree[0] &&
            slash.subgroup === undefined &&
            slash.name === tree[1] &&
            slash.type === ApplicationCommandType.ChatInput
          );

        case 3:
          return (
            slash.group === tree[0] &&
            slash.subgroup === tree[1] &&
            slash.name === tree[2] &&
            slash.type === ApplicationCommandType.ChatInput
          );

        default:
          return false;
      }
    });
  }
}
