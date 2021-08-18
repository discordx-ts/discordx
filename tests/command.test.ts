import { Message } from "discord.js";
import {
  Discord,
  Guild,
  Client,
  Guard,
  SimpleCommand,
  Permission,
  SimpleCommandOption,
  SimpleCommandMessage,
} from "../src";

@Discord()
@Permission({ id: "123", type: "USER", permission: true })
@Guild("693401527494377482")
@Guard<any, any>(async (params, client, next, datas) => {
  datas.passed = true;
  return await next();
})
export abstract class AppDiscord {
  @SimpleCommand("add", {
    aliases: ["add1", "add2"],
    description: "Addition",
    argSplitter: "~",
  })
  add(
    @SimpleCommandOption("x", { description: "x value" })
    x: number,
    @SimpleCommandOption("op", { description: "operation value" })
    op: string,
    @SimpleCommandOption("y", { description: "y value" })
    y: number,
    command: SimpleCommandMessage,
    client: Client,
    datas: any
  ) {
    return ["!add", [op, x + y], command, datas.passed];
  }

  @SimpleCommand("add plus")
  addExtend(command: SimpleCommandMessage, client: Client, datas: any) {
    return ["!add plus", [], command, datas.passed];
  }

  @SimpleCommand("add plus second")
  addExtendSecond(
    @SimpleCommandOption() arg: string,
    command: SimpleCommandMessage,
    client: Client,
    datas: any
  ) {
    return ["!add plus second", [arg], command, datas.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Commands", () => {
  it("Should create the command structure", async () => {
    expect(client.simpleCommands[0].guilds).toEqual(["693401527494377482"]);
    expect(client.simpleCommands[0].permissions).toEqual([
      {
        id: "123",
        type: "USER",
        permission: true,
      },
    ]);
    expect(client.simpleCommands[0].aliases).toEqual(["add1", "add2"]);
    expect(client.simpleCommands[0].argSplitter).toEqual("~");
  });

  it("Should execute simple command", async () => {
    const sampleMessage = { content: "!add 2~+~4" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add", ["+", 6], parsedCommand, true]);
  });

  it("Should execute simple command without arguments", async () => {
    const sampleMessage = { content: "!add" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add", [undefined, NaN], parsedCommand, true]);
  });

  it("Should execute simple command with space", async () => {
    const sampleMessage = { content: "!add plus" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add plus", [], parsedCommand, true]);
  });

  it("Should execute simple command with two spaces", async () => {
    const sampleMessage = { content: "!add plus second car" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual([
      "!add plus second",
      ["car"],
      parsedCommand,
      true,
    ]);
  });

  it("Should execute simple command aliases", async () => {
    const sampleMessage = { content: "!add2 2~+~4" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add", ["+", 6], parsedCommand, true]);
  });

  it("Should not execute not found simple command", async () => {
    const sampleMessage = { content: "!add22 2~+~4" } as Message;
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(undefined);
  });
});
