import {
  MetadataStorage,
  ICommandNotFoundParams
} from "..";

export function CommandNotFound();
export function CommandNotFound(params: ICommandNotFoundParams);
export function CommandNotFound(params?: ICommandNotFoundParams) {
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
