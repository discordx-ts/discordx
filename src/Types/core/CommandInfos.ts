import { PrefixType } from "..";

export interface CommandInfos<InfoType = any> {
  prefix: PrefixType;
  commandName: string;
  description: string;
  infos: InfoType;
}
