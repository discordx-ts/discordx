import {
  ArgsOf,
  Client,
  Next,
  DOn
} from "../..";

export type GuardFunction<PreviousArgs = any> =
  ((params: ArgsOf<any>, client: Client, event: DOn, next: Next, ...previousArgs: PreviousArgs[]) => Promise<any> | Promise<void> | any | void);

