import type {
  AutocompleteInteraction,
  ButtonInteraction,
  Channel,
  CommandInteraction,
  GuildMember,
  Role,
  User,
} from "discord.js";
import {
  ActionRow,
  ApplicationCommandOptionType,
  ButtonComponent,
  ButtonStyle,
} from "discord.js";

import { Button, Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  myCustomText = "This resolver has class inbound";

  @Slash("hello")
  hello(
    @SlashOption("user", { type: ApplicationCommandOptionType.User })
    user: GuildMember | User,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${user}`);
  }

  @Slash("role")
  role(
    @SlashOption("role", { type: ApplicationCommandOptionType.Role })
    role: Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${role}`);
  }

  @Slash("channel")
  channel(
    @SlashOption("channel", { type: ApplicationCommandOptionType.Channel })
    channel: Channel,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${channel}`);
  }

  @Slash("role-or-user")
  roleOrUser(
    @SlashOption("mention", { type: ApplicationCommandOptionType.Mentionable })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("autocomplete")
  autocomplete(
    @SlashOption("option-a", {
      autocomplete: true,
      type: ApplicationCommandOptionType.String,
    })
    searchText: string,
    @SlashOption("option-b", {
      autocomplete: function myResolver(
        this: AppDiscord,
        interaction: AutocompleteInteraction
      ) {
        // normal function, have this, so class reference is passed
        console.log(this.myCustomText);
        // resolver for option b
        interaction.respond([
          { name: "option c", value: "d" },
          { name: "option d", value: "c" },
        ]);
      },
      type: ApplicationCommandOptionType.String,
    })
    searchText2: string,
    @SlashOption("option-c", {
      autocomplete: (interaction: AutocompleteInteraction) => {
        // arrow function does not have this, so class reference is not available
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      type: ApplicationCommandOptionType.String,
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction
  ): void {
    if (interaction.isAutocomplete()) {
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

  @Slash()
  testBtn(interaction: CommandInteraction): void {
    const btn = new ButtonComponent();
    btn.setLabel("Test");
    btn.setStyle(ButtonStyle.Primary);
    btn.setCustomId("myTest");

    const row = new ActionRow();
    row.addComponents(btn);

    interaction.reply({ components: [row], content: "test" });
  }

  @Button(/mytest/)
  btnHandler(interaction: ButtonInteraction): void {
    interaction.reply("I am called");
  }
}
