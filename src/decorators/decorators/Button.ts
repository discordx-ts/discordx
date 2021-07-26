import { Snowflake } from "discord.js";
import { MetadataStorage, DButton } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function Button(id?: string): MethodDecoratorEx;
export function Button(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx;

export function Button(
  id?: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
) {
  return (target: Record<string, any>, key: string) => {
    const button = DButton.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addButton(button);
  };
}
