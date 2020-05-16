import * as Glob from "glob";
import {
  MetadataStorage,
  DiscordParams,
  DDiscord,
  RuleBuilder,
  Expression,
  DiscordParamsLimited,
  Rule
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
export function Discord(prefix: Expression);
export function Discord(params: DiscordParams);
export function Discord(prefix: Expression, params: DiscordParamsLimited);
export function Discord(prefixOrParams?: DiscordParams | Expression, params?: DiscordParams) {
  const isPrefix = RuleBuilder.isSimpleExpression(prefixOrParams);
  const finalParams = isPrefix ? params : prefixOrParams as DiscordParams;
  const finalPrefix = isPrefix ? prefixOrParams as Expression : finalParams?.prefix;

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

    const instance = (
      DDiscord
      .createDiscord([
        () => ({
          separator: "",
          rules: [Rule().startWith(finalPrefix)]
        })
      ])
      .decorate(
        target,
        target.constructor.name,
        target
      )
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
