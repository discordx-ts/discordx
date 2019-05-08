import { DiscordEvent } from "src/Types";

export interface IOn {
  event: DiscordEvent | string;
  method: (...params: any) => void;
}
