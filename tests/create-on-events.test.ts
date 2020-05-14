import { Discord, On, Client, Guard, GuardFunction } from "../src";

const guard1: GuardFunction = ([message]: [string]) => {
  const initialMessage = message;
  // tslint:disable-next-line: no-parameter-reassignment
  message += "0";
};

const guard2: GuardFunction = ([message]: [string]) => {
  return message === "hello0";
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
  private onMessageDelete([message]: [string]) {
    return message;
  }
}

const client = new Client();
client.build();

describe("Create on event", () => {
  it("Should create and execute two messages events", async () => {
    const res = await client.trigger("message", "test");
    expect(res).toEqual(["test", "test"]);
  });

  it("Should pass through guard", async () => {
    const res = await client.trigger("messageDelete", "test");
    expect(res).toEqual([undefined]);

    const res2 = await client.trigger("messageDelete", "hello");
    expect(res2).toEqual([undefined]);

    const res3 = await client.trigger("messageDelete", "hello0");
    expect(res3).toEqual(["hello0"]);
  });
});
