import { DiscordEvents, DDiscord } from "../..";

export interface EventInfos {
  event: DiscordEvents;
  linkedInstance?: DDiscord;
  once: boolean;
}
