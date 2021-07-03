import { MetadataStorage, DSelectMenu } from "../..";

export function SelectMenu(
  id: string,
  params?: { guilds?: string[]; botIds?: [] }
) {
  return (target: Object, key: string) => {
    const button = DSelectMenu.create(
      id,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSelectMenu(button);
  };
}
