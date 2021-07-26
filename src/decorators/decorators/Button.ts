import { MetadataStorage, DButton } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function Button(id: string): MethodDecoratorEx;
export function Button(
  id: string,
  params?: { guilds?: string[]; botIds?: string[] }
) {
  return (target: Record<string, any>, key: string) => {
    const button = DButton.create(id, params?.guilds, params?.botIds).decorate(
      target.constructor,
      key,
      target[key]
    );
    MetadataStorage.instance.addButton(button);
  };
}
