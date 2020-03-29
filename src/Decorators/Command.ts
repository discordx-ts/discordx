import {
  MetadataStorage,
  ICommandParams
} from "..";

export function Command(commandName: string);
export function Command(commandName: string, params: ICommandParams);
export function Command(commandName: string, params?: ICommandParams) {
  const definedParams = params || {};
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        commandName,
        guards: [],
        event: "message",
        once: false,
        method: descriptor.value,
        ...params,
        commandCaseSensitive: definedParams.commandCaseSensitive || false,
        prefix: definedParams.prefix
      }
    });
  };
}
