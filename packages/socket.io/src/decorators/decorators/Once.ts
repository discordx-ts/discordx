import { DEvent } from "../classes/DEvent.js";
import { MetadataStorage } from "../../logic/metadata.js";
import { MethodDecoratorEx } from "@discordx/internal";

export function Once(
  name?: string,
  options?: { appId?: string }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    MetadataStorage.instance.addOnce(
      DEvent.create({
        appId: options?.appId,
        name: name ?? key,
      }).decorate(target.constructor, key, target[key])
    );
  };
}
