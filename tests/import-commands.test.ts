import {
  Discord,
  Client,
  Command,
  CommandNotFound,
  CommandMessage,
  Rule
} from "../src";

@Discord("!")
abstract class BotCommandExclamation {
  @Command()
  hello(command: CommandMessage) {
    return command.content;
  }

  @Command("hello2")
  hello2(command: CommandMessage) {
    return command.content + "2";
  }

  @Command(Rule("hello3").spaceOrEnd().caseSensitive())
  hello3(command: CommandMessage) {
    return command.content + "3";
  }

  @CommandNotFound()
  commandNotFound(command: CommandMessage) {
    return "notfound";
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
  it("Should a simple command class", async () => {
    const resTest = await triggerAndFilter("test");
    expect(resTest).toEqual(["notfound"]);

    const resHello = await triggerAndFilter("!hello");
    expect(resHello).toEqual(["!hello"]);

    const resHello2 = await triggerAndFilter("!hello2");
    expect(resHello2).toEqual(["!hello22"]);

    const resHelloCase = await triggerAndFilter("!Hello");
    expect(resHelloCase).toEqual(["!Hello"]);

    const resHello3Wrong = await triggerAndFilter("!Hello3");
    expect(resHello3Wrong).toEqual(["notfound"]);

    const resHello3 = await triggerAndFilter("!hello3");
    expect(resHello3).toEqual(["!hello33"]);
  });

  it("Should get the correct command description", () => {
    /* const commands = Client.getCommands();
    expect(commands).toEqual<CommandInfos[]>([
      {
        prefix: "!",
        commandName: "hello",
        description: undefined,
        infos: undefined,
        caseSensitive: false,
        argsSeparator: " "
      },
      {
        prefix: "!",
        commandName: "hello",
        description: undefined,
        infos: undefined,
        caseSensitive: false,
        argsSeparator: " "
      },
      {
        prefix: "!",
        commandName: "Say",
        description: "Say something",
        infos: { myInfo: "info" },
        caseSensitive: true,
        argsSeparator: " "
      },
      {
        prefix: ".",
        commandName: "Say",
        description: "Say something",
        infos: { myInfo: "info" },
        caseSensitive: true,
        argsSeparator: " "
      }
    ]); */
  });
});
