import { ArgsOf, Client, Next, DiscordEvents } from "../..";

export type GuardFunction<
  ArgsType extends DiscordEvents = any,
  NextObj = any,
  ReturnType = any
> = (
  params: ArgsOf<ArgsType>,
  client: Client,
  next: Next,
  nextObj?: NextObj
) => ReturnType;
