import {
  DiscordEvent,
  IInstance,
  IDecorator,
  IGuard
} from ".";

export interface IOn {
  event: DiscordEvent | string;
  method: (...params: any[]) => void;
  linkedInstance?: IInstance;
  once: boolean;
  guards: IDecorator<IGuard>[];
  guardFn?: (...params: any[]) => Promise<any>;
}
