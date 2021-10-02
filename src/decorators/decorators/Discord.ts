import { ClassMethodDecorator, DDiscord, MetadataStorage } from "../..";

/**
 * Class decorator for discord.ts instance
 * @param target The class of the destination (the class that is decorated by @Discord)
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/discord)
 * @category Decorator
 */

export function Discord(): ClassMethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: Record<string, any>) {
    const instance = DDiscord.create(target.name).decorate(target, target.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
