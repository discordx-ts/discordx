import { Snowflake } from "discord.js";
import { MetadataStorage, DSelectMenu } from "../..";

export function SelectMenu(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
) {
  return function (target: Record<string, any>, key: string) {
    const button = DSelectMenu.create(
      id,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSelectMenu(button);
  };
}
