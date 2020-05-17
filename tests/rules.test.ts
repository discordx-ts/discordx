import { join } from "path";
import {
  Discord,
  Client,
  Command,
  CommandMessage,
  Rules,
  CommandNotFound,
  ComputedRules,
  Guard,
  GuardFunction
} from "../src";

const guard1: GuardFunction<{message: any, original: string}> = async ([message]: [any], client, on, next, mwDatas) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  mwDatas.original = message.content + "0";
  return await next();
};

@Discord(/-mdb\s{1,}/i, {
  import: join(__dirname, "commands", "*.ts")
})
@Rules("!", "test")
abstract class BotCommandRules {
  @Command()
  @Rules(/a/)
  @Rules(/b/, /f/)
  @ComputedRules(() => ([
    /test/
  ]))
  @ComputedRules(() => ([
    /test2/
  ]))
  @Guard(guard1)
  hello(command: CommandMessage, client, on, mwsDatas) {
    return mwsDatas.original;
  }

  @CommandNotFound()
  @Guard(guard1)
  cnf(command: CommandMessage, client, on, mwsDatas) {
    return "notfound" + mwsDatas.original;
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
    expect(res2).toEqual(["notfound-mdb 0"]);

    const res3 = await triggerAndFilter("-mdb hello");
    expect(res3).toEqual(["notfound-mdb hello0"]);

    const res4 = await triggerAndFilter("-mdb bf");
    expect(res4).toEqual(["-mdb bf0"]);

    const res5 = await triggerAndFilter("-mdb test");
    expect(res5).toEqual(["-mdb test0"]);

    const res6 = await triggerAndFilter("!testa");
    expect(res6).toEqual(["!testa0"]);
  });
});
