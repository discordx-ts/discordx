// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  Interaction,
} from "discord.js";

import {
  Client,
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../src/index.js";
import {
  FakeInteraction,
  FakeOption,
  InteractionType,
} from "./util/interaction.js";

/*
  Define test code
*/

enum TextChoices {
  "Good Bye" = "Good Bye",
  Hello = "Hello",
}

@Discord()
export class Example {
  @Slash({ description: "hello" })
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
    @SlashOption({
      description: "choice",
      name: "choice",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    choice: TextChoices,
    interaction: CommandInteraction
  ): unknown {
    return ["/hello", choice, interaction];
  }

  @Slash({ description: "number" })
  number(
    @SlashChoice<string, number>({ name: "1", value: 1 })
    @SlashChoice(2, 3, 4)
    @SlashOption({
      description: "choice",
      name: "choice",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    choice: number,
    interaction: CommandInteraction
  ): unknown {
    return ["/number", choice, interaction];
  }

  @Slash({ description: "string" })
  string(
    @SlashChoice({ name: "A", value: "A" })
    @SlashChoice("B", "C", "D")
    @SlashOption({
      description: "choice",
      name: "choice",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    choice: string,
    interaction: CommandInteraction
  ): unknown {
    return ["/string", choice, interaction];
  }
}

/*
    Build client
*/

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

/*
    Test execution
*/

describe("Choice", () => {
  it("Should create the choice structure", async () => {
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
        nsfw: false,
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
            description: "choice",
            descriptionLocalizations: null,
            name: "choice",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "number",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "number",
        nameLocalizations: null,
        nsfw: false,
        options: [
          {
            choices: [
              {
                name: "1",
                nameLocalizations: null,
                value: 1,
              },
              {
                name: "2",
                nameLocalizations: null,
                value: 2,
              },
              {
                name: "3",
                nameLocalizations: null,
                value: 3,
              },
              {
                name: "4",
                nameLocalizations: null,
                value: 4,
              },
            ],
            description: "choice",
            descriptionLocalizations: null,
            name: "choice",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.Number,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
      {
        defaultMemberPermissions: null,
        description: "string",
        descriptionLocalizations: null,
        dmPermission: true,
        name: "string",
        nameLocalizations: null,
        nsfw: false,
        options: [
          {
            choices: [
              {
                name: "A",
                nameLocalizations: null,
                value: "A",
              },
              {
                name: "B",
                nameLocalizations: null,
                value: "B",
              },
              {
                name: "C",
                nameLocalizations: null,
                value: "C",
              },
              {
                name: "D",
                nameLocalizations: null,
                value: "D",
              },
            ],
            description: "choice",
            descriptionLocalizations: null,
            name: "choice",
            nameLocalizations: null,
            required: true,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandType.ChatInput,
      },
    ]);
  });

  it("Should execute the enum choice interaction", async () => {
    const interaction = new FakeInteraction({
      commandName: "hello",
      options: [
        new FakeOption("choice", ApplicationCommandOptionType.String, "hello"),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/hello", "hello", interaction]);
  });

  it("Should execute the string choice interaction", async () => {
    const interaction = new FakeInteraction({
      commandName: "string",
      options: [
        new FakeOption("choice", ApplicationCommandOptionType.String, "B"),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/string", "B", interaction]);
  });

  it("Should execute the number choice interaction", async () => {
    const interaction = new FakeInteraction({
      commandName: "number",
      options: [
        new FakeOption("choice", ApplicationCommandOptionType.Number, 3),
      ],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/number", 3, interaction]);
  });
});
