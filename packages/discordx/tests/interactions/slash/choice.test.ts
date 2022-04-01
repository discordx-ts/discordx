// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandInteraction, Interaction } from "discord.js";

import {
  Client,
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../../../src/index.js";
import {
  FakeInteraction,
  FakeOption,
  InteractionType,
} from "../../interaction.js";

/*
    Define test code
*/

enum TextChoices {
  "Good Bye" = "GoodBye",
  Hello = "Hello",
}

@Discord()
export abstract class AppDiscord {
  @Slash()
  hello(
    @SlashChoice(
      ...Object.keys(TextChoices).map((key) => ({
        name: key,
        value: TextChoices[key as keyof typeof TextChoices],
      }))
    )
    @SlashOption("choice")
    choice: TextChoices,
    interaction: CommandInteraction
  ): unknown {
    return ["/hello", choice, interaction];
  }

  @Slash()
  number(
    @SlashChoice<string, number>({ name: "1", value: 1 })
    @SlashChoice(2, 3, 4)
    @SlashOption("choice")
    choice: number,
    interaction: CommandInteraction
  ): unknown {
    return ["/number", choice, interaction];
  }

  @Slash()
  string(
    @SlashChoice({ name: "A", value: "A" })
    @SlashChoice("B", "C", "D")
    @SlashOption("choice")
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
        defaultPermission: true,
        description: "hello",
        name: "hello",
        options: [
          {
            choices: [
              {
                name: "Good Bye",
                value: "GoodBye",
              },
              {
                name: "Hello",
                value: "Hello",
              },
            ],
            description: "choice - string",
            name: "choice",
            required: true,
            type: "STRING",
          },
        ],
        type: "CHAT_INPUT",
      },
      {
        defaultPermission: true,
        description: "number",
        name: "number",
        options: [
          {
            choices: [
              {
                name: "1",
                value: 1,
              },
              {
                name: "2",
                value: 2,
              },
              {
                name: "3",
                value: 3,
              },
              {
                name: "4",
                value: 4,
              },
            ],
            description: "choice - number",
            name: "choice",
            required: true,
            type: "NUMBER",
          },
        ],
        type: "CHAT_INPUT",
      },
      {
        defaultPermission: true,
        description: "string",
        name: "string",
        options: [
          {
            choices: [
              {
                name: "A",
                value: "A",
              },
              {
                name: "B",
                value: "B",
              },
              {
                name: "C",
                value: "C",
              },
              {
                name: "D",
                value: "D",
              },
            ],
            description: "choice - string",
            name: "choice",
            required: true,
            type: "STRING",
          },
        ],
        type: "CHAT_INPUT",
      },
    ]);
  });

  it("Should execute the enum choice interaction", async () => {
    const interaction = new FakeInteraction({
      commandName: "hello",
      options: [new FakeOption("choice", "STRING", "hello")],
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
      options: [new FakeOption("choice", "STRING", "B")],
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
      options: [new FakeOption("choice", "NUMBER", 3)],
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction
    );

    expect(res).toEqual(["/number", 3, interaction]);
  });
});
