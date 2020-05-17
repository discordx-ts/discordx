import { join } from "path";
import {
  Discord,
  Client,
  Command,
  CommandMessage,
  Rules,
  RuleBuilder,
  CommandNotFound
} from "../src";

@Discord(/-mdb\s{1,}/i, {
  import: join(__dirname, "commands", "*.ts")
})
@Rules("", ["!", "test"])
abstract class BotCommandRules {
  @Command()
  @Rules([/\a/i])
  @Rules([/\b/i])
  @Rules([
    { separator: " ", rules: [/c/, "d"] },
    { separator: RuleBuilder.atLeastOneSpace, rules: [/z/, "y"] }
  ])
  @Rules(async (command) => [
    { separator: " ", rules: [command.content] }
  ])
  hello(command: CommandMessage) {
    return command.content;
  }

  @CommandNotFound()
  cnf() {
    return "notfound";
  }
}

@Discord(/-mdb2\s{1,}/i, {
  import: join(__dirname, "commands", "*.ts")
})
abstract class BotCommandRules2 {
  @Command()
  hello(command: CommandMessage) {
    return command.content;
  }
}

function createCommandMessage(content: string) {
  return {
    author: {
      id: ""
    },
    content
  };
}

const client = new Client();
client.user = { id: "_" } as any;

beforeAll(async () => {
  await client.build();
});

async function triggerAndFilter(message: string) {
  return (await client.trigger("message", createCommandMessage(message)));
}

describe("Create commands", () => {
  it("Should a create modifiers", async () => {
    const res1 = await triggerAndFilter("-mdb");
    expect(res1).toEqual([]);

    const res2 = await triggerAndFilter("-mdb ");
    expect(res2).toEqual(["notfound"]);

    const res3 = await triggerAndFilter("-mdb hello");
    expect(res2).toEqual(["-mdb hello"]);


    // const resHello = await triggerAndFilter("!hello");
    // expect(resHello).toEqual(["!hello"]);

    // const resHello2 = await triggerAndFilter("!hello2");
    // expect(resHello2).toEqual(["!hello22"]);

    // const resHelloCase = await triggerAndFilter("!Hello");
    // expect(resHelloCase).toEqual(["!Hello"]);

    // const resHello3Wrong = await triggerAndFilter("!Hello3");
    // expect(resHello3Wrong).toEqual(["notfound"]);

    // const resHello3 = await triggerAndFilter("!hello3");
    // expect(resHello3).toEqual(["!hello33"]);

    // const resSpaceHello = await triggerAndFilter("-space hello");
    // expect(resSpaceHello).toEqual(["-space hello"]);

    // const resSpaceNotFound = await triggerAndFilter("-space blabla");
    // expect(resSpaceNotFound).toEqual(["notfound space"]);
  });
});
