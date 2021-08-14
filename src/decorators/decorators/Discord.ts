import { MetadataStorage, DDiscord } from "../..";

/**
 * Class decorator for discord.ts instance
 * @param target The class of the destination (the class that is decorated by @Discord)
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/discord)
 */

export function Discord() {
  return function Discord(target: Record<string, any>) {
    const instance = DDiscord.create(target.name).decorate(target, target.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
