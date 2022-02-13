// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  Channel,
  CommandInteraction,
  GuildMember,
  Interaction,
  Role,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";

import type { SlashOptionType } from "../build/cjs/index.js";
import {
  Client,
  Discord,
  Guard,
  Guild,
  Permission,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../build/cjs/index.js";

type Data = { passed: boolean };
enum TextChoices {
  "Good Bye" = "GoodBye",
  Hello = "Hello",
}

@Discord()
@Guild("693401527494377482")
@SlashGroup({ description: "Testing group description", name: "testing" })
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
@Guard((params, client, next, datas) => {
  datas.passed = true;
  return next();
})
export abstract class AppDiscord {
  @Slash("add", { description: "Addition" })
  @SlashGroup({
    name: "maths",
    root: "testing",
  })
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/testing maths add", x + y, interaction, datas.passed];
  }

  @Slash("multiply", { description: "Multiply" })
  @SlashGroup({
    name: "maths",
    root: "testing",
  })
  multiply(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/testing maths multiply", x * y, interaction, datas.passed];
  }

  @Slash("hello")
  @SlashGroup({
    name: "text",
    root: "testing",
  })
  hello(
    @SlashChoice(TextChoices)
    @SlashOption("text")
    text: TextChoices,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/testing text hello", text, interaction, datas.passed];
  }

  @Slash("hello")
  @SlashGroup({
    name: "testing",
  })
  root(
    @SlashOption("text")
    text: string,
    @SlashOption("text2", { required: false })
    text2: string,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/testing hello text", text, text2, interaction, datas.passed];
  }
}

@Discord()
@SlashGroup({
  name: "grouptestwithoutdescription",
})
@SlashGroup({
  description: "text group description",
  name: "line",
  root: "grouptestwithoutdescription",
})
@Guard((params, client, next, datas) => {
  datas.passed = true;
  return next();
})
export abstract class AppDiscord2 {
  @Slash("add", { description: "Addition" })
  @SlashGroup({
    name: "line",
    root: "grouptestwithoutdescription",
  })
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/testing line add", x + y, interaction, datas.passed];
  }
}

@Discord()
@Guild("invalid_id")
@Guard((params, client, next, datas) => {
  datas.passed = true;
  return next();
})
export abstract class AppDiscord1 {
  @Slash("hello")
  @Permission({ id: "123", permission: true, type: "USER" })
  add(
    @SlashOption("text", { required: false })
    text: string,
    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/hello", text, interaction, datas.passed];
  }

