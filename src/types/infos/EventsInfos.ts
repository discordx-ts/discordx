import { DiscordEvents, DDiscord } from "../..";

export interface EventInfos {
  event: DiscordEvents;
  discord?: DDiscord;
  once: boolean;
}
