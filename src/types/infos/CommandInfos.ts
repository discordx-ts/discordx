import { InfosType, ExpressionFunction } from "../..";

export interface CommandInfos<InfoType = any> {
  prefix: ExpressionFunction;
  name: string;
  description: string;
  infos: InfosType<InfoType>;
  rules: ExpressionFunction[];
}
