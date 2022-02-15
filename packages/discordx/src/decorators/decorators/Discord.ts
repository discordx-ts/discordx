import type { ClassDecoratorEx } from "@discordx/internal";

import { DDiscord, MetadataStorage } from "../../index.js";

/**
 * Class decorator for discord.ts instance
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/discord)
 * @category Decorator
 */
export function Discord(): ClassDecoratorEx {
  return function <T>(target: Record<string, T>) {
    const myClass = target as unknown as new () => unknown;
    const instance = DDiscord.create(myClass.name).decorate(
      myClass,
      myClass.name
    );
    MetadataStorage.instance.addDiscord(instance);
  };
}
