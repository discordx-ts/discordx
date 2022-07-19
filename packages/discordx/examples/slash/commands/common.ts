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

import {
  ButtonComponent,
  Discord,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export class Example {
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
      autocomplete: function (
        this: Example,
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

  @Slash("test-btn")
  testBtn(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder();
    btn.setLabel("Test");
    btn.setStyle(ButtonStyle.Primary);
    btn.setCustomId("myTest");

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    row.addComponents([btn]);

    interaction.reply({ components: [row], content: "test" });
  }

  @ButtonComponent(/myTest/)
  btnHandler(interaction: ButtonInteraction): void {
    interaction.reply("I am called");
  }
}
