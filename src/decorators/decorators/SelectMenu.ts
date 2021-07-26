import { Snowflake } from "discord.js";
import { MetadataStorage, DSelectMenu } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function SelectMenu(id?: string): MethodDecoratorEx;
export function SelectMenu(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx;

export function SelectMenu(
  id?: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
) {
  return function (target: Record<string, any>, key: string) {
    const button = DSelectMenu.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSelectMenu(button);
  };
}
