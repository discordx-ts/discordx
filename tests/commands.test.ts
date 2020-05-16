import { join } from "path";
import {
  Discord,
  Client,
  Command,
  CommandNotFound,
  CommandMessage,
  Rule,
  Infos,
  Description,
  RuleBuilder
} from "../src";

@Discord("!", {
  import: join(__dirname, "commands", "*.ts")
})
@Infos({ test: "test" })
@Description("My description")
abstract class BotCommandExclamation {
  @Command()
  @Infos({ command: "command" })
  @Description("My command description")
  hello(command: CommandMessage) {
    return command.content;
  }

  @Command("hello2")
  @Infos({ command2: "command2" })
  @Description("My command description 2")
  hello2(command: CommandMessage) {
    return command.content + "2";
  }

  @Command(Rule("hello3").spaceOrEnd().caseSensitive())
  @Infos({ command3: "command3" })
  @Description("My command description 3")
  hello3(command: CommandMessage) {
    return command.content + "3";
  }

  @CommandNotFound()
  @Infos({ commandNotFound: "commandNotFound" })
  @Description("My command not found description")
  commandNotFound(command: CommandMessage) {
    return "notfound";
  }
}


@Discord(Rule().startWith("-space").spaceOrEnd())
@Infos({ test: "test space" })
@Description("My description space")
abstract class BotCommandSpace {
  @Command()
  @Infos({ space: "space" })
  @Description("My command description space")
  hello(command: CommandMessage) {
    return command.content;
  }

  @CommandNotFound()
  @Infos({ commandNotFoundSpace: "commandNotFoundSpace" })
  @Description("My command not found description space")
  commandNotFound(command: CommandMessage) {
    return "notfound space";
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
  it("Should a create simple command class", async () => {
    const resTest = await triggerAndFilter("test");
    expect(resTest).toEqual([]);

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

    const resSpaceHello = await triggerAndFilter("-space hello");
    expect(resSpaceHello).toEqual(["-space hello"]);

    const resSpaceNotFound = await triggerAndFilter("-space blabla");
    expect(resSpaceNotFound).toEqual(["notfound space"]);
  });

  it("Should get the correct command description", () => {
    const commands = Client.getCommands();
    const commandsNotFound = Client.getCommandsNotFound();

    expect(commands[2].prefix).toEqual("!");
    expect(commands[0].infos.command).toEqual("command");
    expect(commands[0].description).toEqual("My command description");

    expect(commands[2].prefix).toEqual("!");
    expect(commands[1].infos.command2).toEqual("command2");
    expect(commands[1].description).toEqual("My command description 2");

    expect(commands[2].prefix).toEqual("!");
    expect(commands[2].infos.command3).toEqual("command3");
    expect(commands[2].description).toEqual("My command description 3");

    expect(commands[3].prefix).toEqual("!");
    expect((commands[3].commandName as RuleBuilder).source).toEqual("bye");

    expect((commands[4].prefix as RuleBuilder).source).toEqual("^-space(\\s{1,}|$)");
    expect(commands[4].infos.space).toEqual("space");
    expect(commands[4].description).toEqual("My command description space");

    expect(commandsNotFound[0].infos.commandNotFound).toEqual("commandNotFound");
    expect(commandsNotFound[0].description).toEqual("My command not found description");

    expect(commandsNotFound[1].infos.commandNotFoundSpace).toEqual("commandNotFoundSpace");
    expect(commandsNotFound[1].description).toEqual("My command not found description space");
  });

  it("Should import the commands", async () => {
    const resByeLo = await triggerAndFilter("!bye");
    expect(resByeLo).toEqual(["!bye"]);

    const resByeRuleNotFound = await triggerAndFilter("!testme");
    expect(resByeRuleNotFound).toEqual(["notfound"]);

    const resByeRule = await triggerAndFilter("!test me");
    expect(resByeRule).toEqual(["!test me"]);

    const resByeUp = await triggerAndFilter("!bYe");
    expect(resByeUp).toEqual(["notfound"]);
  });
});
