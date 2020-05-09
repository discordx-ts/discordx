import { Discord, On, Client, Guard, Command, CommandNotFound, CommandMessage, CommandInfos } from "../src";

@Discord({ prefix: "!" })
abstract class BotCommandExclamation {
  @Command()
  hello(command: CommandMessage) {
    return command.content;
  }

  @Command("Say", {
    commandCaseSensitive: true,
    description: "Say something",
    infos: { myInfo: "info" }
  })
  say(command: CommandMessage) {
    return command.content;
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
client.build();

async function triggerAndFilter(message: string) {
  return (await client.trigger("message", createCommandMessage(message))).filter(i => i);
}

describe("Create commands", () => {
  it("Should a simple command class", async () => {
    const res = await triggerAndFilter("test");
    expect(res.filter(i => i)).toEqual([]);

    const res2 = await triggerAndFilter("!hello");
    expect(res2).toEqual(["!hello"]);

    const res3 = await triggerAndFilter("!Say");
    expect(res3).toEqual(["!Say"]);

    const res4 = await triggerAndFilter("!say");
    expect(res4).toEqual(["notfound"]);

    const res5 = await triggerAndFilter("!_");
    expect(res5).toEqual(["notfound"]);
  });

  it("Should get the correct command description", () => {
    const commands = Client.getCommands();
    expect(commands).toEqual<CommandInfos[]>([
      {
        prefix: "!",
        commandName: "hello",
        description: undefined,
        infos: undefined,
        caseSensitive: false
      },
      {
        prefix: "!",
        commandName: "Say",
        description: "Say something",
        infos: { myInfo: "info" },
        caseSensitive: true
      }
    ]);
  });
});
