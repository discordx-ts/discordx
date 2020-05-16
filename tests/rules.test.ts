import { join } from "path";
import {
  Discord,
  Client,
  Command,
  CommandMessage,
  Rules,
  RuleBuilder
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
}

@Discord(/-mdb\s{1,}/i, {
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
  it("Should create modifiers", async () => {
  });
});
