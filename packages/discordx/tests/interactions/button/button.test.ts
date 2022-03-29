// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Interaction } from "discord.js";

import { ButtonComponent, Client, Discord } from "../../../src/index.js";
import { FakeInteraction, InteractionType } from "../../interaction.js";

/*
    Define test code
*/

@Discord()
export abstract class AppDiscord {
  @ButtonComponent("hello")
  handler(): unknown {
    return [":wave:"];
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
      interaction as unknown as Interaction
    );

    expect(res).toEqual([[":wave:"]]);
  });
});
