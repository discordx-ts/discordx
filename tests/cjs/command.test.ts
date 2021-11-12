import { Client } from "../../src/index.js";
import { Message } from "discord.js";
import path from "node:path";

const client = new Client({
  classes: [path.join(__dirname, "command.class.ts")],
  intents: [],
});

beforeAll(async () => {
  await client.build();
});

describe("Commands", () => {
  it("Should create the command structure", () => {
    expect(client.simpleCommands[0]?.guilds).toEqual(["693401527494377482"]);
    expect(client.simpleCommands[0]?.permissions).toEqual([
      {
        id: "123",
        permission: true,
        type: "USER",
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

  it("Should execute simple command with uppercase names", async () => {
    const sampleMessage = { content: "!findSource" } as Message;
    const parsedCommand = client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!findSource", [1], parsedCommand, true]);
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

  it("Should avoid splitter space for options", () => {
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
