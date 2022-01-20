import { DEvent } from "../classes/DEvent.js";
import { MetadataStorage } from "../../logic/metadata.js";
import { MethodDecoratorEx } from "@discordx/internal";

export function On(
  name?: string,
  options?: { appId?: string }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    MetadataStorage.instance.addOn(
      DEvent.create({
        appId: options?.appId,
        name: name ?? key,
      }).decorate(target.constructor, key, target[key])
    );
  };
}
