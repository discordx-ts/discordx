import { DComponentButton, MetadataStorage, MethodDecoratorEx } from "../..";
import { Snowflake } from "discord.js";

/**
 * Define button interaction handler
 * @param id your button custom id
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent)
 */
export function ButtonComponent(id?: string): MethodDecoratorEx;

/**
 * Define button interaction handler
 * @param id your button custom id
 * @param params additional configuration for button component
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent)
 */
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
