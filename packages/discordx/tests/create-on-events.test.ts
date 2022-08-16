import type { GuardFunction } from "../src/index.js";
import { Client, Discord, Guard, On } from "../src/index.js";

const guard1: GuardFunction = async (
  [message]: [string],
  client,
  next,
  data
) => {
  data.original = message;
  if (message.includes("hello")) {
    data.message = message + "0";
    await next();
  }
};

const guard2: GuardFunction = async ([]: [string], client, next, data) => {
  if (data.original === "hello0") {
    data.message += "1";
    await next();
  } else {
    data.message += "2";
  }
};

@Discord()
export class Example {
  @On()
  messageCreate([message]: [string]): string {
    return message;
  }

  @On({ event: "messageCreate" })
  messageCreate2([message]: [string]): string {
    return message;
  }

  @On()
  @Guard(guard1, guard2)
  messageDelete(
    []: [string],
    client: Client,
    guardParams: { message: string }
  ): void {
    guardParams.message += "3";
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Create on event", () => {
  it("Should create and execute two messages events", async () => {
    const res = await client.trigger("messageCreate", "test");
    expect(res).toEqual(["test", "test"]);
  });

  it("Should pass through guard", async () => {
    const res = await client.trigger("messageDelete", "test");
    expect(res[0].original).toEqual("test");
    expect(res[0].message).toEqual(undefined);

    const res2 = await client.trigger("messageDelete", "hello");
    expect(res2[0].original).toEqual("hello");
    expect(res2[0].message).toEqual("hello02");

    const res3 = await client.trigger("messageDelete", "hello0");
    expect(res3[0].original).toEqual("hello0");
    expect(res3[0].message).toEqual("hello0013");
  });
});
