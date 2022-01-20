import { ClassMethodDecorator, Modifier } from "@discordx/internal";
import { DEvent, DWs, MetadataStorage } from "../../index.js";

export function AppId(id: string): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DEvent | DWs>(
        (original) => {
          original.appId = id;
        },
        DEvent,
        DWs
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
