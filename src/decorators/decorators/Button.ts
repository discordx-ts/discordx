import { Snowflake } from "discord.js";
import { MetadataStorage, DButtonComponent } from "../..";
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
    const button = DButtonComponent.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addButton(button);
  };
}
