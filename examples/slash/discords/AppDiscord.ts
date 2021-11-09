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
  DefaultPermissionResolver,
  Discord,
  Permission,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../../../src";

enum TextChoices {
  "Good Bye" = "GoodBye",
  Hello = "Hello",
}

@Discord()
@SlashGroup("testing", "Testing group description", {
  maths: "maths group description",
  text: "text group description",
})
export abstract class AppDiscord {
  @Slash("voicechannel")
  @SlashGroup("maths")
  voicechannel(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
      type: "CHANNEL",
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("voicechannelx")
  voicechannelx(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
      type: "CHANNEL",
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

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
  @Permission(
    new DefaultPermissionResolver((command) => {
      if (!command) {
        return false;
      }
      return false;
    })
  )
  @Permission({
    id: "462341082919731200",
    permission: true,
    type: "USER",
  })
  voicechannel(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
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
