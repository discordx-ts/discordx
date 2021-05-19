import { join } from "path";
import {
  Discord,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
  Guard,
  GuardFunction,
} from "../src";

const guard0: GuardFunction<any, { message: any; guards: string }> = async (
  [message]: [any],
  client,
  next,
  mwDatas
) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  mwDatas.guards = "0";
  return await next();
};

const guard1: GuardFunction<any, { message: any; guards: string }> = async (
  [message]: [any],
  client,
  next,
  mwDatas
) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  mwDatas.guards += "1";
  return await next();
};

const guard2: GuardFunction<any, { message: any; guards: string }> = async (
  [message]: [any],
  client,
  next,
  mwDatas
) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  mwDatas.guards += "2";
  return await next();
};

@Discord(/-mdb\s+/i, {
  import: join(__dirname, "commands", "*.ts"),
})
@Guard(guard0, guard1)
abstract class BotCommandRules {
  @Command()
  @Command(/a/)
  @Command(/b/)
  @Command(() => /test2/)
  @Command(() => /test/)
  @Guard(guard1, guard2)
  hello(command: CommandMessage, client, mwsDatas) {
    return mwsDatas;
  }

  @Command("args", "a", "number", "b")
  @Command("an another rule path", "slug", "number")
  args(command: CommandMessage, client, mwsDatas) {
    return command.params;
  }

  @CommandNotFound()
  @Guard(guard2, guard1)
  cnf(command: CommandMessage, client, mwsDatas) {
    mwsDatas.notfound = true;
    return mwsDatas;
  }
}

@Discord(/-mdb2\s+/i, {
  import: join(__dirname, "commands", "*.ts"),
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
      id: "",
    },
    content,
  };
}

const client = new Client();
client.user = { id: "_" } as any;

beforeAll(async () => {
  await client.build();
});

async function triggerAndFilter(message: string) {
  return await client.trigger("message", createCommandMessage(message));
}

describe("Create commands", () => {
  it("Should a create modifiers", async () => {
    const res1 = await triggerAndFilter("-mdb");
    expect(res1).toEqual([]);

    const res2 = await triggerAndFilter("-mdb ");
    expect(res2).toEqual([{ guards: "0121", notfound: true }]);

    const res3 = await triggerAndFilter("-mdb hello");
    expect(res3).toEqual([{ guards: "0112" }]);

    const res4 = await triggerAndFilter("-mdb bf");
    expect(res4).toEqual([{ guards: "0121", notfound: true }]);

    const res5 = await triggerAndFilter("-mdb test");
    expect(res5).toEqual([{ guards: "0112" }]);
  });

  it("Should parse the args", async () => {
    const res1 = await triggerAndFilter("-mdb args a 34");
    expect(res1[0]).toEqual({ a: "a", b: undefined, number: 34 });

    const res2 = await triggerAndFilter("-mdb an another rule path yo 56");
    expect(res2[0]).toEqual({ slug: "yo", number: 56 });
  });
});
