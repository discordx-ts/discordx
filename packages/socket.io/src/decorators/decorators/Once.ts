import type { MethodDecoratorEx } from "@discordx/internal";

import { MetadataStorage } from "../../logic/metadata.js";
import { DEvent } from "../classes/DEvent.js";

export function Once(
  name?: string,
  options?: { appId?: string }
): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    MetadataStorage.instance.addOnce(
      DEvent.create({
        appId: options?.appId,
        name: name ?? key,
      }).decorate(target.constructor, key, target[key])
    );
  };
}
