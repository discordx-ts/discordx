import {
  MetadataStorage,
  CommandNotFoundParams
} from "..";

export function CommandNotFound();
export function CommandNotFound(params: CommandNotFoundParams);
export function CommandNotFound(params?: CommandNotFoundParams) {
  const definedParams = params || {};
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        from: target.constructor,
        commandName: "",
        prefix: definedParams.prefix,
        guards: [],
        event: "message",
        once: false,
        method: descriptor.value,
        originalParams: definedParams
      }
    });
  };
}
