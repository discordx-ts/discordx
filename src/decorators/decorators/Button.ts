import { MetadataStorage, DButton } from "../..";

export function Button(id: string);
export function Button(
  id: string,
  params?: { guilds?: string[]; botIds?: [] }
) {
  return (target: Object, key: string) => {
    const button = DButton.create(id, params?.guilds, params?.botIds).decorate(
      target.constructor,
      key,
      target[key]
    );
    MetadataStorage.instance.addButton(button);
  };
}
