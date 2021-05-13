import { DiscordEvents, ArgsOf, Client, DOn } from "../..";

export interface MainResponse {
  readonly on: DOn;
  readonly res: any;
  readonly executed: boolean;
}

export type MainMethod<Event extends DiscordEvents> = (
  params: ArgsOf<Event>,
  client: Client
) => Promise<MainResponse>;
