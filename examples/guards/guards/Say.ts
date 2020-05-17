import { ArgsOf, GuardFunction } from "../../../src";

export const Say = (text: string) => {
  const guard: GuardFunction<"commandMessage"> = async (
    [message],
    client,
    next,
    nextObj
  ) => {
    console.log(message.prefix, text);
    await next();
  };

  return guard;
};
