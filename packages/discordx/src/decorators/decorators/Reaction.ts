import type { MethodDecoratorEx } from "@discordx/internal";

import type { ReactionOptions } from "../../index.js";
import { MetadataStorage } from "../../index.js";
import { DReaction } from "../classes/DReaction.js";

/**
 * Handle a reaction with a specified emoji
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction(): MethodDecoratorEx;

/**
 * Handle a reaction with a specified emoji (a Unicode string, custom name, or Snowflake)
 *
 * @param options - reaction options
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction<T extends string>(
  options: ReactionOptions<T>
): MethodDecoratorEx;

/**
 * Handle a reaction with a specified emoji (a Unicode string, custom name, or Snowflake)
 *
 * @param options - reaction options
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction(options?: ReactionOptions): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const react = DReaction.create({
      aliases: options?.aliases,
      botIds: options?.botIds,
      description: options?.description,
      directMessage: options?.directMessage,
      emoji: options?.emoji ?? key,
      guilds: options?.guilds,
      partial: options?.partial,
      remove: options?.remove,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addReaction(react);
  };
}
