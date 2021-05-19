import { ArgsOf, GuardFunction } from "../../../src";

export const Say = (text: string) => {
  const guard: GuardFunction<"message"> = async (
    [message],
    client,
    next,
    nextObj
  ) => {
    console.log(message.content, text);
    await next();
  };

  return guard;
};
