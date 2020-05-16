import {
  InfosType,
  Expression,
  FlatArgsRulesFunction
} from "../..";

export interface CommandNotFoundInfos<InfoType = any> {
  prefix: Expression | FlatArgsRulesFunction;
  infos: InfosType<InfoType>;
  description: string;
}
