import "reflect-metadata";
import { MetadataStorage, Modifier } from "../..";
import { DCommand } from "../classes/DCommand";
import { DCommandOption } from "../classes/DCommandOption";

export function CommandOption(name: string);
export function CommandOption(
  name: string,
  params: { description?: string; type?: "string" | "number" | "boolean" }
);
export function CommandOption(
  name: string,
  params?: { description?: string; type?: "string" | "number" | "boolean" }
) {
  return (target: Object, key: string, index: number) => {
    const type =
      params?.type ??
      ((
        Reflect.getMetadata("design:paramtypes", target, key)[index]
          .name as string
      ).toLowerCase() as "string" | "number" | "boolean");

    const option = DCommandOption.create(
      name ?? key,
      type,
      params?.description
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    MetadataStorage.instance.addModifier(
      Modifier.create<DCommand>((original) => {
        original.options = [...original.options, option];
      }, DCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addCommandOption(option);
  };
}
