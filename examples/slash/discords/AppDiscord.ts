import {
  AutocompleteInteraction,
  ButtonInteraction,
  Channel,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  Role,
  User,
} from "discord.js";
import {
  ButtonComponent,
  Discord,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  myCustomText = "This resovler has class inbound";

  @Slash("hello")
  hello(
    @SlashOption("user", { type: "USER" }) user: GuildMember | User,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${user}`);
  }

  @Slash("role")
  role(@SlashOption("role") role: Role, interaction: CommandInteraction): void {
    interaction.reply(`${role}`);
  }

  @Slash("channel")
  channel(
    @SlashOption("channel") channel: Channel,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${channel}`);
  }

  @Slash("roleoruser")
  roleorUser(
    @SlashOption("roleoruser", { type: "MENTIONABLE" })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("autocomplete")
  testx(
    @SlashOption("aoption", {
      autocomplete: true,
      required: true,
      type: "STRING",
    })
    searchText: string,
    @SlashOption("boption", {
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
      required: true,
      type: "STRING",
    })
    searchText2: string,
    @SlashOption("coption", {
      autocomplete: (interaction: AutocompleteInteraction) => {
        // arrow function does not have this, so class reference is not available
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      required: true,
      type: "STRING",
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction
  ): void {
    if (interaction.isAutocomplete()) {
      const focusedOption = interaction.options.getFocused(true);

      // resolver for option a
      if (focusedOption.name === "aoption") {
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
  testbtn(interaction: CommandInteraction): void {
    const btn = new MessageButton();
    btn.setLabel("Test");
    btn.setStyle("PRIMARY");
    btn.setCustomId("mytest");

    const row = new MessageActionRow();
    row.addComponents([btn]);

    interaction.reply({ components: [row], content: "test" });
  }

  @ButtonComponent(/mytest/)
  btnHandler(interaction: ButtonInteraction): void {
    interaction.reply("I am called");
  }
}
