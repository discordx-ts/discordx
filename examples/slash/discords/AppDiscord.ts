import {
  Channel,
  CommandInteraction,
  GuildMember,
  Role,
  User,
} from "discord.js";
import {
  DefaultPermissionResolver,
  Discord,
  Permission,
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
      return true;
    })
  )
  @Permission({
    id: "462341082919731200",
    permission: true,
    type: "USER",
  })
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
}
