import {
  DiscordEvents,
  DInstance,
  Decorator,
  DGuard,
  CommandParams
} from "..";

export interface DOn extends CommandParams {
  commandName?: string;
  event: DiscordEvents;
  method: (...params: any[]) => void;
  compiledMethod?: (...params: any[]) => void;
  linkedInstance?: Decorator<DInstance>;
  once: boolean;
  guards: Decorator<DGuard>[];
  guardFn?: (...params: any[]) => Promise<any>;
  from: Function;
  originalParams: Partial<DOn>;
}
