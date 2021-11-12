import { SimpleCommandMessage } from "../../src/classes/SimpleCommandMessage";
import { Client } from "../../src/Client";
import { Discord } from "../../src/decorators/decorators/Discord";
import { Guard } from "../../src/decorators/decorators/Guard";
import { Guild } from "../../src/decorators/decorators/Guild";
import { Permission } from "../../src/decorators/decorators/Permission";
import { SimpleCommand } from "../../src/decorators/decorators/SimpleCommand";
import { SimpleCommandOption } from "../../src/decorators/decorators/SimpleCommandOption";

type Data = { passed: boolean };

@Discord()
@Permission({ id: "123", permission: true, type: "USER" })
@Guild("693401527494377482")
@Guard((params, client, next, datas) => {
  datas.passed = true;
  return next();
})
export abstract class CommandTest {
  @SimpleCommand("add", {
    aliases: ["add1", "add2"],
    argSplitter: "~",
    description: "Addition"
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
    if (!command.isValid()) {
      return "usage: !add x + y";
    }
    return ["!add", [op, x + y], command, datas.passed];
  }

  @SimpleCommand("sub", {
    argSplitter: "|"
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
      /\s\"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm
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

  @SimpleCommand("findSource")
  findSource(
    command: SimpleCommandMessage,
    client: Client,
    datas: Data
  ): unknown {
    return ["!findSource", [1], command, datas.passed];
  }
}