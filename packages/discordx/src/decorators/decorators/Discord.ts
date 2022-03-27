import type { ClassDecoratorEx } from "@discordx/internal";

import { DDiscord, MetadataStorage } from "../../index.js";

/**
 * Create a metadata instance for the class
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/discord)
 *
 * @category Decorator
 */
export function Discord(): ClassDecoratorEx {
  return function <T>(target: Record<string, T>) {
    const clazz = target as unknown as new () => unknown;
    const instance = DDiscord.create(clazz.name).decorate(clazz, clazz.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
