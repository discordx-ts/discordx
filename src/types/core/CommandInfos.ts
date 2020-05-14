import {
  PrefixType,
  CommandName
} from "..";

export interface CommandInfos<InfoType = any> {
  prefix: PrefixType;
  commandName: CommandName;
  description: string;
  infos: InfoType;
  caseSensitive: boolean;
  argsSeparator: string;
}
