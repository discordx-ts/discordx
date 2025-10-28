/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Events } from "discord.js";
import { Client, Discord, Guard, type GuardFunction, On } from "discordx";

const guard1: GuardFunction = async (
  [message]: [string],
  _client,
  next,
  data,
) => {
  data.original = message;
  if (message.includes("hello")) {
    data.message = `${message}-suffix`;
    await next();
  }
};

const guard2: GuardFunction = async (
  _: [string],
  _client,
  next,
  data: { message: string; original: string },
) => {
  if (data.original === "hello-test") {
    data.message += "-1";
    await next();
  } else {
    data.message += "-2";
  }
};

// biome-ignore lint/suspicious/noExportsInTest: ignore
@Discord()
export class Example {
  @On()
  messageCreate([message]: [string]): string {
    return message;
  }

  @On({ event: Events.MessageCreate })
  messageCreate2([message]: [string]): string {
    return message;
  }

  @On()
  @Guard(guard1, guard2)
  messageDelete(
    _: [string],
    _client: Client,
    guardParams: { message: string },
  ): void {
    guardParams.message += "-3";
  }
}

const client = new Client({ intents: [] });

beforeAll(async () => {
  await client.build();
});

describe("Create on event", () => {
  it("Should create and execute two messages events", async () => {
    const res = await client.trigger(
      {
        eventName: "messageCreate",
        isOnce: false,
        isRest: false,
      },
      "test",
    );
    expect(res).toEqual(["test", "test"]);
  });

  it("Should pass through guard", async () => {
    const res = await client.trigger(
      {
        eventName: "messageDelete",
        isOnce: false,
        isRest: false,
      },
      "test",
    );
    expect(res[0].original).toEqual("test");
    expect(res[0].message).toEqual(undefined);

    const res2 = await client.trigger(
      {
        eventName: "messageDelete",
        isOnce: false,
        isRest: false,
      },
      "hello",
    );
    expect(res2[0].original).toEqual("hello");
    expect(res2[0].message).toEqual("hello-suffix-2");

    const res3 = await client.trigger(
      {
        eventName: "messageDelete",
        isOnce: false,
        isRest: false,
      },
      "hello-test",
    );
    expect(res3[0].original).toEqual("hello-test");
    expect(res3[0].message).toEqual("hello-test-suffix-1-3");
  });
});
