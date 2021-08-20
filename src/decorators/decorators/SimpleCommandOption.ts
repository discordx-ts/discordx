import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
  Modifier,
  ParameterDecoratorEx,
  SimpleCommandType,
} from "../..";

/**
 * Define option for simple commnad
 * @param name option name
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommandoption)
 * @category Decorator
 */
export function SimpleCommandOption(name?: string): ParameterDecoratorEx;

/**
 * Define option for simple commnad
 * @param name option name
 * @param params additional configuration
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommandoption)
 * @category Decorator
 */
export function SimpleCommandOption(
  name: string,
  params?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx;

export function SimpleCommandOption(
  name?: string,
  params?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: Record<string, any>, key: string, index: number) {
    const type =
      params?.type ??
      // eslint-disable-next-line @typescript-eslint/ban-types
      ((Reflect.getMetadata("design:paramtypes", target, key) as Function[])[
        index
      ].name.toUpperCase() as "STRING" | "NUMBER" | "BOOLEAN" | undefined);

    const option = DSimpleCommandOption.create(
      name ?? key,
      type,
      params?.description
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    MetadataStorage.instance.addModifier(
      Modifier.create<DSimpleCommand>((original) => {
        original.options = [...original.options, option];
      }, DSimpleCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addSimpleCommandOption(option);
  };
}
