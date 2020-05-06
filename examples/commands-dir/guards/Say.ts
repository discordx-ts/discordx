import { ArgsOf } from "../../../src";

export function Say(text: string) {
  return (
    [message]: ArgsOf<"commandMessage">
  ) => {
    console.log(message.prefix, text);
    return true;
  };
}
