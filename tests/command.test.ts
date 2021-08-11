import { CommandInteraction } from "discord.js";
import {
  Discord,
  SlashOption,
  Guild,
  Client,
  Guard,
  Description,
  SimpleCommand,
  Permission,
} from "../src";

@Discord()
@Permission({ id: "123", type: "USER", permission: true })
@Guild("693401527494377482")
@Guard<any, any>(async (params, client, next, datas) => {
  datas.passed = true;
  return await next();
})
export abstract class AppDiscord {
  @Description("Addition")
  @SimpleCommand("add")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction,
    client: Client,
    datas: any
  ) {
    return ["/testing maths add", x + y, interaction, datas.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Commands", () => {
  it("Should create the command structure", async () => {
    expect(client.commands[0].guilds).toEqual(["693401527494377482"]);
    expect(client.commands[0].permissions).toEqual([
      {
        id: "123",
        type: "USER",
        permission: true,
      },
    ]);
  });
});
