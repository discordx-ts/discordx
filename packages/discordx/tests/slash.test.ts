// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Channel,
  CommandInteraction,
  GuildMember,
  Interaction,
  Role,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";

import {
  Client,
  Discord,
  Guard,
  Guild,
  Slash,
  SlashOption,
} from "../src/index.js";
import {
  FakeInteraction,
  FakeOption,
  InteractionType,
} from "./util/interaction.js";

type Data = { passed: boolean };

@Discord()
@Guild("invalid_id")
@Guard((params, client, next, data) => {
  data.passed = true;
  return next();
})
export class Example3 {
  @Slash()
  hello(
    @SlashOption({ name: "text", required: false })
    text: string,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/hello", text, interaction, data.passed];
  }

  @Slash()
  inference(
    @SlashOption({ name: "text" })
    text: string,

    @SlashOption({ name: "bool" })
    bool: boolean,

    @SlashOption({ name: "nb" })
    nb: number,

    @SlashOption({
      name: "channel",
      type: ApplicationCommandOptionType.Channel,
    })
    channel: Channel,

    @SlashOption({
      name: "text-channel",
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    textChannel: TextChannel,

    @SlashOption({
      name: "voice-channel",
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    voiceChannel: VoiceChannel,

    @SlashOption({ name: "user", required: false })
    clientUser: User,

    @SlashOption({ name: "role", required: false })
    role: Role,

    @SlashOption({
      name: "user-or-role",
      required: false,
      type: ApplicationCommandOptionType.Mentionable,
    })
    userOrRole: GuildMember | User | Role,

    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/inference", "infer", interaction, data.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Slash", () => {
  it("Should create the slash structure", async () => {
    expect(client.applicationCommands[0]?.guilds).toEqual(["invalid_id"]);

    const slashesObjects = await Promise.all(
      client.applicationCommands.map((slash) => slash.toJSON())
    );

    expect(slashesObjects).toEqual([
      {
        defaultMemberPermissions: null,
        description: "hello",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "hello",
        nameLocalizations: null,
        options: [
          {
            description: "text",
            descriptionLocalizations: null,
            name: "text",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "inference",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "inference",
        nameLocalizations: null,
        options: [
          {
            description: "text",
            descriptionLocalizations: null,
            name: "text",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.String,
          },
          {
            description: "bool",
            descriptionLocalizations: null,
            name: "bool",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            description: "nb",
            descriptionLocalizations: null,
            name: "nb",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Number,
          },
          {
            description: "channel",
            descriptionLocalizations: null,
            name: "channel",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "text-channel",
            descriptionLocalizations: null,
            name: "text-channel",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "voice-channel",
            descriptionLocalizations: null,
            name: "voice-channel",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "user",
            descriptionLocalizations: null,
            name: "user",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.User,
          },
          {
            description: "role",
            descriptionLocalizations: null,
            name: "role",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Role,
          },
          {
            description: "user-or-role",
            descriptionLocalizations: null,
            name: "user-or-role",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
    ]);
  });

  it("Should execute the simple slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "hello",
      options: [
        new FakeOption("text", ApplicationCommandOptionType.String, "hello"),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/hello", "hello", interaction, true]);
  });

  it("Should execute the with optional option", async () => {
    const interaction = new FakeInteraction({
      commandName: "hello",
      options: [],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/hello", undefined, interaction, true]);
  });

  it("Should not execute not found slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "not-found-test",
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(undefined);
  });
});
