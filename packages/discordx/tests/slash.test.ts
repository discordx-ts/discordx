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
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../src/index.js";
import { FakeInteraction, FakeOption, InteractionType } from "./interaction.js";

type Data = { passed: boolean };
enum TextChoices {
  "Good Bye" = "Good Bye",
  Hello = "Hello",
}

@Discord()
@Guild("693401527494377482")
@SlashGroup({
  description: "Testing group description",
  name: "testing",
})
@SlashGroup({
  description: "maths group description",
  name: "maths",
  root: "testing",
})
@SlashGroup({
  description: "text group description",
  name: "text",
  root: "testing",
})
@Guard((params, client, next, data) => {
  data.passed = true;
  return next();
})
export class Example {
  @Slash({ description: "Addition" })
  @SlashGroup("maths", "testing")
  add(
    @SlashOption({
      description: "x value",
      maxValue: 10,
      minValue: 1,
      name: "x",
      type: ApplicationCommandOptionType.Number,
    })
    x: number,
    @SlashOption({
      description: "y value",
      maxValue: 10,
      minValue: 1,
      name: "y",
      type: ApplicationCommandOptionType.Number,
    })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing maths add", x + y, interaction, data.passed];
  }

  @Slash({ description: "Multiply" })
  @SlashGroup("maths", "testing")
  multiply(
    @SlashOption({ description: "x value", name: "x" })
    x: number,
    @SlashOption({ description: "y value", name: "y" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing maths multiply", x * y, interaction, data.passed];
  }

  @Slash()
  @SlashGroup("text", "testing")
  hello(
    @SlashChoice(
      {
        name: TextChoices[TextChoices.Hello],
        value: TextChoices.Hello,
      },
      {
        name: TextChoices[TextChoices["Good Bye"]],
        value: TextChoices["Good Bye"],
      }
    )
    @SlashOption({ name: "text" })
    text: TextChoices,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing text hello", text, interaction, data.passed];
  }

  @Slash({ name: "hello" })
  @SlashGroup("testing")
  root(
    @SlashOption({ name: "text" })
    text: string,
    @SlashOption({ name: "text2", required: false })
    text2: string,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing hello text", text, text2, interaction, data.passed];
  }
}

@Discord()
@SlashGroup({
  name: "group-test-without-description",
})
@SlashGroup({
  description: "text group description",
  name: "line",
  root: "group-test-without-description",
})
@Guard((params, client, next, data) => {
  data.passed = true;
  return next();
})
export class Example2 {
  @Slash({ description: "Addition" })
  @SlashGroup("line", "group-test-without-description")
  add(
    @SlashOption({ description: "x value", name: "x" })
    x: number,
    @SlashOption({ description: "y value", name: "y" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing line add", x + y, interaction, data.passed];
  }
}

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

@Discord()
@SlashGroup({ name: "test-x" })
@SlashGroup("test-x")
export class AnotherGroup {
  @Slash()
  m(): unknown {
    return ["/test-x", "m", true];
  }

  @Slash()
  n(): unknown {
    return ["/test-x", "n", true];
  }
}

@Discord()
@SlashGroup({ name: "add", root: "test-x" })
@SlashGroup("add", "test-x")
export class Group {
  @Slash()
  x(): unknown {
    return ["/test-x", "add", "x", true];
  }

  @Slash()
  y(): unknown {
    return ["/test-x", "add", "y", true];
  }
}

@Discord()
@SlashGroup({ name: "test-y" })
@SlashGroup({ name: "add", root: "test-y" })
@SlashGroup("test-y")
export class DuplicateGroup {
  @Slash()
  o(): unknown {
    return ["/test-y", "o", true];
  }

  @Slash()
  p(): unknown {
    return ["/test-y", "p", true];
  }

  @Slash()
  @SlashGroup("add", "test-y")
  y(): unknown {
    return ["/test-y", "add", "y", true];
  }

  @Slash()
  @SlashGroup("add", "test-y")
  z(): unknown {
    return ["/test-y", "add", "z", true];
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
            description: "text - string",
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
            description: "text - string",
            descriptionLocalizations: null,
            name: "text",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.String,
          },
          {
            description: "bool - boolean",
            descriptionLocalizations: null,
            name: "bool",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            description: "nb - number",
            descriptionLocalizations: null,
            name: "nb",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Number,
          },
          {
            description: "channel - channel",
            descriptionLocalizations: null,
            name: "channel",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "text-channel - channel",
            descriptionLocalizations: null,
            name: "text-channel",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "voice-channel - channel",
            descriptionLocalizations: null,
            name: "voice-channel",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "user - user",
            descriptionLocalizations: null,
            name: "user",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.User,
          },
          {
            description: "role - role",
            descriptionLocalizations: null,
            name: "role",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Role,
          },
          {
            description: "user-or-role - mentionable",
            descriptionLocalizations: null,
            name: "user-or-role",
            nameLocalizations: null,
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "Testing group description",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "testing",
        nameLocalizations: null,
        options: [
          {
            description: "hello",
            descriptionLocalizations: null,
            name: "hello",
            nameLocalizations: null,
            options: [
              {
                description: "text - string",
                descriptionLocalizations: null,
                name: "text",
                nameLocalizations: null,
                required: true,
                type: ApplicationCommandOptionType.String,
              },
              {
                description: "text2 - string",
                descriptionLocalizations: null,
                name: "text2",
                nameLocalizations: null,
                required: false,
                type: ApplicationCommandOptionType.String,
              },
            ],
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            description: "maths group description",
            descriptionLocalizations: null,
            name: "maths",
            nameLocalizations: null,
            options: [
              {
                description: "Multiply",
                descriptionLocalizations: null,
                name: "multiply",
                nameLocalizations: null,
                options: [
                  {
                    description: "x value",
                    descriptionLocalizations: null,
                    name: "x",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    descriptionLocalizations: null,
                    name: "y",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                ],
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                description: "Addition",
                descriptionLocalizations: null,
                name: "add",
                nameLocalizations: null,
                options: [
                  {
                    description: "x value",
                    descriptionLocalizations: null,
                    maxValue: 10,
                    minValue: 1,
                    name: "x",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    descriptionLocalizations: null,
                    maxValue: 10,
                    minValue: 1,
                    name: "y",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                ],
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
          {
            description: "text group description",
            descriptionLocalizations: null,
            name: "text",
            nameLocalizations: null,
            options: [
              {
                description: "hello",
                descriptionLocalizations: null,
                name: "hello",
                nameLocalizations: null,
                options: [
                  {
                    choices: [
                      {
                        name: "Hello",
                        nameLocalizations: null,
                        value: "Hello",
                      },
                      {
                        name: "Good Bye",
                        nameLocalizations: null,
                        value: "Good Bye",
                      },
                    ],
                    description: "text - string",
                    descriptionLocalizations: null,
                    name: "text",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.String,
                  },
                ],
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "group-test-without-description",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "group-test-without-description",
        nameLocalizations: null,
        options: [
          {
            description: "text group description",
            descriptionLocalizations: null,
            name: "line",
            nameLocalizations: null,
            options: [
              {
                description: "Addition",
                descriptionLocalizations: null,
                name: "add",
                nameLocalizations: null,
                options: [
                  {
                    description: "x value",
                    descriptionLocalizations: null,
                    name: "x",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    descriptionLocalizations: null,
                    name: "y",
                    nameLocalizations: null,
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                ],
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "test-x",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "test-x",
        nameLocalizations: null,
        options: [
          {
            description: "add - subcommandgroup",
            descriptionLocalizations: null,
            name: "add",
            nameLocalizations: null,
            options: [
              {
                description: "y",
                descriptionLocalizations: null,
                name: "y",
                nameLocalizations: null,
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                description: "x",
                descriptionLocalizations: null,
                name: "x",
                nameLocalizations: null,
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
          {
            description: "m",
            descriptionLocalizations: null,
            name: "m",
            nameLocalizations: null,
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            description: "n",
            descriptionLocalizations: null,
            name: "n",
            nameLocalizations: null,
            type: ApplicationCommandOptionType.Subcommand,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "test-y",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "test-y",
        nameLocalizations: null,
        options: [
          {
            description: "add - subcommandgroup",
            descriptionLocalizations: null,
            name: "add",
            nameLocalizations: null,
            options: [
              {
                description: "y",
                descriptionLocalizations: null,
                name: "y",
                nameLocalizations: null,
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                description: "z",
                descriptionLocalizations: null,
                name: "z",
                nameLocalizations: null,
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
          {
            description: "o",
            descriptionLocalizations: null,
            name: "o",
            nameLocalizations: null,
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            description: "p",
            descriptionLocalizations: null,
            name: "p",
            nameLocalizations: null,
            type: ApplicationCommandOptionType.Subcommand,
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

  it("Should execute the simple grouped text slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "testing",
      options: [
        new FakeOption(
          "hello",
          ApplicationCommandOptionType.Subcommand,
          "text",
          [
            new FakeOption(
              "text",
              ApplicationCommandOptionType.String,
              "testing hello text"
            ),
            new FakeOption(
              "text2",
              ApplicationCommandOptionType.String,
              "testing hello text2"
            ),
          ]
        ),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual([
      "/testing hello text",
      "testing hello text",
      "testing hello text2",
      interaction,
      true,
    ]);
  });

  it("Should execute the simple subgrouped text slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "testing",
      options: [
        new FakeOption(
          "text",
          ApplicationCommandOptionType.SubcommandGroup,
          "text",
          [
            new FakeOption(
              "hello",
              ApplicationCommandOptionType.Subcommand,
              "text",
              [
                new FakeOption(
                  "text",
                  ApplicationCommandOptionType.String,
                  "testing text hello"
                ),
              ]
            ),
          ]
        ),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual([
      "/testing text hello",
      "testing text hello",
      interaction,
      true,
    ]);
  });

  it("Should execute the simple subgrouped multiply slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "testing",
      options: [
        new FakeOption(
          "maths",
          ApplicationCommandOptionType.SubcommandGroup,
          "text",
          [
            new FakeOption(
              "multiply",
              ApplicationCommandOptionType.Subcommand,
              "text",
              [
                new FakeOption("x", ApplicationCommandOptionType.Number, 2),
                new FakeOption("y", ApplicationCommandOptionType.Number, 5),
              ]
            ),
          ]
        ),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/testing maths multiply", 10, interaction, true]);
  });

  it("Should execute the simple subgrouped addition slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "testing",
      options: [
        new FakeOption(
          "maths",
          ApplicationCommandOptionType.SubcommandGroup,
          "text",
          [
            new FakeOption(
              "add",
              ApplicationCommandOptionType.Subcommand,
              "text",
              [
                new FakeOption("x", ApplicationCommandOptionType.Number, 2),
                new FakeOption("y", ApplicationCommandOptionType.Number, 5),
              ]
            ),
          ]
        ),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/testing maths add", 7, interaction, true]);
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
      commandName: "testing",
      options: [
        new FakeOption(
          "maths",
          ApplicationCommandOptionType.SubcommandGroup,
          "text",
          [
            new FakeOption(
              "notfound",
              ApplicationCommandOptionType.Subcommand,
              "text",
              [
                new FakeOption("x", ApplicationCommandOptionType.Number, 2),
                new FakeOption("y", ApplicationCommandOptionType.Number, 5),
              ]
            ),
          ]
        ),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(undefined);
  });
});