  @Slash("inference")
  inference(
    @SlashOption("text")
    text: string,

    @SlashOption("bool")
    bool: boolean,

    @SlashOption("nb")
    nb: number,

    @SlashOption("channel")
    channel: Channel,

    @SlashOption("textchannel", { required: false })
    textChannel: TextChannel,

    @SlashOption("voicechannel", { required: false })
    voiceChannel: VoiceChannel,

    @SlashOption("user", { required: false })
    clientUser: User,

    @SlashOption("role", { required: false })
    role: Role,

    @SlashOption("userorrole", { required: false, type: "MENTIONABLE" })
    userorrole: GuildMember | User | Role,

    interaction: CommandInteraction,
    client: Client,
    datas: Data
  ): unknown {
    return ["/inference", "infer", interaction, datas.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

class FakeOption {
  name: string;
  type: SlashOptionType;
  options: FakeOption[] | undefined;
  value: string | number;

  constructor(
    name: string,
    type: SlashOptionType,
    value: string | number,
    options?: FakeOption[]
  ) {
    this.type = type;
    this.name = name;
    this.options = options || undefined;
    this.value = value;
  }
}

class SlashOptionResolver {
  data: FakeOption[];

  constructor(options: FakeOption[]) {
    this.data = options;
  }

  getLastNestedOption(options: readonly FakeOption[]): readonly FakeOption[] {
    const arrOptions = options;

    if (!arrOptions?.[0]?.options) {
      return arrOptions;
    }

    return this.getLastNestedOption(arrOptions?.[0].options);
  }

  get(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getString(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getBoolean(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getNumber(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getInteger(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getRole(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getChannel(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getMentionable(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getMember(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
  getUser(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
}

class FakeInteraction {
  commandName: string;
  options: SlashOptionResolver;

  constructor(commandName: string, options: FakeOption[]) {
    this.commandName = commandName;
    this.options = new SlashOptionResolver(options);
  }

  isCommand() {
    return true;
  }

  isButton() {
    return false;
  }

  isContextMenu() {
    return false;
  }

  isSelectMenu() {
    return false;
  }

  isAutocomplete() {
    return false;
  }
}

describe("Slash", () => {
  it("Should create the slash structure", async () => {
    expect(client.applicationCommands[0]?.guilds).toEqual(["invalid_id"]);
    expect(client.applicationCommands[0]?.permissions).toEqual([
      {
        id: "123",
        permission: true,
        type: "USER",
      },
    ]);

    const slashesObjects = await Promise.all(
      client.applicationCommands.map((slash) => slash.toJSON())
    );

    expect(slashesObjects).toEqual([
      {
        defaultPermission: true,
        description: "hello",
        name: "hello",
        options: [
          {
            description: "text - string",
            name: "text",
            required: false,
            type: "STRING",
          },
        ],
        type: "CHAT_INPUT",
      },
      {
        defaultPermission: true,
        description: "inference",
        name: "inference",
        options: [
          {
            description: "text - string",
            name: "text",
            required: true,
            type: "STRING",
          },
          {
            description: "bool - boolean",
            name: "bool",
            required: true,
            type: "BOOLEAN",
          },
          {
            description: "nb - number",
            name: "nb",
            required: true,
            type: "NUMBER",
          },
          {
            description: "channel - channel",
            name: "channel",
            required: true,
            type: "CHANNEL",
          },
          {
            description: "textchannel - channel",
            name: "textchannel",
            required: false,
            type: "CHANNEL",
          },
          {
            description: "voicechannel - channel",
            name: "voicechannel",
            required: false,
            type: "CHANNEL",
          },
          {
            description: "user - user",
            name: "user",
            required: false,
            type: "USER",
          },
          {
            description: "role - role",
            name: "role",
            required: false,
            type: "ROLE",
          },
          {
            description: "userorrole - mentionable",
            name: "userorrole",
            required: false,
            type: "MENTIONABLE",
          },
        ],
        type: "CHAT_INPUT",
      },
      {
        defaultPermission: true,
        description: "Testing group description",
        name: "testing",
        options: [
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
                    type: "NUMBER",
                  },
                  {
                    description: "y value",
                    name: "y",
                    required: true,
                    type: "NUMBER",
                  },
                ],
                type: "SUB_COMMAND",
              },
              {
                description: "Addition",
                name: "add",
                options: [
                  {
                    description: "x value",
                    name: "x",
                    required: true,
                    type: "NUMBER",
                  },
                  {
                    description: "y value",
                    name: "y",
                    required: true,
                    type: "NUMBER",
                  },
                ],
                type: "SUB_COMMAND",
              },
            ],
            type: "SUB_COMMAND_GROUP",
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
                      { name: "Good Bye", value: "GoodBye" },
                      { name: "Hello", value: "Hello" },
                    ],
                    description: "text - string",
                    name: "text",
                    required: true,
                    type: "STRING",
                  },
                ],
                type: "SUB_COMMAND",
              },
            ],
            type: "SUB_COMMAND_GROUP",
          },
          {
            description: "hello",
            name: "hello",
            options: [
              {
                description: "text - string",
                name: "text",
                required: true,
                type: "STRING",
              },
              {
                description: "text2 - string",
                name: "text2",
                required: false,
                type: "STRING",
              },
            ],
            type: "SUB_COMMAND",
          },
        ],
        type: "CHAT_INPUT",
      },
      {
        defaultPermission: true,
        description: "grouptestwithoutdescription",
        name: "grouptestwithoutdescription",
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
                    type: "NUMBER",
                  },
                  {
                    description: "y value",
                    name: "y",
                    required: true,
                    type: "NUMBER",
                  },
                ],
                type: "SUB_COMMAND",
              },
            ],
            type: "SUB_COMMAND_GROUP",
          },
        ],
        type: "CHAT_INPUT",
      },
    ]);
  });

  it("Should execute the simple slash", async () => {
    const interaction = new FakeInteraction("hello", [
      new FakeOption("text", "STRING", "hello"),
    ]);

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );
    expect(res).toEqual(["/hello", "hello", interaction, true]);
  });

  it("Should execute the simple grouped text slash", async () => {
    const interaction = new FakeInteraction("testing", [
      new FakeOption("hello", "SUB_COMMAND", "text", [
        new FakeOption("text", "STRING", "testing hello text"),
        new FakeOption("text2", "STRING", "testing hello text2"),
      ]),
    ]);

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
    const interaction = new FakeInteraction("testing", [
      new FakeOption("text", "SUB_COMMAND_GROUP", "text", [
        new FakeOption("hello", "SUB_COMMAND", "text", [
          new FakeOption("text", "STRING", "testing text hello"),
        ]),
      ]),
    ]);

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
    const interaction = new FakeInteraction("testing", [
      new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
        new FakeOption("multiply", "SUB_COMMAND", "text", [
          new FakeOption("x", "NUMBER", 2),
          new FakeOption("y", "NUMBER", 5),
        ]),
      ]),
    ]);

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );
    expect(res).toEqual(["/testing maths multiply", 10, interaction, true]);
  });

  it("Should execute the simple subgrouped addition slash", async () => {
    const interaction = new FakeInteraction("testing", [
      new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
        new FakeOption("add", "SUB_COMMAND", "text", [
          new FakeOption("x", "NUMBER", 2),
          new FakeOption("y", "NUMBER", 5),
        ]),
      ]),
    ]);

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );
    expect(res).toEqual(["/testing maths add", 7, interaction, true]);
  });

  it("Should execute the with optional option", async () => {
    const interaction = new FakeInteraction("hello", []);

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );
    expect(res).toEqual(["/hello", undefined, interaction, true]);
  });

  it("Should not execute not found slash", async () => {
    const interaction = new FakeInteraction("testing", [
      new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
        new FakeOption("notfound", "SUB_COMMAND", "text", [
          new FakeOption("x", "NUMBER", 2),
          new FakeOption("y", "NUMBER", 5),
        ]),
      ]),
    ]);

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );
    expect(res).toEqual(undefined);
  });
});
