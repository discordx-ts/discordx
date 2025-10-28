/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  type CommandInteraction,
  type Interaction,
} from "discord.js";
import { Client, Discord, Guard, Guild, Slash, SlashOption } from "discordx";

import {
  FakeInteraction,
  FakeOption,
  InteractionType,
} from "./util/interaction.js";

interface Data {
  passed: boolean;
}

// biome-ignore lint/suspicious/noExportsInTest: ignore
@Discord()
@Guild("invalid_id")
@Guard((_params, _client, next, data) => {
  data.passed = true;
  return next();
})
export class Example3 {
  @Slash({ description: "hello" })
  hello(
    @SlashOption({
      description: "text",
      name: "text",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction,
    _client: Client,
    data: Data,
  ): unknown {
    return ["/hello", text, interaction, data.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Slash", () => {
  it("Should create the slash structure", () => {
    expect(client.applicationCommands[0]?.guilds).toEqual(["invalid_id"]);

    const slashesObjects = client.applicationCommands.map((slash) =>
      slash.toJSON(),
    );

    expect(slashesObjects).toEqual([
      {
        defaultMemberPermissions: null,
        description: "hello",
        descriptionLocalizations: null,
        dmPermission: true,
        contexts: null,
        integrationTypes: [0],
        name: "hello",
        nameLocalizations: null,
        nsfw: false,
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
      interaction as unknown as Interaction,
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
      interaction as unknown as Interaction,
    );

    expect(res).toEqual(["/hello", undefined, interaction, true]);
  });

  it("Should not execute not found slash", async () => {
    const interaction = new FakeInteraction({
      commandName: "not-found-test",
      type: InteractionType.Command,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction,
    );

    expect(res).toEqual(null);
  });
});
