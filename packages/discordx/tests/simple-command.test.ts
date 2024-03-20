/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Message } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Client,
  Discord,
  Guard,
  Guild,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";

type Data = { passed: boolean };

@Discord()
@Guild("693401527494377482")
@Guard((params, client, next, data) => {
  data.passed = true;
  return next();
})
export class Example {
  @SimpleCommand({
    aliases: ["add1", "add2"],
    argSplitter: "~",
    description: "Addition",
  })
  add(
    @SimpleCommandOption({
      description: "x value",
      name: "x",
      type: SimpleCommandOptionType.Number,
    })
    x: number,

    @SimpleCommandOption({
      description: "operation value",
      name: "op",
      type: SimpleCommandOptionType.String,
    })
    op: string,

    @SimpleCommandOption({
      description: "y value",
      name: "y",
      type: SimpleCommandOptionType.Number,
    })
    y: number,

    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    if (!command.isValid()) {
      return "usage: !add x + y";
    }
    return ["!add", [op, x + y], command, data.passed];
  }

  @SimpleCommand({
    argSplitter: "|",
  })
  sub(
    @SimpleCommandOption({
      description: "x value",
      name: "x",
      type: SimpleCommandOptionType.String,
    })
    x: string,

    @SimpleCommandOption({
      description: "y value",
      name: "y",
      type: SimpleCommandOptionType.String,
    })
    y: string,

    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    return ["!add", [x, y], command, data.passed];
  }

  @SimpleCommand({ name: "add plus" })
  addExtend(
    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    return ["!add plus", [], command, data.passed];
  }

  @SimpleCommand({ name: "add plus second" })
  addExtendSecond(
    @SimpleCommandOption({ name: "arg", type: SimpleCommandOptionType.String })
    arg: string,

    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    return ["!add plus second", [arg], command, data.passed];
  }

  @SimpleCommand({
    argSplitter:
      /\s\"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm,
  })
  ban(
    @SimpleCommandOption({ name: "id", type: SimpleCommandOptionType.Number })
    id: number,

    @SimpleCommandOption({ name: "time", type: SimpleCommandOptionType.Number })
    time: number,

    @SimpleCommandOption({
      name: "reason",
      type: SimpleCommandOptionType.String,
    })
    reason: string,

    @SimpleCommandOption({ name: "type", type: SimpleCommandOptionType.String })
    type: string,

    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    return ["!ban", [id, time, reason, type], command, data.passed];
  }

  @SimpleCommand()
  findSource(
    command: SimpleCommandMessage,
    client: Client,
    data: Data,
  ): unknown {
    return ["!findSource", [1], command, data.passed];
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Commands", () => {
  it("Should create the command structure", () => {
    expect(client.simpleCommands[0]?.guilds).toEqual(["693401527494377482"]);
    expect(client.simpleCommands[0]?.aliases).toEqual(["add1", "add2"]);
    expect(client.simpleCommands[0]?.argSplitter).toEqual("~");
  });

  it("Should execute simple command", async () => {
    const sampleMessage = { content: "!add 2~+~4" } as Message;
    const parsedCommand = await client.parseCommand("!", sampleMessage);
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
    const parsedCommand = await client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!add plus", [], parsedCommand, true]);
  });

  it("Should execute simple command with uppercase names", async () => {
    const sampleMessage = { content: "!findSource" } as Message;
    const parsedCommand = await client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual(["!findSource", [1], parsedCommand, true]);
  });

  it("Should execute simple command with two spaces", async () => {
    const sampleMessage = { content: "!add plus second car" } as Message;
    const parsedCommand = await client.parseCommand("!", sampleMessage);
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
    const parsedCommand = await client.parseCommand("!", sampleMessage);
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
    const results = await Promise.all(
      contents.map(async (content) => {
        const sampleMessage = { content } as Message;
        const parsedCommand = await client.parseCommand("!", sampleMessage);
        const response = await client.executeCommand(sampleMessage);
        return { parsedCommand, response };
      }),
    );

    for (const result of results) {
      expect(result.response).toEqual([
        "!add",
        ["2", "4"],
        result.parsedCommand,
        true,
      ]);
    }
  });

  it("Should execute arg splitter regex", async () => {
    const sampleMessage = {
      content: "!ban 123 99 'ban reason test' cars",
    } as Message;
    const parsedCommand = await client.parseCommand("!", sampleMessage);
    const response = await client.executeCommand(sampleMessage);
    expect(response).toEqual([
      "!ban",
      [123, 99, "ban reason test", "cars"],
      parsedCommand,
      true,
    ]);
  });
});
