import { DiscordEvent } from ".";

export interface IOn {
  event: DiscordEvent | string;
  method: (...params: any[]) => void;
}
