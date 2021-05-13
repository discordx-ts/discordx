import { InfosType, Expression, ExpressionFunction } from "../..";

export interface CommandNotFoundInfos<InfoType = any> {
  prefix: Expression | ExpressionFunction;
  infos: InfosType<InfoType>;
  description: string;
}
