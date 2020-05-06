import {
  MetadataStorage,
  CommandParams
} from "..";

export function Command();
export function Command(commandName: string);
export function Command(params: CommandParams);
export function Command(commandName: string, params: CommandParams);
export function Command(commandNameOrParams?: string | CommandParams, params?: CommandParams) {
  const isCommandName = typeof commandNameOrParams === "string";
  let definedParams = params || {};
  let definedCommandName: string;

  if (!isCommandName) {
    if (commandNameOrParams) {
      definedParams = commandNameOrParams as CommandParams;
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
