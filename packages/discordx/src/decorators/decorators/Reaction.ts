import type { MethodDecoratorEx } from "@discordx/internal";

import type { NotEmpty, ReactionOptions } from "../../index.js";
import { MetadataStorage } from "../../index.js";
import { DReaction } from "../classes/DReaction.js";

/**
 * Handle a reaction with a specified emoji
 *
 * @param emoji - Emoji, in the form of a Unicode string, custom name, or Snowflake.
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction<T extends string>(
  emoji: NotEmpty<T>
): MethodDecoratorEx;

/**
 * Handle a reaction with a specified emoji
 *
 * @param emoji - Emoji, in the form of a Unicode string, custom name, or Snowflake.
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction<T extends string>(
  emoji: NotEmpty<T>,
  options: ReactionOptions
): MethodDecoratorEx;

/**
 * Handle a reaction with a specified emoji
 *
 * @param emoji - Emoji, in the form of a Unicode string, custom name, or Snowflake.
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/reaction)
 *
 * @category Decorator
 */
export function Reaction(
  emoji: string,
  options?: ReactionOptions
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const react = DReaction.create({
      aliases: options?.aliases,
      botIds: options?.botIds,
      description: options?.description,
      directMessage: options?.directMessage,
      emoji: emoji,
      guilds: options?.guilds,
      partial: options?.partial,
      remove: options?.remove,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addReaction(react);
  };
}
