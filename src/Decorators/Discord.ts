import { MetadataStorage } from "..";

export function Discord(target: Object) {
  MetadataStorage.Instance.AddInstance({
    class: target,
    key: target.constructor.name,
    params: {
    }
  });
}
