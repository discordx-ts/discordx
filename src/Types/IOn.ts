import {
  DiscordEvent,
  IInstance
} from ".";

export interface IOn {
  event: DiscordEvent | string;
  method: (...params: any[]) => void;
  linkedInstance?: IInstance;
  once: boolean;
}
