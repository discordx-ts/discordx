import { MetadataStorage } from "../..";
import { DCommand } from "../classes/DCommand";
import { CommandParams } from "../params/CommandParams";

const testName = RegExp(/^[a-z0-9]+$/);

export function Command();
export function Command(name: string);
export function Command(name: string, params: CommandParams);
export function Command(name?: string, params?: CommandParams) {
  return (target: Object, key: string) => {
    name = name ?? key;
    name = name.toLocaleLowerCase();
    if (!testName.test(name)) throw Error("invalid command name");

    const cmd = DCommand.create(
      name,
      params?.description,
      params?.argSplitter,
      params?.directMessage,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addCommand(cmd);
  };
}
