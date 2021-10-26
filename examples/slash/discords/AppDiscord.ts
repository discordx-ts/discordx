import {
  AutocompleteInteraction,
  Channel,
  CommandInteraction,
  GuildMember,
  Role,
  User,
} from "discord.js";
import {
  Discord,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../../../src";
import { ChannelTypes } from "discord.js/typings/enums";

enum TextChoices {
  Hello = "Hello",
  "Good Bye" = "GoodBye",
}

@Discord()
@SlashGroup("testing", "Testing group description", {
  maths: "maths group description",
  text: "text group description",
})
export abstract class AppDiscord {
  @Slash("add")
  @SlashGroup("maths")
  add(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @SlashGroup("maths")
  multiply(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @SlashGroup("text")
  hello(
    @SlashChoice(TextChoices)
    @SlashOption("text")
    text: TextChoices,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }

  @Slash("hello")
  root(
    @SlashOption("text") text: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }
}

@Discord()
export abstract class AppDiscord1 {
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

  @Slash("voicechannel")
  voicechannel(
    @SlashOption("channel", {
      channelTypes: [ChannelTypes.GUILD_VOICE],
      type: "CHANNEL",
    })
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
        this: AppDiscord1,
        interaction: AutocompleteInteraction
      ) {
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
        // resolver for option b
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
}
