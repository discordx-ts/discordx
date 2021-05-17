import {
  MetadataStorage,
  DCommand,
  Expression,
  ExpressionFunction
} from "../..";

export function Command();
export function Command(rule: (Expression | ExpressionFunction));
export function Command(rule: (Expression | ExpressionFunction), ...params: string[]);
export function Command(rule?: Expression | ExpressionFunction, ...params: string[]) {
  return async (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    let finalRule: Expression | ExpressionFunction = rule;
  
    if (!finalRule) {
      finalRule = key;
    }

    const command = DCommand.createCommand(finalRule, params).decorate(
      target.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addCommand(command);
  };
}
