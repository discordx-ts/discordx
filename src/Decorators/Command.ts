import {
  MetadataStorage,
  ICommandParams
} from "..";

export function Command();
export function Command(commandName: string);
export function Command(params: ICommandParams);
export function Command(commandName: string, params: ICommandParams);
export function Command(commandNameOrParams?: string | ICommandParams, params?: ICommandParams) {
  const isCommandName = typeof commandNameOrParams === "string";
  let definedParams = params || {};
  let definedCommandName: string;

  if (!isCommandName) {
    if (commandNameOrParams) {
      definedParams = commandNameOrParams as ICommandParams;
    } else {
      definedParams = {};
    }
  } else {
    definedCommandName = commandNameOrParams as string;
  }

  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const method = descriptor.value;

    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        from: target.constructor,
        commandName: definedCommandName || key,
        guards: [],
        event: "message",
        once: false,
        method,
        ...definedParams,
        commandCaseSensitive: definedParams.commandCaseSensitive || false,
        prefix: definedParams.prefix,
        originalParams: {
          ...definedParams,
          commandName: definedCommandName
        }
      }
    });
  };
}
