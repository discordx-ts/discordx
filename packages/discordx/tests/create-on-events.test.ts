import type { GuardFunction } from "../build/cjs/index.js";
import { Client, Discord, Guard, On } from "../build/cjs/index.js";

const guard1: GuardFunction = async (
  [message]: [string],
  client,
  next,
  mwDatas
) => {
  mwDatas.original = message;
  if (message.includes("hello")) {
    mwDatas.message = message + "0";
    await next();
  }
};

const guard2: GuardFunction = async ([]: [string], client, next, mwDatas) => {
  if (mwDatas.original === "hello0") {
    mwDatas.message += "1";
    await next();
  } else {
    mwDatas.message += "2";
  }
};

@Discord()
export abstract class Bot {
  @On("messageCreate")
  private onMessage([message]: [string]) {
    return message;
  }

  @On("messageCreate")
  private onMessage2([message]: [string]) {
    return message;
  }

  @On("messageDelete")
  @Guard(guard1, guard2)
  private onMessageDelete(
    []: [string],
    client: Client,
    guardParams: { message: string }
  ) {
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
