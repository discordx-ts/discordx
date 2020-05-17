import {
  MetadataStorage,
  DCommand,
  Expression,
  ExpressionFunction
} from "../..";

export function Command();
export function Command(commandName: Expression);
export function Command(commandName: ExpressionFunction);
export function Command(commandName?: Expression | ExpressionFunction) {
  return async (target: Object, key: string, descriptor: PropertyDescriptor) => {
    const command = (
      DCommand
      .createCommand(
        commandName
      )
      .decorate(
        target.constructor,
        key,
        descriptor.value
      )
    );

    MetadataStorage.instance.addCommand(command);
  };
}
