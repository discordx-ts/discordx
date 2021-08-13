import { Snowflake } from "discord.js";
import { MetadataStorage, DComponentSelectMenu } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function SelectMenuComponent(id?: string): MethodDecoratorEx;
export function SelectMenuComponent(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
) {
  return function (target: Record<string, any>, key: string) {
    const button = DComponentSelectMenu.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
