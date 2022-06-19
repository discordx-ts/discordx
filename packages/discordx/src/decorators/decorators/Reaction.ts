import type { MethodDecoratorEx } from "@discordx/internal";

import type { NotEmpty, ReactionOptions } from "../../index.js";
import { MetadataStorage } from "../../index.js";
import { DReaction } from "../classes/DReaction.js";

export function Reaction<T extends string>(
  name: NotEmpty<T>
): MethodDecoratorEx;

export function Reaction<T extends string>(
  name: NotEmpty<T>,
  options: ReactionOptions
): MethodDecoratorEx;

export function Reaction(
  name: string,
  options?: ReactionOptions
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const react = DReaction.create(
      name,
      options?.aliases,
      options?.botIds,
      options?.description,
      options?.directMessage,
      options?.guilds,
      options?.remove,
      options?.partial
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addReaction(react);
  };
}
