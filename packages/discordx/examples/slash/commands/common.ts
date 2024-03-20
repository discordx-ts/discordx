/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  AutocompleteInteraction,
  ButtonInteraction,
  Channel,
  CommandInteraction,
  GuildMember,
  MessageActionRowComponentBuilder,
  Role,
  User,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";

@Discord()
export class Example {
  myCustomText = "This resolver has class inbound";

  @Slash({ description: "hello", name: "hello" })
  hello(
    @SlashOption({
      description: "user",
      name: "user",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember | User,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${user}`);
  }

  @Slash({ description: "role", name: "role" })
  role(
    @SlashOption({
      description: "role",
      name: "role",
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${role}`);
  }

  @Slash({ description: "channel", name: "channel" })
  channel(
    @SlashOption({
      description: "channel",
      name: "channel",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: Channel,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${channel}`);
  }

  @Slash({ description: "role-or-user", name: "role-or-user" })
  roleOrUser(
    @SlashOption({
      description: "mention",
      name: "mention",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash({ description: "autocomplete", name: "autocomplete" })
  autocomplete(
    @SlashOption({
      autocomplete: true,
      description: "option-a",
      name: "option-a",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    searchText: string,
    @SlashOption({
      autocomplete: function (
        this: Example,
        interaction: AutocompleteInteraction,
      ) {
        // normal function, have this, so class reference is passed
        console.log(this.myCustomText);
        // resolver for option b
        interaction.respond([
          { name: "option c", value: "d" },
          { name: "option d", value: "c" },
        ]);
      },
      description: "option-b",
      name: "option-b",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    searchText2: string,
    @SlashOption({
      autocomplete: (interaction: AutocompleteInteraction) => {
        // arrow function does not have this, so class reference is not available
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      description: "option-c",
      name: "option-c",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction,
  ): void {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const focusedOption = interaction.options.getFocused(true);

      // resolver for option a
      if (focusedOption.name === "option-a") {
        interaction.respond([
          { name: "option a", value: "a" },
          { name: "option b", value: "b" },
        ]);
      }
    } else {
      interaction.reply(`${searchText}-${searchText2}-${searchText3}`);
    }
  }

  @Slash({ description: "test-btn", name: "test-btn" })
  testBtn(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder();
    btn.setLabel("Test");
    btn.setStyle(ButtonStyle.Primary);
    btn.setCustomId("myTest");

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row.addComponents([btn]);

    interaction.reply({ components: [row], content: "test" });
  }

  @ButtonComponent({ id: /myTest/ })
  btnHandler(interaction: ButtonInteraction): void {
    interaction.reply("I am called");
  }
}
