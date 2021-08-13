import { Snowflake } from "discord.js";
import { MetadataStorage, DComponentButton } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function ButtonComponent(id?: string): MethodDecoratorEx;
export function ButtonComponent(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
) {
  return (target: Record<string, any>, key: string) => {
    const button = DComponentButton.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
