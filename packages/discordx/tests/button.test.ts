/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ButtonInteraction, Interaction } from "discord.js";
import { ButtonComponent, Client, Discord, Guard } from "discordx";

import { FakeInteraction, InteractionType } from "./util/interaction.js";

/*
    Define test code
*/

@Discord()
export class Example {
  @ButtonComponent({ id: "hello" })
  @Guard((params, client, next, data) => {
    data.passed = true;
    return next();
  })
  handler(
    interaction: ButtonInteraction,
    client: Client,
    data: { passed: boolean },
  ): unknown {
    return [":wave:", data.passed];
  }

  @ButtonComponent({ id: "hello" })
  handler2(): unknown {
    return [":shake:", undefined];
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

describe("Button", () => {
  it("Should create the button structure", () => {
    expect(client.buttonComponents[0]?.id).toEqual("hello");
  });

  it("Should execute the button interaction", async () => {
    const interaction = new FakeInteraction({
      customId: "hello",
      guildId: "discordx",
      type: InteractionType.Button,
    });

    const res = await client.executeInteraction(
      interaction as unknown as Interaction,
    );

    expect(res).toEqual([
      [":wave:", true],
      [":shake:", undefined],
    ]);
  });
});
