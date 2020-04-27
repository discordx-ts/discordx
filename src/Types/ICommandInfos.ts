import { PrefixType } from ".";

export interface ICommandInfos<InfoType = any> {
  prefix: PrefixType;
  commandName: string;
  description: string;
  infos: InfoType;
}
