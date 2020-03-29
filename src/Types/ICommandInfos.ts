export interface ICommandInfos<InfoType = any> {
  prefix: string;
  commandName: string;
  description: string;
  infos: InfoType;
}
