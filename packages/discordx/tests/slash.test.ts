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
  @Slash("add", { description: "Addition" })
  @SlashGroup("maths", "testing")
  add(
    @SlashOption("x", {
      description: "x value",
      maxValue: 10,
      minValue: 1,
      type: ApplicationCommandOptionType.Number,
    })
    x: number,
    @SlashOption("y", {
      description: "y value",
      maxValue: 10,
      minValue: 1,
      type: ApplicationCommandOptionType.Number,
    })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing maths add", x + y, interaction, data.passed];
  }

  @Slash("multiply", { description: "Multiply" })
  @SlashGroup("maths", "testing")
  multiply(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing maths multiply", x * y, interaction, data.passed];
  }

  @Slash("hello")
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
    @SlashOption("text")
    text: TextChoices,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/testing text hello", text, interaction, data.passed];
  }

  @Slash("hello")
  @SlashGroup("testing")
  root(
    @SlashOption("text")
    text: string,
    @SlashOption("text2", { required: false })
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
  @Slash("add", { description: "Addition" })
  @SlashGroup("line", "group-test-without-description")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
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
  @Slash("hello")
  add(
    @SlashOption("text", { required: false })
    text: string,
    interaction: CommandInteraction,
    client: Client,
    data: Data
  ): unknown {
    return ["/hello", text, interaction, data.passed];
  }

  @Slash("inference")
  inference(
    @SlashOption("text")
    text: string,

    @SlashOption("bool")
    bool: boolean,

    @SlashOption("nb")
    nb: number,

    @SlashOption("channel", { type: ApplicationCommandOptionType.Channel })
    channel: Channel,

    @SlashOption("text-channel", {
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    textChannel: TextChannel,

    @SlashOption("voice-channel", {
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    voiceChannel: VoiceChannel,

    @SlashOption("user", { required: false })
    clientUser: User,

    @SlashOption("role", { required: false })
    role: Role,

    @SlashOption("user-or-role", {
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
        description: "hello",
        dmPermission: true,
        name: "hello",
        options: [
          {
            description: "text - string",
            name: "text",
            required: false,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        description: "inference",
        dmPermission: true,
        name: "inference",
        options: [
          {
            description: "text - string",
            name: "text",
            required: true,
            type: ApplicationCommandOptionType.String,
          },
          {
            description: "bool - boolean",
            name: "bool",
            required: true,
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            description: "nb - number",
            name: "nb",
            required: true,
            type: ApplicationCommandOptionType.Number,
          },
          {
            description: "channel - channel",
            name: "channel",
            required: true,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "text-channel - channel",
            name: "text-channel",
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "voice-channel - channel",
            name: "voice-channel",
            required: false,
            type: ApplicationCommandOptionType.Channel,
          },
          {
            description: "user - user",
            name: "user",
            required: false,
            type: ApplicationCommandOptionType.User,
          },
          {
            description: "role - role",
            name: "role",
            required: false,
            type: ApplicationCommandOptionType.Role,
          },
          {
            description: "user-or-role - mentionable",
            name: "user-or-role",
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        description: "Testing group description",
        dmPermission: true,
        name: "testing",
        options: [
          {
            description: "hello",
            name: "hello",
            options: [
              {
                description: "text - string",
                name: "text",
                required: true,
                type: ApplicationCommandOptionType.String,
              },
              {
                description: "text2 - string",
                name: "text2",
                required: false,
                type: ApplicationCommandOptionType.String,
              },
            ],
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            description: "maths group description",
            name: "maths",
            options: [
              {
                description: "Multiply",
                name: "multiply",
                options: [
                  {
                    description: "x value",
                    name: "x",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    name: "y",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                ],
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                description: "Addition",
                name: "add",
                options: [
                  {
                    description: "x value",
                    maxValue: 10,
                    minValue: 1,
                    name: "x",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    maxValue: 10,
                    minValue: 1,
                    name: "y",
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
            name: "text",
            options: [
              {
                description: "hello",
                name: "hello",
                options: [
                  {
                    choices: [
                      {
                        name: "Hello",
                        value: "Hello",
                      },
                      {
                        name: "Good Bye",
                        value: "Good Bye",
                      },
                    ],
                    description: "text - string",
                    name: "text",
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
        description: "group-test-without-description",
        dmPermission: true,
        name: "group-test-without-description",
        options: [
          {
            description: "text group description",
            name: "line",
            options: [
              {
                description: "Addition",
                name: "add",
                options: [
                  {
                    description: "x value",
                    name: "x",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                  },
                  {
                    description: "y value",
                    name: "y",
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
        description: "test-x",
        dmPermission: true,
        name: "test-x",
        options: [
          {
            description: "add - subcommandgroup",
            name: "add",
            options: [
              {
                description: "y",
                name: "y",
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                description: "x",
                name: "x",
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
            type: ApplicationCommandOptionType.SubcommandGroup,
          },
          {
            description: "m",
            name: "m",
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            description: "n",
            name: "n",
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
