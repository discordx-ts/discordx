import { CommandInteraction, CommandInteractionOption } from "discord.js";
import {
  Discord,
  Slash,
  Option,
  Guild,
  Group,
  Choices,
  Client,
  DSlash,
  DOption,
  Permission,
  OptionValueType,
  StringOptionType,
  Guard
} from "../src";

enum TextChoices {
  Hello = "Hello",
  "Good Bye" = "GoodBye"
}

@Discord()
@Guild("693401527494377482")
@Group(
  "testing",
  "Testing group description",
  {
    maths: "maths group description",
    text: "text group description"
  }
)
@Guard<any, any>(async (params, client, next, datas) => {
  datas.passed = true;
  return await next();
})
export abstract class AppDiscord {
  @Slash("add")
  @Group("maths")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return [
      "/testing maths add",
      x + y,
      interaction,
      datas.passed
    ];
  }

  @Slash("multiply")
  @Group("maths")
  multiply(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return [
      "/testing maths multiply",
      x * y,
      interaction,
      datas.passed
    ];
  }

  @Slash("hello")
  @Group("text")
  hello(
    @Choices(TextChoices)
    @Option("text")
    text: TextChoices,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return [
      "/testing text hello",
      text,
      interaction,
      datas.passed
    ];
  }

  @Slash("hello")
  root(
    @Option("text")
    text: string,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return [
      "/testing hello text",
      text,
      interaction,
      datas.passed
    ];
  }
}

@Discord()
@Guild("invalid_id")
@Guard<any, any>(async (params, client, next, datas) => {
  datas.passed = true;
  return await next();
})
export abstract class AppDiscord1 {
  @Slash("hello")
  @Permission("123")
  add(
    @Option("text")
    text: string,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return [
      "/hello",
      text,
      interaction,
      datas.passed
    ];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

class FakeOption {
  name: string;
  type: StringOptionType;
  options: FakeOption[] | undefined;
  value: string | number;

  constructor(
    name: string,
    type: StringOptionType,
    value: string | number,
    options?: FakeOption[],
  ) {
    this.type = type;
    this.name = name;
    this.options = options || undefined;
    this.value = value;
  }
}

class FakeInteraction {
  commandName: string;
  options: FakeOption[];

  constructor(commandName: string, options: FakeOption[]) {
    this.commandName = commandName;
    this.options = options;
  }

  isCommand() {
    return true;
  }
}

describe("Slash", () => {
  it("Should create the slash structure", async () => {
    expect(client.slashes[0].guilds).toEqual(["invalid_id"]);
    expect(client.slashes[0].permissions).toEqual(["123"]);

    const slashesObjects = client.slashes.map((slash) => slash.toObject());
    expect(slashesObjects).toEqual([
      {
        name: "hello",
        description: "hello",
        options: [
          {
            description: "text - STRING",
            name: "text",
            type: "STRING",
            required: false,
            choices: [
            ],
            options: [
            ],
          },
        ],
        defaultPermission: false,
      },
      {
        name: "testing",
        description: "Testing group description",
        options: [
          {
            description: "text group description",
            name: "text",
            type: "SUB_COMMAND_GROUP",
            choices: [
            ],
            options: [
              {
                description: "hello - SUB_COMMAND",
                name: "hello",
                type: "SUB_COMMAND",
                choices: [
                ],
                options: [
                  {
                    description: "text - STRING",
                    name: "text",
                    type: "STRING",
                    required: false,
                    choices: [
                      {
                        name: "Hello",
                        value: "Hello",
                      },
                      {
                        name: "Good Bye",
                        value: "GoodBye",
                      },
                    ],
                    options: [
                    ],
                  },
                ],
              },
            ],
          },
          {
            description: "maths group description",
            name: "maths",
            type: "SUB_COMMAND_GROUP",
            choices: [
            ],
            options: [
              {
                description: "add - SUB_COMMAND",
                name: "add",
                type: "SUB_COMMAND",
                choices: [
                ],
                options: [
                  {
                    description: "y value",
                    name: "y",
                    type: "INTEGER",
                    required: false,
                    choices: [
                    ],
                    options: [
                    ],
                  },
                  {
                    description: "x value",
                    name: "x",
                    type: "INTEGER",
                    required: false,
                    choices: [
                    ],
                    options: [
                    ],
                  },
                ],
              },
              {
                description: "multiply - SUB_COMMAND",
                name: "multiply",
                type: "SUB_COMMAND",
                choices: [
                ],
                options: [
                  {
                    description: "y value",
                    name: "y",
                    type: "INTEGER",
                    required: false,
                    choices: [
                    ],
                    options: [
                    ],
                  },
                  {
                    description: "x value",
                    name: "x",
                    type: "INTEGER",
                    required: false,
                    choices: [
                    ],
                    options: [
                    ],
                  },
                ],
              },
            ],
          },
          {
            description: "hello - SUB_COMMAND",
            name: "hello",
            type: "SUB_COMMAND",
            choices: [
            ],
            options: [
              {
                description: "text - STRING",
                name: "text",
                type: "STRING",
                required: false,
                choices: [
                ],
                options: [
                ],
              },
            ],
          },
        ],
        defaultPermission: true,
      },
    ]);
  });

  it("Should execute the simple slash", async () => {
    const interaction = new FakeInteraction(
      "hello",
      [
        new FakeOption("text", "STRING", "hello")
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(["/hello", "hello", interaction, true]);
  });

  it("Should execute the simple grouped text slash", async () => {
    const interaction = new FakeInteraction(
      "testing",
      [
        new FakeOption("hello", "SUB_COMMAND", "text", [
          new FakeOption("text", "STRING", "testing hello text")
        ])
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(["/testing hello text", "testing hello text", interaction, true]);
  });

  it("Should execute the simple subgrouped text slash", async () => {
    const interaction = new FakeInteraction(
      "testing",
      [
        new FakeOption("text", "SUB_COMMAND_GROUP", "text", [
          new FakeOption("hello", "SUB_COMMAND", "text", [
            new FakeOption("text", "STRING", "testing text hello")
          ])
        ])
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(["/testing text hello", "testing text hello", interaction, true]);
  });

  it("Should execute the simple subgrouped multiply slash", async () => {
    const interaction = new FakeInteraction(
      "testing",
      [
        new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
          new FakeOption("multiply", "SUB_COMMAND", "text", [
            new FakeOption("x", "INTEGER", 2),
            new FakeOption("y", "INTEGER", 5)
          ])
        ])
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(["/testing maths multiply", 10, interaction, true]);
  });

  it("Should execute the simple subgrouped addition slash", async () => {
    const interaction = new FakeInteraction(
      "testing",
      [
        new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
          new FakeOption("add", "SUB_COMMAND", "text", [
            new FakeOption("x", "INTEGER", 2),
            new FakeOption("y", "INTEGER", 5)
          ])
        ])
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(["/testing maths add", 7, interaction, true]);
  });

  it("Should not execute not found slash", async () => {
    const interaction = new FakeInteraction(
      "testing",
      [
        new FakeOption("maths", "SUB_COMMAND_GROUP", "text", [
          new FakeOption("notfound", "SUB_COMMAND", "text", [
            new FakeOption("x", "INTEGER", 2),
            new FakeOption("y", "INTEGER", 5)
          ])
        ])
      ]
    );

    const res = await client.executeSlash(interaction as any);
    expect(res).toEqual(undefined);
  });
});
