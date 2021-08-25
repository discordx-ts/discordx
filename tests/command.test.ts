import {
  Client,
  Discord,
  Guard,
  Guild,
  Permission,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "../src";
import { Message } from "discord.js";

type Data = { passed: boolean };

@Discord()
@Permission({ id: "123", type: "USER", permission: true })
@Guild("693401527494377482")
@Guard(async (params, client, next, datas) => {
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
    datas: Data
  ): unknown {
    if (!command.isValid()) return "usage: !add x + y";
    return ["!add", [op, x + y], command, datas.passed];
  }

  @SimpleCommand("sub", {
    argSplitter: "|",
  })
  sub(
    @SimpleCommandOption("x", { description: "x value" })
    x: string,
    @SimpleCommandOption("y", { description: "y value" })
    y: string,
    command: SimpleCommandMessage,
    client: Client,
    datas: Data
  ): unknown {
    return ["!add", [x, y], command, datas.passed];
  }

  @SimpleCommand("add plus")
  addExtend(
    command: SimpleCommandMessage,
    client: Client,
    datas: Data
  ): unknown {
    return ["!add plus", [], command, datas.passed];
  }

  @SimpleCommand("add plus second")
  addExtendSecond(
    @SimpleCommandOption("arg") arg: string,
    command: SimpleCommandMessage,
    client: Client,
    datas: Data
  ): unknown {
    return ["!add plus second", [arg], command, datas.passed];
  }

  @SimpleCommand("ban", {
    argSplitter:
      /\s\"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm,
  })
  ban(
    @SimpleCommandOption("id") id: number,
    @SimpleCommandOption("time") time: number,
    @SimpleCommandOption("reason") reason: string,
    @SimpleCommandOption("type") type: string,
    command: SimpleCommandMessage,
    client: Client,
    datas: Data
  ): unknown {
    return ["!ban", [id, time, reason, type], command, datas.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Commands", () => {
  it("Should create the command structure", async () => {
    expect(client.simpleCommands[0]?.guilds).toEqual(["693401527494377482"]);
    expect(client.simpleCommands[0]?.permissions).toEqual([
      {
        id: "123",
        type: "USER",
        permission: true,
      },
    ]);
    expect(client.simpleCommands[0]?.aliases).toEqual(["add1", "add2"]);
    expect(client.simpleCommands[0]?.argSplitter).toEqual("~");
  });

  it("Should execute simple command", async () => {
    const sampleMessage = { content: "!add 2~+~4" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add", ["+", 6], parsedCommand, true]);
  });

  it("Should execute simple command without arguments", async () => {
    const sampleMessage = { content: "!add" } as Message;
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual("usage: !add x + y");
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

  it("Should avoid splitter space for options", async () => {
    const contents = ["!sub 2 | 4", "!sub 2 | 4   ", "!sub 2 |4", "!sub 2|4"];
    contents.forEach(async (content) => {
      const sampleMessage = { content } as Message;
      const parsedCommand = client.parseCommand("!", sampleMessage);
      const response = await client.executeCommand(sampleMessage);
      expect(response).toEqual(["!add", ["2", "4"], parsedCommand, true]);
    });
  });

  it("Should execute arg splitter regex", async () => {
    const sampleMessage = {
      content: "!ban 123 99 'ban reason test' cars",
    } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual([
      "!ban",
      [123, 99, "ban reason test", "cars"],
      parsedCommand,
      true,
    ]);
  });
});
