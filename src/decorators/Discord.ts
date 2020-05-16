import * as Glob from "glob";
import {
  MetadataStorage,
  DiscordParams,
  DDiscord,
  Expression,
  DiscordParamsLimited,
  FlatArgsRulesFunction
} from "..";

function importCommand(classType: Function, target: Function) {
  const ons = MetadataStorage.instance.events.filter((on) => {
    return on.classRef === classType;
  });

  ons.map((on) => {
    on.classRef = target;
    on.from = classType;
  });
}

export function Discord();
export function Discord(prefix: Expression | FlatArgsRulesFunction);
export function Discord(prefix: Expression | FlatArgsRulesFunction, params: DiscordParamsLimited);
export function Discord(prefix?: Expression | FlatArgsRulesFunction, params?: DiscordParams) {
  const finalParams = params  || {};

  return (target: Function) => {
    if (finalParams?.importCommands) {
      finalParams?.importCommands.map((cmd) => {
        if (typeof cmd === "string") {
          const files = Glob.sync(cmd);
          files.map((file) => {
            let classType;
            const classImport = require(file);
            if (classImport.default) {
              classType = classImport.default;
            } else {
              const key = Object.keys(classImport)[0];
              classType = classImport[key];
            }
            importCommand(classType, target);
          });
        } else {
          importCommand((cmd as any).execute, target);
        }
      });
    }

    let finalArgsRule: FlatArgsRulesFunction;

    if (typeof prefix === "function") {
      finalArgsRule = prefix;
    } else {
      finalArgsRule = () => ({
        separator: "",
        rules: [prefix]
      });
    }

    const instance = (
      DDiscord
      .createDiscord(
        [finalArgsRule],
        prefix
      )
      .decorate(
        target,
        target.constructor.name,
        target
      )
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
