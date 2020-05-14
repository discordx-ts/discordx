import {
  ArgsOf,
  Client,
  Next
} from "../..";

export type GuardFunction<PreviousArgs = any> =
  ((params: ArgsOf<any>, client: Client, next: Next, ...previousArgs: PreviousArgs[]) => Promise<any> | Promise<void> | any | void);

