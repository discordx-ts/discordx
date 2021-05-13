import { Discord, On, Client, Guard, GuardFunction } from "../src";

const guard1: GuardFunction<any, { message: string; original: string }> =
  async ([message]: [string], client, next, mwDatas) => {
    mwDatas.original = message;
    if (message.includes("hello")) {
      mwDatas.message = message + "0";
      await next();
    }
  };

const guard2: GuardFunction = async (
  [message]: [string],
  client,
  next,
  mwDatas
) => {
  if (mwDatas.original === "hello0") {
    mwDatas.message += "1";
    await next();
  } else {
    mwDatas.message += "2";
  }
};

@Discord()
abstract class Bot {
  @On("message")
  private onMessage([message]: [string]) {
    return message;
  }

  @On("message")
  private onMessage2([message]: [string]) {
    return message;
  }

  @On("messageDelete")
  @Guard(guard1, guard2)
  private onMessageDelete(
    [message]: [string],
    client: Client,
    guardParams: any
  ) {
    guardParams.message += "3";
  }
}

const client = new Client();

beforeAll(async () => {
  await client.build();
});

describe("Create on event", () => {
  it("Should create and execute two messages events", async () => {
    const res = await client.trigger("message", "test");
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
