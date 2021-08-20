import { ClassMethodDecorator, DDiscord, MetadataStorage } from "../..";

/**
 * Class decorator for discord.ts instance
 * @param target The class of the destination (the class that is decorated by @Discord)
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/discord)
 */

export function Discord(): ClassMethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function Discord(target: Record<string, any>) {
    const instance = DDiscord.create(target.name).decorate(target, target.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
