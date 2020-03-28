import {
  MetadataStorage,
  IDiscordParams
} from "..";

export function Discord();
export function Discord(params: IDiscordParams);
export function Discord(params?: IDiscordParams) {
  const definedParams = params || {};
  return (target: Object) => {
    MetadataStorage.Instance.AddInstance({
      class: target,
      key: target.constructor.name,
      params: {
        prefix: definedParams.prefix || "",
        commandCaseSensitive: definedParams.commandCaseSensitive || false
      }
    });
  };
}
