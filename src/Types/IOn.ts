import {
  DiscordEvent,
  IInstance,
  IDecorator,
  IGuard,
  ICommandParams
} from ".";

export interface IOn extends ICommandParams {
  commandName?: string;
  event: DiscordEvent;
  method: (...params: any[]) => void;
  compiledMethod?: (...params: any[]) => void;
  linkedInstance?: IDecorator<IInstance>;
  once: boolean;
  guards: IDecorator<IGuard>[];
  guardFn?: (...params: any[]) => Promise<any>;
}
