import { DWs, MetadataStorage } from "../../index.js";
import { ClassDecoratorEx } from "@discordx/internal";

export function Ws(options?: { appId?: string }): ClassDecoratorEx {
  return function <T>(target: Record<string, T>) {
    const myClass = target as unknown as new () => unknown;
    const instance = DWs.create({
      appId: options?.appId,
    }).decorate(myClass, myClass.name);
    MetadataStorage.instance.adDWs(instance);
  };
}
