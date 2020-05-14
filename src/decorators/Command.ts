import {
  MetadataStorage,
  CommandParams,
  CommandName,
  DCommand,
  Expression
} from "..";

export function Command();
export function Command(params: CommandParams);
export function Command(params?: CommandParams) {
  let definedParams = params || {};

  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const method = descriptor.value;

    const command = (
      DCommand
      .createCommand(
        definedParams.commandName || key,
        definedParams.message,
        definedParams.prefix,
        definedParams.argsRules,
        definedParams.argsSeparator,
        definedParams.infos
      )
      .decorate(
        target.constructor,
        key,
        method
      )
    );

    MetadataStorage.instance.addCommand(command);
  };
}
