import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentTypeX, DComponent, MetadataStorage } from "../../index.js";

/**
 * Define button interaction handler
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
 * @category Decorator
 */
export function ButtonComponent(id?: string | RegExp): MethodDecoratorEx;
export function ButtonComponent(
  id: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create(
      ComponentTypeX.Button,
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
